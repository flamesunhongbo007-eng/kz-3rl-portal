/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FEISHU_APP_ID?: string;
  readonly VITE_FEISHU_APP_SECRET?: string;
  readonly VITE_FEISHU_BITABLE_APP_TOKEN?: string;
  readonly VITE_FEISHU_TABLE_SECTIONS?: string;
  readonly VITE_FEISHU_TABLE_CONTENT?: string;
  readonly VITE_FEISHU_TABLE_EMBEDS?: string;
  readonly VITE_FEISHU_TABLE_MEMBERS?: string;
  readonly VITE_FEISHU_TABLE_MILESTONES?: string;
  readonly VITE_FEISHU_TABLE_RISKS?: string;
  readonly VITE_FEISHU_TABLE_DECISIONS?: string;
  readonly VITE_FEISHU_TABLE_DASHBOARDS?: string;
  readonly VITE_ADMIN_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
