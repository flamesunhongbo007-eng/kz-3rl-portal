// 数据访问层：mock 默认，env 填全后自动切真飞书
// 用户的修改（在后台）会持久化到 localStorage

import { feishuEnv, isMockMode } from './config';
import { mockStore, mockSections, mockContentItems, mockEmbeds, mockMembers, mockMilestones, mockRisks, mockDecisions, mockDashboards } from './mockData';
import type { Section, ContentItem, FeishuEmbed, Member, Milestone, Risk, Decision, Dashboard, TableName } from './types';

const STORAGE_KEY = 'kz-3rl-portal:overrides';

type AnyRecord = Section | ContentItem | FeishuEmbed | Member | Milestone | Risk | Decision | Dashboard;

const loadOverrides = (): Record<string, AnyRecord[]> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveOverrides = (overrides: Record<string, AnyRecord[]>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
};

const getTable = <T extends AnyRecord>(name: TableName, defaults: T[]): T[] => {
  const overrides = loadOverrides();
  return (overrides[name] as T[] | undefined) ?? defaults;
};

const setTable = (name: TableName, rows: AnyRecord[]) => {
  const overrides = loadOverrides();
  overrides[name] = rows;
  saveOverrides(overrides);
};

// 通用 CRUD
export const dataApi = {
  // 列出（带排序）
  async list<T extends AnyRecord>(table: TableName, orderBy?: (a: T, b: T) => number): Promise<T[]> {
    if (!isMockMode()) {
      return realList<T>(table, orderBy);
    }
    // mock 路径
    const defaults = (mockStore as any)[table] as T[];
    const rows = getTable<T>(table, defaults);
    return orderBy ? [...rows].sort(orderBy) : rows;
  },

  async get<T extends AnyRecord>(table: TableName, recordId: string): Promise<T | null> {
    const rows = await this.list<T>(table);
    return rows.find((r) => r.record_id === recordId) ?? null;
  },

  async create<T extends AnyRecord>(table: TableName, data: Omit<T, 'record_id'>): Promise<T> {
    if (!isMockMode()) return realCreate<T>(table, data);
    const defaults = (mockStore as any)[table] as T[];
    const rows = getTable<T>(table, defaults);
    const newRow = { ...data, record_id: `${table.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` } as T;
    setTable(table, [...rows, newRow]);
    return newRow;
  },

  async update<T extends AnyRecord>(table: TableName, recordId: string, data: Partial<T>): Promise<T> {
    if (!isMockMode()) return realUpdate<T>(table, recordId, data);
    const defaults = (mockStore as any)[table] as T[];
    const rows = getTable<T>(table, defaults);
    const idx = rows.findIndex((r) => r.record_id === recordId);
    if (idx === -1) throw new Error(`Record not found: ${recordId}`);
    const updated = { ...rows[idx], ...data } as T;
    const next = [...rows];
    next[idx] = updated;
    setTable(table, next);
    return updated;
  },

  async remove(table: TableName, recordId: string): Promise<void> {
    if (!isMockMode()) return realRemove(table, recordId);
    const defaults = (mockStore as any)[table] as AnyRecord[];
    const rows = getTable(table, defaults);
    setTable(table, rows.filter((r) => r.record_id !== recordId));
  },

  // 复位 mock 数据
  async resetMock(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  },
};

// ============ 真飞书实现（开发备用，env 填了自动启用）============

let tokenCache: { token: string; expire: number } = { token: '', expire: 0 };

const getToken = async (): Promise<string> => {
  if (tokenCache.token && tokenCache.expire > Date.now() + 60_000) return tokenCache.token;
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: feishuEnv.appId, app_secret: feishuEnv.appSecret }),
  });
  const j = await res.json();
  if (j.code !== 0) throw new Error(`飞书 token 失败: ${j.msg}`);
  tokenCache = { token: j.tenant_access_token, expire: Date.now() + j.expire * 1000 };
  return tokenCache.token;
};

const feishuFetch = async (path: string, init: RequestInit = {}) => {
  const token = await getToken();
  const res = await fetch(`https://open.feishu.cn/open-apis${path}`, {
    ...init,
    headers: {
      ...init.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
};

const tableId = (name: TableName): string => (feishuEnv.tableIds as any)[name];

const realList = async <T extends AnyRecord>(table: TableName, _orderBy?: any): Promise<T[]> => {
  const j = await feishuFetch(
    `/bitable/v1/apps/${feishuEnv.bitableAppToken}/tables/${tableId(table)}/records?page_size=500`,
  );
  if (j.code !== 0) throw new Error(`list ${table}: ${j.msg}`);
  return (j.data.items as any[]).map((it) => ({ record_id: it.record_id, ...it.fields }));
};

const realCreate = async <T extends AnyRecord>(table: TableName, data: Omit<T, 'record_id'>): Promise<T> => {
  const j = await feishuFetch(
    `/bitable/v1/apps/${feishuEnv.bitableAppToken}/tables/${tableId(table)}/records`,
    { method: 'POST', body: JSON.stringify({ fields: data }) },
  );
  if (j.code !== 0) throw new Error(`create ${table}: ${j.msg}`);
  return { record_id: j.data.record.record_id, ...(j.data.record.fields as any) } as T;
};

const realUpdate = async <T extends AnyRecord>(table: TableName, recordId: string, data: Partial<T>): Promise<T> => {
  const j = await feishuFetch(
    `/bitable/v1/apps/${feishuEnv.bitableAppToken}/tables/${tableId(table)}/records/${recordId}`,
    { method: 'PUT', body: JSON.stringify({ fields: data }) },
  );
  if (j.code !== 0) throw new Error(`update ${table}: ${j.msg}`);
  return { record_id: j.data.record.record_id, ...(j.data.record.fields as any) } as T;
};

const realRemove = async (table: TableName, recordId: string): Promise<void> => {
  const j = await feishuFetch(
    `/bitable/v1/apps/${feishuEnv.bitableAppToken}/tables/${tableId(table)}/records/${recordId}`,
    { method: 'DELETE' },
  );
  if (j.code !== 0) throw new Error(`delete ${table}: ${j.msg}`);
};

// 便捷 hooks 友好导出
export const useMockMode = isMockMode;
