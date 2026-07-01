import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { KpiCard } from '@/components/ui/KpiCard';
import { Panel } from '@/components/ui/Panel';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { chartColors, statusColor } from '@/styles/theme';
import { dataApi } from '@/lib/api';
import type { ContentItem, Risk } from '@/lib/types';

export function ConstructionStatusPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);

  useEffect(() => {
    Promise.all([
      dataApi.list<ContentItem>('CONTENT', (a, b) => (b.date ?? 0) - (a.date ?? 0)),
      dataApi.list<Risk>('RISKS'),
    ]).then(([c, r]) => {
      setItems(c.filter(x => x.section_key === 'tasks').slice(0, 12));
      setRisks(r.filter(r => r.status === '开放' || r.status === '处理中').slice(0, 5));
    });
  }, []);

  // 4 大土建标段进度（项目真实分段）
  const sections = [
    { name: 'AK0-AK80 标段', km: 'k0-k80', progress: 92, days: 14, status: '领先' },
    { name: 'AK80-AK170 标段', km: 'k80-k170', progress: 78, days: -3, status: '滞后' },
    { name: 'AK170-AK241 标段', km: 'k170-k241', progress: 85, days: 0, status: '正常' },
    { name: 'AK241-AK302+436 标段', km: 'k241-k302.4', progress: 64, days: 7, status: '提前' },
  ];

  // 工种完成度
  const workTypes = [
    { name: '路基工程', done: 218, target: 260, unit: '万方' },
    { name: '桥涵工程', done: 198, target: 280, unit: '处' },
    { name: '站场工程', done: 9, target: 14, unit: '座' },
    { name: '轨道工程', done: 88, target: 302, unit: 'km' },
    { name: '机务/整备', done: 1, target: 2, unit: '处' },
  ];

  // 月进度趋势
  const monthTrend = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    datasets: [
      { label: '土方量(万方)', data: [12, 38, 78, 142, 220, 312, 410, 510, 598, 680, 752, 815], borderColor: chartColors[0], backgroundColor: chartColors[0] + '22', tension: 0.35, fill: true },
      { label: '铺轨(km)', data: [0, 0, 0, 28, 95, 178, 264, 358, 462, 568, 680, 920], borderColor: chartColors[2], backgroundColor: chartColors[2] + '22', tension: 0.35, fill: true },
    ],
  };

  // 桥梁结构完成度（按项目区间）
  const bridges = [
    { id: 'AK12 跨河桥', type: '大桥', length: '420 m', progress: 95, status: '架设中' },
    { id: 'AK58 跨铁路桥', type: '中桥', length: '180 m', progress: 78, status: '下部结构' },
    { id: 'AK105 立交桥', type: '中桥', length: '240 m', progress: 100, status: '完工' },
    { id: 'AK186 跨河桥', type: '特大桥', length: '680 m', progress: 62, status: '主墩施工' },
    { id: 'AK270 跨公路桥', type: '大桥', length: '320 m', progress: 88, status: '桥面系' },
  ];

  const recentReports = items.filter(i => i.body_md).slice(0, 6);

  return (
    <PublicLayout>
      <header className="mb-10 pt-6">
        <div className="text-[10px] mono tracking-[0.3em] text-teal mb-2">DASHBOARD · 01 · CONSTRUCTION STATUS</div>
        <h1 className="text-2xl md:text-3xl font-black text-ink leading-tight whitespace-nowrap">建设进度仪表盘</h1>
        <p className="mt-2 text-sm text-ink-dim">全线施工现场实时概览 · 跟踪里程碑达成、分包履约、专业完成度</p>
      </header>

      {/* 总 KPI */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="总进度" value="78.4" unit="%" delta="比计划快 1.2%" trend="up" color="running" />
        <KpiCard label="累计完成" value="237" unit="km" delta="正线 302.4 km" trend="up" color="c1" />
        <KpiCard label="月完成" value="18" unit="km" delta="环比 +12%" trend="up" color="c3" />
        <KpiCard label="现场人数" value="1,847" unit="人" delta="高峰 2,200" trend="flat" color="c4" />
      </section>

      {/* 4 大工区进度 */}
      <Panel title="四大工区进度" subtitle="按里程标段划分 · 与计划工期对比" variant="glow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((s) => (
            <div key={s.name} className="glass-soft p-4 hover:border-teal/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] mono text-teal tracking-wider">{s.km}</div>
                  <div className="text-sm font-bold text-ink">{s.name}</div>
                </div>
                <span className="tag" style={{ color: statusColor(s.status), background: statusColor(s.status) + '22' }}>
                  {s.status}
                </span>
              </div>
              <div className="text-2xl font-bold mono text-ink mb-1">{s.progress}<span className="text-sm text-ink-dim">%</span></div>
              <div className="h-1.5 bg-bg rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-teal to-c3" style={{ width: `${s.progress}%` }} />
              </div>
              <div className="text-[10px] mono text-ink-dim">与计划: <span style={{ color: s.days >= 0 ? '#22c55e' : '#ef4444' }}>{s.days >= 0 ? `+${s.days}` : s.days} 天</span></div>
            </div>
          ))}
        </div>
      </Panel>

      {/* 5 段式工程进度条（铁路纵断面）*/}
      <div className="mt-8">
        <Panel title="全线纵断面进度" subtitle="1,520 km 主线 · 五大基础设施工程" variant="glow">
          <div className="space-y-3">
            {workTypes.map((w) => {
              const pct = (w.done / w.target) * 100;
              return (
                <div key={w.name} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-2 text-sm text-ink">{w.name}</div>
                  <div className="col-span-7 h-6 bg-bg rounded-md overflow-hidden relative border border-teal/15">
                    <div
                      className="h-full rounded-md transition-all relative"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, rgba(0,215,160,0.4), rgba(0,215,160,0.85))`,
                      }}
                    >
                      {/* 光柱头 */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-teal rounded-full shadow-[0_0_8px_rgba(0,215,160,0.8)]" />
                    </div>
                  </div>
                  <div className="col-span-3 text-right mono text-sm">
                    <span className="text-ink font-bold">{w.done.toLocaleString()}</span>
                    <span className="text-ink-dim"> / {w.target.toLocaleString()} {w.unit}</span>
                    <span className="text-teal ml-2 text-xs">({pct.toFixed(0)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* 月进度趋势 + 关键桥梁 */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartContainer
          title="月进度趋势"
          subtitle="2026 年 · 土方量 + 铺轨公里数"
          type="line"
          data={monthTrend}
          height={280}
        />

        <Panel title="关键桥梁结构" subtitle="5 座重点桥施工进度">
          <div className="space-y-2">
            {bridges.map((b) => (
              <div key={b.id} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-border/30 last:border-0">
                <div className="col-span-2">
                  <div className="text-[10px] mono text-teal">{b.id}</div>
                  <div className="text-[10px] mono text-ink-dim">{b.type}</div>
                </div>
                <div className="col-span-2 mono text-[11px] text-ink-muted">{b.length}</div>
                <div className="col-span-6 h-2 bg-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${b.progress}%`,
                      background: b.progress === 100 ? '#22c55e' : 'linear-gradient(90deg, #00D7A0, #00BF8F)',
                    }}
                  />
                </div>
                <div className="col-span-2 text-right text-[10px] mono">
                  <span className="text-ink font-bold">{b.progress}%</span>
                  <div className="text-ink-dim">{b.status}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* 现场日报 + 风险 + 资源 */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="现场日报" subtitle="最近 6 条 · 按时倒序">
          {recentReports.length === 0 ? (
            <div className="text-center text-ink-dim text-xs py-8">暂无日报</div>
          ) : (
            <ul className="divide-y divide-border/30">
              {recentReports.map((r) => (
                <li key={r.record_id} className="py-3 flex items-start gap-3">
                  <div className="w-1 h-10 rounded-full shrink-0" style={{ background: statusColor(r.status ?? '') + '60' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink">{r.title}</div>
                    {r.body_md && <div className="text-[11px] text-ink-dim mt-0.5 line-clamp-2">{r.body_md}</div>}
                    <div className="flex items-center gap-2 mt-1 text-[10px] mono text-ink-dim">
                      {r.date && <span>{new Date(r.date).toLocaleDateString('zh-CN')}</span>}
                      {(r.tags ?? []).slice(0, 2).map(t => <span key={t}>· {t}</span>)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="实时风险" subtitle="需要关注的风险项" variant="glow">
          {risks.length === 0 ? (
            <div className="text-center text-ink-dim text-xs py-8">暂无活跃风险</div>
          ) : (
            <ul className="space-y-2">
              {risks.map(r => (
                <li key={r.record_id} className="p-3 border border-border/30 rounded-md hover:border-teal/40 transition-all">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="tag" style={{ color: statusColor(r.severity), background: statusColor(r.severity) + '22' }}>{r.severity}</span>
                    <div className="text-sm text-ink font-medium flex-1">{r.title}</div>
                  </div>
                  {r.mitigation && <div className="text-[11px] text-ink-dim">应对: {r.mitigation}</div>}
                  {r.owner && <div className="text-[10px] mono text-ink-dim mt-1">负责人: {r.owner}</div>}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* 施工窗口 + 资源 */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="有效施工日" value="186" unit="天/年" delta="目标 220" color="c1" />
        <KpiCard label="大型机械" value="184" unit="台" delta="到场率 92%" color="c3" />
        <KpiCard label="拌合站" value="8" unit="座" delta="满负荷运行" color="c4" />
        <KpiCard label="钢材库存" value="62,400" unit="吨" delta="可用 35 天" color="running" />
      </div>
    </PublicLayout>
  );
}
