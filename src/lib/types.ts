// 业务领域类型
export interface Section {
  record_id: string;
  section_key: string;
  title_zh: string;
  title_ru?: string;
  order: number;
  visible: boolean;
  icon: string;
  bg_class?: string;
  description?: string;
}

export interface ContentItem {
  record_id: string;
  section_key: string; // link → Section
  title: string;
  body_md?: string;
  date?: number; // ms timestamp
  status?: string;
  tags?: string[];
  extra_json?: string;
}

export interface FeishuEmbed {
  record_id: string;
  embed_key: string;
  url: string;
  title: string;
  section_key: string;
  height?: number;
}

export interface Member {
  record_id: string;
  name: string;
  role: string;
  org?: string;
  avatar_url?: string;
  bio?: string;
  lang?: string;
  email?: string;
}

export interface Milestone {
  record_id: string;
  title: string;
  planned_date: number;
  actual_date?: number;
  phase: string;
  status: string;
  linked_items?: string[];
}

export interface Risk {
  record_id: string;
  title: string;
  severity: '低' | '中' | '高' | '严重';
  probability: '低' | '中' | '高';
  owner?: string;
  mitigation?: string;
  status: string;
}

export interface Decision {
  record_id: string;
  title: string;
  decision_date: number;
  decider: string;
  rationale?: string;
  related_docs?: string[];
}

export interface Dashboard {
  record_id: string;
  dashboard_key: 'earthwork' | 'key_events' | 'equipment';
  widget_type: string;
  data_source: string;
  config_json?: string;
}

// 飞书表名映射（与 .env.local 里的 VITE_FEISHU_TABLE_* 对应）
export const TABLES = {
  SECTIONS: 'SECTIONS',
  CONTENT: 'CONTENT',
  EMBEDS: 'EMBEDS',
  MEMBERS: 'MEMBERS',
  MILESTONES: 'MILESTONES',
  RISKS: 'RISKS',
  DECISIONS: 'DECISIONS',
  DASHBOARDS: 'DASHBOARDS',
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];
