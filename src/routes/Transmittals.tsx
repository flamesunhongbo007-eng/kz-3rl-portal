import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { KpiCard } from '@/components/ui/KpiCard';
import { Panel } from '@/components/ui/Panel';
import { dataApi } from '@/lib/api';
import type { ContentItem } from '@/lib/types';
import { statusColor } from '@/styles/theme';

export function TransmittalsPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  useEffect(() => {
    dataApi.list<ContentItem>('CONTENT', (a, b) => (b.date ?? 0) - (a.date ?? 0)).then(r =>
      setItems(r.filter(x => x.section_key === 'key_events' || x.tags?.includes('协调')).slice(0, 12))
    );
  }, []);

  // 收发函件
  const transmittals = [
    { num: 'TR-2026-0382', date: '07-01', type: '业主函件', subject: '关于 k230 涵洞位置变更的批复', status: '已批复', from: '哈铁', to: '项目部', priority: '高' },
    { num: 'TR-2026-0381', date: '07-01', type: '技术核定', subject: '15#桥主墩基坑围护方案核定', status: '已核定', from: '设计院', to: '项目部', priority: '高' },
    { num: 'TR-2026-0380', date: '06-30', type: '工程签证', subject: 'k120-k125 软基处理工程量签证', status: '待审', from: '监理', to: '项目部', priority: '中' },
    { num: 'TR-2026-0379', date: '06-30', type: '设计变更', subject: '23#桥桥面系伸缩缝型号变更', status: '执行中', from: '设计院', to: '项目部', priority: '中' },
    { num: 'TR-2026-0378', date: '06-29', type: '监理通知', subject: '3#桥架设安全交底通知', status: '已回复', from: '监理', to: '项目部', priority: '中' },
    { num: 'TR-2026-0377', date: '06-28', type: '分包函件', subject: '二三分部土方机械到场情况报告', status: '已收', from: '二三分部', to: '项目部', priority: '低' },
    { num: 'TR-2026-0376', date: '06-28', type: '设备厂家', subject: 'HRSG 设备制造进度更新', status: '已确认', from: '西门子', to: '项目部', priority: '低' },
    { num: 'TR-2026-0375', date: '06-27', type: '业主函件', subject: '关于 7 月份进度计划报审', status: '已批复', from: '哈铁', to: '项目部', priority: '高' },
  ];

  // 会议纪要
  const meetings = [
    { date: '07-01', title: '周进度协调会（第 27 周）', chair: '项目经理', att: '业主代表 + 各分部经理', topics: '本周进度 / 下周计划 / 设备到场' },
    { date: '06-29', title: '技术专题：采石场软基处理方案', chair: '总工程师', att: '设计院 + 监理 + 第三方', topics: '换填 vs 搅拌桩方案对比' },
    { date: '06-25', title: '安全月检暨百日安全活动启动', chair: '安全总监', att: '全员', topics: '现场安全 + 风险辨识 + 应急演练' },
  ];

  return (
    <PublicLayout>
      <header className="mb-10 pt-6">
        <div className="text-[10px] mono tracking-[0.3em] text-teal mb-2">DASHBOARD · 04 · COORDINATION</div>
        <h1 className="text-2xl md:text-3xl font-black text-ink leading-tight whitespace-nowrap">总包协调中心</h1>
        <p className="mt-2 text-sm text-ink-dim">与业主、分包、监理、设备厂家的全部工作联系单与协调事项</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="本月收发" value="58" unit="件" delta="+12% MoM" trend="up" color="c1" />
        <KpiCard label="待批复" value="14" unit="件" delta="3 件超时" trend="down" color="c2" />
        <KpiCard label="高优先级" value="8" unit="件" delta="需关注" color="c4" />
        <KpiCard label="平均回复" value="1.8" unit="天" delta="目标 2 天" trend="up" color="running" />
      </section>

      {/* 收发函件流 */}
      <Panel title="近期收发函件" subtitle="按时倒序 · 后台可编辑" variant="glow">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] mono uppercase tracking-wider text-ink-dim border-b border-teal/20">
              <th className="px-3 py-2 text-left">编号</th>
              <th className="px-3 py-2 text-left">日期</th>
              <th className="px-3 py-2 text-left">类型</th>
              <th className="px-3 py-2 text-left">主题</th>
              <th className="px-3 py-2 text-left">来方</th>
              <th className="px-3 py-2 text-left">去方</th>
              <th className="px-3 py-2 text-left">状态</th>
              <th className="px-3 py-2 text-left">优先级</th>
            </tr>
          </thead>
          <tbody>
            {transmittals.map(t => (
              <tr key={t.num} className="border-b border-border/30 hover:bg-teal/[0.04] transition-colors">
                <td className="px-3 py-2 mono text-[11px] text-c1">{t.num}</td>
                <td className="px-3 py-2 mono text-[11px] text-ink-dim">{t.date}</td>
                <td className="px-3 py-2 text-ink-muted">{t.type}</td>
                <td className="px-3 py-2 text-ink">{t.subject}</td>
                <td className="px-3 py-2 text-ink-muted text-xs">{t.from}</td>
                <td className="px-3 py-2 text-ink-muted text-xs">{t.to}</td>
                <td className="px-3 py-2">
                  <span className="tag" style={{
                    color: statusColor(t.status === '待审' ? '阻塞' : t.status === '执行中' ? '进行中' : '已完成'),
                    background: statusColor(t.status === '待审' ? '阻塞' : t.status === '执行中' ? '进行中' : '已完成') + '22',
                  }}>{t.status}</span>
                </td>
                <td className="px-3 py-2">
                  <span className="tag" style={{
                    color: t.priority === '高' ? '#ef4444' : t.priority === '中' ? '#eab308' : '#6A8CAA',
                    background: (t.priority === '高' ? '#ef4444' : t.priority === '中' ? '#eab308' : '#6A8CAA') + '22',
                  }}>{t.priority}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* 会议纪要 + 重要事项 */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="近期会议纪要" subtitle="按日期倒序">
          {meetings.map((m, i) => (
            <div key={i} className="border-b border-border/30 last:border-0 py-3">
              <div className="flex items-start gap-3">
                <div className="w-12 shrink-0 mono text-[11px] text-teal">{m.date}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-ink font-medium">{m.title}</div>
                  <div className="text-[11px] text-ink-dim mt-1">主持: {m.chair} · 与会: {m.att}</div>
                  <div className="text-[10px] mono text-ink-muted mt-1">议题: {m.topics}</div>
                </div>
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="重要事项跟踪" subtitle="需项目部协调处理" variant="glow">
          {items.length === 0 ? (
            <div className="text-center text-ink-dim text-xs py-8">暂无事项</div>
          ) : (
            <ul className="space-y-2">
              {items.slice(0, 5).map(it => (
                <li key={it.record_id} className="p-3 border border-border/30 rounded-md hover:border-teal/40 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="tag" style={{ color: statusColor(it.status ?? ''), background: statusColor(it.status ?? '') + '22' }}>{it.status}</span>
                    <div className="text-sm text-ink flex-1">{it.title}</div>
                  </div>
                  {it.body_md && <div className="text-[11px] text-ink-dim line-clamp-2">{it.body_md}</div>}
                  <div className="text-[10px] mono text-ink-dim mt-1.5">
                    {it.date ? new Date(it.date).toLocaleDateString('zh-CN') : '—'}
                    {(it.tags ?? []).slice(0, 2).map(t => <span key={t}> · {t}</span>)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </PublicLayout>
  );
}
