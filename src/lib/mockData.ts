// mock 数据：开发期替代飞书 API
// 用户可在 /admin 后台修改这些数据并自动持久化到 localStorage
// 接入真飞书后这里的数据不再使用

import type {
  Section, ContentItem, FeishuEmbed, Member,
  Milestone, Risk, Decision, Dashboard,
} from './types';

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

export const mockSections: Section[] = [
  { record_id: 'sec-1', section_key: 'overview', title_zh: '项目概览', order: 1, visible: true, icon: '◎', bg_class: 'glass', description: '哈萨克斯坦第三条宽轨铁路项目总体进展' },
  { record_id: 'sec-2', section_key: 'team', title_zh: '团队成员', order: 2, visible: true, icon: '◉', description: '项目部成员与各分部负责人' },
  { record_id: 'sec-3', section_key: 'milestones', title_zh: '里程碑', order: 3, visible: true, icon: '◇', description: '关键节点与计划时间表' },
  { record_id: 'sec-4', section_key: 'tasks', title_zh: '任务与事项', order: 4, visible: true, icon: '▣', description: '本周计划、风险、阻塞' },
  { record_id: 'sec-5', section_key: 'documents', title_zh: '文档资料', order: 5, visible: true, icon: '▤', description: '合同、图纸、报告归档' },
  { record_id: 'sec-6', section_key: 'risks', title_zh: '风险登记', order: 6, visible: true, icon: '△', description: '风险矩阵与应对措施' },
  { record_id: 'sec-7', section_key: 'decisions', title_zh: '决策日志', order: 7, visible: true, icon: '◈', description: '重大决策记录与原因' },
  { record_id: 'sec-8', section_key: 'earthwork', title_zh: '土方仪表盘', order: 8, visible: true, icon: '▥', description: '全线土方日完成量与累计' },
  { record_id: 'sec-9', section_key: 'key_events', title_zh: '重要事项', order: 9, visible: true, icon: '✦', description: '剩余时间提醒与紧急程度' },
  { record_id: 'sec-10', section_key: 'equipment', title_zh: '设备资源', order: 10, visible: true, icon: '⬡', description: '各分部设备配置与缺口' },
  { record_id: 'sec-11', section_key: 'map', title_zh: '线路图', order: 11, visible: true, icon: '◐', description: '线路走向 KML 地图' },
];

export const mockMembers: Member[] = [
  { record_id: 'mem-1', name: '项目经理', role: '项目总经理', org: '中港哈铁', email: 'pm@chec.kz' },
  { record_id: 'mem-2', name: '总工程师', role: '总工程师', org: '中港哈铁' },
  { record_id: 'mem-3', name: '一分部经理', role: '一分部经理', org: '一分部' },
  { record_id: 'mem-4', name: '二三分部经理', role: '二三分部经理', org: '二三分部' },
  { record_id: 'mem-5', name: '四分部经理', role: '四分部经理', org: '四分部' },
  { record_id: 'mem-6', name: '商务部长', role: '商务部长', org: '中港哈铁' },
  { record_id: 'mem-7', name: '财务部长', role: '财务部长', org: '中港哈铁' },
  { record_id: 'mem-8', name: '安全总监', role: '安全总监', org: '中港哈铁' },
];

export const mockMilestones: Milestone[] = [
  { record_id: 'ms-1', title: '项目开工', planned_date: now - 180 * day, actual_date: now - 175 * day, phase: '启动', status: '已完成' },
  { record_id: 'ms-2', title: '一分部临建完成', planned_date: now - 90 * day, actual_date: now - 88 * day, phase: '准备', status: '已完成' },
  { record_id: 'ms-3', title: '二三分部临建完成', planned_date: now - 60 * day, actual_date: now - 55 * day, phase: '准备', status: '已完成' },
  { record_id: 'ms-4', title: '路基试验段验收', planned_date: now - 30 * day, actual_date: now - 25 * day, phase: '施工', status: '已完成' },
  { record_id: 'ms-5', title: '首片预制梁架设', planned_date: now + 15 * day, phase: '施工', status: '进行中' },
  { record_id: 'ms-6', title: '全线桥梁下部结构完工', planned_date: now + 120 * day, phase: '施工', status: '计划中' },
  { record_id: 'ms-7', title: '铺轨工程开工', planned_date: now + 200 * day, phase: '施工', status: '计划中' },
  { record_id: 'ms-8', title: '全线轨通', planned_date: now + 400 * day, phase: '收尾', status: '计划中' },
  { record_id: 'ms-9', title: '项目竣工', planned_date: now + 600 * day, phase: '收尾', status: '计划中' },
];

