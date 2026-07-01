# 哈萨克斯坦第三条铁路项目门户 · KZ-3RL Portal

科技/产品发布风的项目门户，仿 Tzafit II 站点风格。React + TypeScript + Tailwind + Chart.js，数据源**默认 mock**（在浏览器 localStorage），可一键切换到**飞书多维表格**。

---

## ✨ 特性

- 🎨 科技风：深色 `#020617` + CAD 网格 + 玻璃拟态 + 渐变边框
- 📦 11 个公开板块 + 7 个后台 CRUD 页面
- 🪄 后台可视化增删改，**改完前台立刻可见**
- 🔌 飞书多维表格当后端（可选），env 填好即切真飞书
- 🌍 一键 ngrok 暴露给团队

---

## 🚀 启动

```bash
# 1. 安装依赖
cd /Users/hongbosun/Projects/kz-3rl-portal
npm install

# 2. 启动开发服务器
npm run dev
# 浏览器打开 http://localhost:5173

# 3. 暴露给团队
./start-ngrok.sh   # 会给你一个 https://xxx.ngrok-free.app 链接
```

默认后台密码：`admin123`（修改 `.env.local` 的 `VITE_ADMIN_PASSWORD`）

---

## 🛠️ 后续编辑指南（你拿到代码后能做什么）

### A. 改文字 / 板块 / 内容

**不用动代码**。直接浏览器访问 `/admin`：

| 想改什么 | 去哪改 |
|---|---|
| 顶部导航的板块名 / 顺序 / 显隐 | `/admin/sections` |
| 任务、文档、公告等内容条目 | `/admin/content` |
| 嵌入的飞书表格 URL | `/admin/embeds` |
| 团队成员 | `/admin/members` |
| 里程碑 | `/admin/milestones` |
| 风险登记 | `/admin/risks` |
| 决策日志 | `/admin/decisions` |

改完自动保存到浏览器 localStorage，**前台刷新即可见**。

### B. 改样式 / 颜色

- **主题色**（蓝/橙/绿/黄等 8 色）：编辑 `src/styles/theme.ts`
- **Tailwind 颜色 token**：`tailwind.config.ts` 里的 `colors`
- **背景 / 字体 / 间距**：`src/styles/globals.css` 和 `tailwind.config.ts`

### C. 加新板块

1. 后台 `/admin/sections` → 新增板块（图标、KEY、标题、说明）
2. 后台 `/admin/content` → 添加条目，板块选新 KEY
3. 刷新首页就能看到

### D. 加新页面（如果现有 11 个板块不够用）

在 `src/routes/` 下加新文件，参考 `Tasks.tsx` 模板。然后在 `src/App.tsx` 加路由：

```tsx
<Route path="/section/mysection" element={<MyNewPage />} />
```

### E. 上传 KML 线路图

把 KML 文件重命名为 `route.kml`，复制到 `public/` 目录。访问 `/section/map` 自动加载。

### F. 切换到真飞书（不是 mock）

1. **飞书开放平台** → 创建企业自建应用
2. 开通权限：`bitable:app:readonly` / `bitable:app:write` / `bitable:record:read` / `bitable:record:write`
3. **飞书多维表格** → 创建一个新 base，建好 8 张表（**字段名必须用 `field name` 不是 ID**）：

| 表 | 必建字段 |
|---|---|
| `Sections` | section_key (text), title_zh (text), order (number), visible (checkbox), icon (text) |
| `Content_Items` | section_key (link→Sections), title (text), body_md (text), date (date), status (single-select), tags (multi-select) |
| `Embeds` | embed_key (text), url (text), title (text), section_key (link→Sections), height (number) |
| `Members` | name (text), role (text), org (text), email (text) |
| `Milestones` | title (text), planned_date (date), actual_date (date), phase (text), status (single-select) |
| `Risks` | title (text), severity (single-select:低/中/高/严重), probability (single-select), owner (text), mitigation (text), status (single-select) |
| `Decisions` | title (text), decider (text), decision_date (date), rationale (text) |
| `Dashboards` | dashboard_key (text), widget_type (text), data_source (text), config_json (text) |

