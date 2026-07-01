// 飞书运行时配置：env 全填了用真飞书，否则用 mock
// 切换方式：在 .env.local 把 VITE_FEISHU_* 全填上即可

export interface FeishuEnv {
  appId?: string;
  appSecret?: string;
  bitableAppToken?: string;
  tableIds: Record<string, string>;
}

const env = import.meta.env;

export const feishuEnv: FeishuEnv = {
  appId: env.VITE_FEISHU_APP_ID,
  appSecret: env.VITE_FEISHU_APP_SECRET,
  bitableAppToken: env.VITE_FEISHU_BITABLE_APP_TOKEN,
  tableIds: {
    SECTIONS: env.VITE_FEISHU_TABLE_SECTIONS || '',
    CONTENT: env.VITE_FEISHU_TABLE_CONTENT || '',
    EMBEDS: env.VITE_FEISHU_TABLE_EMBEDS || '',
    MEMBERS: env.VITE_FEISHU_TABLE_MEMBERS || '',
    MILESTONES: env.VITE_FEISHU_TABLE_MILESTONES || '',
    RISKS: env.VITE_FEISHU_TABLE_RISKS || '',
    DECISIONS: env.VITE_FEISHU_TABLE_DECISIONS || '',
    DASHBOARDS: env.VITE_FEISHU_TABLE_DASHBOARDS || '',
  },
};

export const isMockMode = (): boolean => {
  return !feishuEnv.appId || !feishuEnv.appSecret || !feishuEnv.bitableAppToken;
};

export const adminPassword = (): string => env.VITE_ADMIN_PASSWORD || 'admin123';