export const mockContentItems: ContentItem[] = [
  { record_id: 'ci-1', section_key: 'tasks', title: '完成 k120-k125 路基填方', body_md: '本段路基填方约 8000 方', date: now - 5 * day, status: '已完成', tags: ['路基', '二三分部'] },
  { record_id: 'ci-2', section_key: 'tasks', title: '3#桥桩基浇筑', body_md: '设计桩长 18m，共 12 根', date: now - 2 * day, status: '已完成', tags: ['桥梁', '桩基'] },
  { record_id: 'ci-3', section_key: 'tasks', title: '5#涵洞钢筋绑扎', date: now, status: '进行中', tags: ['涵洞'] },
  { record_id: 'ci-4', section_key: 'tasks', title: '采石场软基处理', body_md: '等待设计变更', date: now + 1 * day, status: '阻塞', tags: ['软基', '风险'] },
  { record_id: 'ci-5', section_key: 'tasks', title: 'k230-k233 路基试验段', date: now + 3 * day, status: '计划中', tags: ['路基'] },
  { record_id: 'ci-6', section_key: 'tasks', title: '预制梁场设备进场', date: now + 5 * day, status: '计划中', tags: ['设备', '梁场'] },
  { record_id: 'ci-7', section_key: 'documents', title: '中港哈铁总经理部发〔2026〕35号', body_md: '正式发文', date: now - 20 * day, status: '归档', tags: ['合同', '发文'] },
  { record_id: 'ci-8', section_key: 'documents', title: '哈萨克斯坦宽轨铁路项目土建三标段报价', date: now - 90 * day, status: '归档', tags: ['报价'] },
  { record_id: 'ci-9', section_key: 'documents', title: '233km采石场地质参数分析与软基判断结果', date: now - 60 * day, status: '归档', tags: ['地质'] },
  { record_id: 'ci-10', section_key: 'documents', title: '20260403各分部剩余设备进场计划', date: now - 50 * day, status: '归档', tags: ['设备'] },
];

export const mockEmbeds: FeishuEmbed[] = [
  { record_id: 'em-1', embed_key: 'overview_kpi', url: '', title: '项目 KPI 总览', section_key: 'overview', height: 400 },
  { record_id: 'em-2', embed_key: 'earthwork_daily', url: '', title: '土方日完成量统计', section_key: 'earthwork', height: 600 },
  { record_id: 'em-3', embed_key: 'tasks_weekly', url: '', title: '本周任务看板', section_key: 'tasks', height: 500 },
];

export const mockRisks: Risk[] = [
  { record_id: 'rk-1', title: '采石场软基处理方案未定', severity: '高', probability: '高', owner: '总工程师', mitigation: '催促设计院出具变更', status: '开放' },
  { record_id: 'rk-2', title: '二三分部土方机械到场不足', severity: '中', probability: '高', owner: '二三分部经理', mitigation: '调配一分部备用机械', status: '处理中' },
  { record_id: 'rk-3', title: '属地化用工签证延迟', severity: '中', probability: '中', mitigation: '与当地代理公司协调', status: '处理中' },
  { record_id: 'rk-4', title: '极端天气影响冬季施工', severity: '低', probability: '中', mitigation: '做好冬季施工方案', status: '监控' },
  { record_id: 'rk-5', title: '汇率波动影响成本', severity: '中', probability: '中', mitigation: '锁定部分远期汇率', status: '监控' },
];

export const mockDecisions: Decision[] = [
  { record_id: 'dc-1', title: '采用国产挖掘机替代进口', decision_date: now - 90 * day, decider: '项目经理', rationale: '降低成本约 30%，售后服务及时' },
  { record_id: 'dc-2', title: '将二三分部临建合并建设', decision_date: now - 120 * day, decider: '总工程师', rationale: '节约用地 2000㎡，减少管理人员' },
  { record_id: 'dc-3', title: '软基路段采用换填方案', decision_date: now - 30 * day, decider: '总工程师', rationale: '比搅拌桩方案缩短工期 40 天' },
  { record_id: 'dc-4', title: '新增 k230 涵洞位置', decision_date: now - 10 * day, decider: '项目经理', rationale: '满足属地排洪要求' },
];

export const mockDashboards: Dashboard[] = [
  { record_id: 'db-1', dashboard_key: 'earthwork', widget_type: 'line', data_source: 'mock', config_json: '{"title":"累计土方量","unit":"万方"}' },
  { record_id: 'db-2', dashboard_key: 'earthwork', widget_type: 'bar', data_source: 'mock', config_json: '{"title":"各分部对比","unit":"万方"}' },
  { record_id: 'db-3', dashboard_key: 'equipment', widget_type: 'bar', data_source: 'mock', config_json: '{"title":"设备缺口","unit":"台"}' },
  { record_id: 'db-4', dashboard_key: 'key_events', widget_type: 'table', data_source: 'mock', config_json: '{"title":"剩余时间提醒"}' },
];

// 模拟飞书数据结构
export const mockStore = {
  SECTIONS: mockSections,
  CONTENT: mockContentItems,
  EMBEDS: mockEmbeds,
  MEMBERS: mockMembers,
  MILESTONES: mockMilestones,
  RISKS: mockRisks,
  DECISIONS: mockDecisions,
  DASHBOARDS: mockDashboards,
};