4. 编辑 `.env.local`，把 4 个值填上：
   ```
   VITE_FEISHU_APP_ID=cli_xxx
   VITE_FEISHU_APP_SECRET=xxx
   VITE_FEISHU_BITABLE_APP_TOKEN=bascnxxx
   VITE_FEISHU_TABLE_SECTIONS=tblxxx
   VITE_FEISHU_TABLE_CONTENT=tblxxx
   VITE_FEISHU_TABLE_EMBEDS=tblxxx
   VITE_FEISHU_TABLE_MEMBERS=tblxxx
   VITE_FEISHU_TABLE_MILESTONES=tblxxx
   VITE_FEISHU_TABLE_RISKS=tblxxx
   VITE_FEISHU_TABLE_DECISIONS=tblxxx
   VITE_FEISHU_TABLE_DASHBOARDS=tblxxx
   ```
5. 重启 `npm run dev`，自动切真飞书

---

## 📁 项目结构

```
src/
├── main.tsx                 # 入口
├── App.tsx                  # 路由
├── routes/                  # 公开站 11 个页面
│   ├── Home.tsx
│   ├── SectionPage.tsx      # 通用板块页（覆盖简单板块）
│   ├── DashboardEarthwork.tsx
│   ├── DashboardKeyEvents.tsx
│   ├── DashboardEquipment.tsx
│   ├── Team.tsx
│   ├── Milestones.tsx
│   ├── Tasks.tsx
│   ├── Documents.tsx
│   ├── Risks.tsx
│   ├── Decisions.tsx
│   ├── Map.tsx
│   └── admin/               # 后台 7 个 CRUD 页面
│       ├── Login.tsx
│       ├── Sections.tsx
│       ├── Content.tsx
│       ├── Embeds.tsx
│       ├── Members.tsx
│       ├── Milestones.tsx
│       ├── Risks.tsx
│       └── Decisions.tsx
├── components/
│   ├── layout/              # TopBar / Footer / PublicLayout / AdminLayout
│   ├── ui/                  # SectionCard / KpiCard / Panel / Button / Form / CrudTable
│   ├── charts/              # ChartContainer（Chart.js 统一壳）
│   ├── feishu/              # FeishuEmbed（iframe 包装）
│   └── map/                 # KmlViewer（Leaflet）
├── lib/
│   ├── api.ts               # 飞书/mock 抽象层
│   ├── mockData.ts          # mock 数据
│   ├── config.ts            # env 解析
│   ├── adminAuth.ts         # 后台密码
│   └── types.ts             # 业务类型
└── styles/
    ├── globals.css          # Tailwind + CAD 网格 + 玻璃
    └── theme.ts             # 8 色板 + Chart.js 主题
```

---

## 🔄 部署

### 本地 + ngrok（推荐内网用）

```bash
npm run dev   # 起服务在 5173
./start-ngrok.sh   # 自动 ngrok http 5173
```

### 生产构建

```bash
npm run build   # 产物在 dist/
npm run preview # 预览生产构建
```

部署到内网服务器：把 `dist/` 整个目录拷过去，配 nginx 静态托管。

---

## 🐛 故障排查

| 问题 | 解决 |
|---|---|
| 后台改了前台没显示 | 硬刷新（Cmd+Shift+R）；或清 localStorage 后重做 |
| ngrok 域名被公司网关拦 | 改用内网部署；或换 ngrok 付费固定域名 |
| 飞书切换后报错 401 | 检查 .env.local 的 App ID / Secret 是否正确 |
| 飞书切换后报错"field not found" | 字段名必须和飞书表里**完全一致**（区分大小写） |
| 飞书切换后报错"table not found" | 检查 8 个 VITE_FEISHU_TABLE_* 是否都填了 |
| 想重置 mock 数据 | 后台左下角"重置 mock 数据"按钮 |

---

## 📜 License

项目内部使用。
