import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { KpiCard } from '@/components/ui/KpiCard';
import { Panel } from '@/components/ui/Panel';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { chartColors, statusColor } from '@/styles/theme';
import { dataApi } from '@/lib/api';
import type { Milestone } from '@/lib/types';

export function MilestoneDashboardPage() {
  const [ms, setMs] = useState<Milestone[]>([]);

  useEffect(() => {
    dataApi.list<Milestone>('MILESTONES', (a, b) => a.planned_date - b.planned_date).then(setMs);
  }, []);

  // 32 项 EPC 里程碑（部分示例）
  const milestones = ms.length > 0 ? ms : [
    { record_id: 'ms-1', title: '项目开工', planned_date: Date.now() - 180*86400000, actual_date: Date.now() - 175*86400000, phase: '启动', status: '已完成' },
    { record_id: 'ms-2', title: '一分部临建完成', planned_date: Date.now() - 90*86400000, actual_date: Date.now() - 88*86400000, phase: '准备', status: '已完成' },
    { record_id: 'ms-3', title: '二三分部临建完成', planned_date: Date.now() - 60*86400000, actual_date: Date.now() - 55*86400000, phase: '准备', status: '已完成' },
    { record_id: 'ms-4', title: '路基试验段验收', planned_date: Date.now() - 30*86400000, actual_date: Date.now() - 25*86400000, phase: '施工', status: '已完成' },
    { record_id: 'ms-5', title: '首片预制梁架设', planned_date: Date.now() + 15*86400000, phase: '施工', status: '进行中' },
    { record_id: 'ms-6', title: '全线桥梁下部结构完工', planned_date: Date.now() + 120*86400000, phase: '施工', status: '计划中' },
    { record_id: 'ms-7', title: '铺轨工程开工', planned_date: Date.now() + 200*86400000, phase: '施工', status: '计划中' },
    { record_id: 'ms-8', title: '全线轨通', planned_date: Date.now() + 400*86400000, phase: '收尾', status: '计划中' },
    { record_id: 'ms-9', title: '项目竣工', planned_date: Date.now() + 600*86400000, phase: '收尾', status: '计划中' },
  ] as Milestone[];

  // 现金流（按月）
  const cashflow = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    datasets: [
      { label: '计划支付', data: [120, 180, 240, 380, 520, 680, 720, 580, 460, 380, 280, 200], borderColor: chartColors[0], backgroundColor: chartColors[0] + '22', tension: 0.35, fill: true },
      { label: '实际支付', data: [115, 175, 232, 358, 480, 645, 0, 0, 0, 0, 0, 0], borderColor: chartColors[2], backgroundColor: chartColors[2] + '22', tension: 0.35, fill: true },
    ],
  };

  // 阶段汇总（按 4 标段切分）
  const byPhase = [
    { name: 'AK0-AK80 标段', count: 8, done: 8, amount: 1.8 },
    { name: 'AK80-AK170 标段', count: 8, done: 5, amount: 2.6 },
    { name: 'AK170-AK241 标段', count: 8, done: 3, amount: 2.4 },
    { name: 'AK241-AK302 标段', count: 8, done: 1, amount: 2.0 },
  ];

  // 币种付款进度（哈萨克铁路项目常见币种）
  const currencies = [
    { name: '美元 USD', planned: 0.8, paid: 0.4, rate: 50 },
    { name: '人民币 CNY', planned: 4.6, paid: 2.4, rate: 52 },
    { name: '哈萨克坚戈 KZT', planned: 3.2, paid: 1.5, rate: 47 },
    { name: '卢布 RUB', planned: 0.2, paid: 0.1, rate: 50 },
  ];

  return (
    <PublicLayout>
      <header className="mb-10 pt-6">
        <div className="text-[10px] mono tracking-[0.3em] text-teal mb-2">DASHBOARD · 05 · CONTRACT MILESTONES</div>
        <h1 className="text-2xl md:text-3xl font-black text-ink leading-tight whitespace-nowrap">合同里程碑仪表盘</h1>
        <p className="mt-2 text-sm text-ink-dim">32 项 EPC 合同节点 · 付款计划与现金流 · 今日位置指示</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="合同节点" value="32" unit="项" delta="已完成 17" trend="up" color="c1" />
        <KpiCard label="已付款" value="4.4" unit="亿元" delta="合同 8.8 亿" color="running" />
        <KpiCard label="进行中" value="3" unit="项" delta="本周到期 1" color="c3" />
        <KpiCard label="逾期" value="0" unit="项" delta="全部按计划" trend="up" color="running" />
      </section>

      {/* 今日位置时间线 */}
      <Panel title="32 项里程碑时间线" subtitle="按阶段分组 · 今日位置用绿松石标出" variant="glow">
        <div className="relative pl-6 py-2">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-teal via-c3 to-teal/30" />
          <ul className="space-y-3">
            {milestones.map((m, i) => {
              const isCurrent = m.status === '进行中';
              return (
                <li key={m.record_id} className="relative">
                  <div
                    className={`absolute -left-[18px] top-2 w-4 h-4 rounded-full border-2 border-bg ${isCurrent ? 'animate-pulse' : ''}`}
                    style={{
                      background: statusColor(m.status),
                      boxShadow: isCurrent ? `0 0 16px ${statusColor(m.status)}` : 'none',
                    }}
                  />
                  <div className={`glass-soft p-3 ${isCurrent ? 'border-teal/50 shadow-[0_0_20px_rgba(0,215,160,0.2)]' : ''} hover:border-teal/30 transition-all`}>
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
                        {isCurrent && <span className="text-[10px] mono text-teal animate-pulse">● 进行中</span>}
                        <span>{m.title}</span>
                      </h4>
                      <span className="tag" style={{ color: statusColor(m.status), background: statusColor(m.status) + '22' }}>{m.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-[10px] mono text-ink-dim">
                      <span>阶段: <span className="text-teal">{m.phase}</span></span>
                      <span>计划: {new Date(m.planned_date).toLocaleDateString('zh-CN')}</span>
                      {m.actual_date && <span className="text-running">实际: {new Date(m.actual_date).toLocaleDateString('zh-CN')}</span>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Panel>

      {/* 阶段汇总 + 现金流 */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="按阶段汇总" subtitle="32 项里程碑分组">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] mono uppercase tracking-wider text-ink-dim border-b border-border">
                <th className="px-3 py-2 text-left">阶段</th>
                <th className="px-3 py-2 text-right">总数</th>
                <th className="px-3 py-2 text-right">已完成</th>
                <th className="px-3 py-2 text-right">占比</th>
                <th className="px-3 py-2 text-right">合同额（亿元）</th>
              </tr>
            </thead>
            <tbody>
              {byPhase.map(p => (
                <tr key={p.name} className="border-b border-border/30">
                  <td className="px-3 py-2 text-ink">{p.name}</td>
                  <td className="px-3 py-2 text-right mono">{p.count}</td>
                  <td className="px-3 py-2 text-right mono text-ink font-bold">{p.done}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-12 h-1.5 bg-bg rounded-full overflow-hidden">
                        <div className="h-full bg-teal" style={{ width: `${(p.done / p.count) * 100}%` }} />
                      </div>
                      <span className="mono text-xs text-teal">{Math.round((p.done / p.count) * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right mono text-ink">{p.amount.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <ChartContainer
          title="现金流对比"
          subtitle="2026 年 · 计划支付 vs 实际支付（亿元）"
          type="line"
          data={cashflow}
          height={300}
        />
      </div>

      {/* 多币种付款 */}
      <div className="mt-8">
        <Panel title="多币种付款进度" subtitle="按币种 · 已付 / 计划">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currencies.map(c => (
              <div key={c.name} className="glass-soft p-4">
                <div className="text-[10px] mono text-teal tracking-wider mb-2">{c.name}</div>
                <div className="text-2xl font-bold mono text-ink mb-1">{c.paid}<span className="text-sm text-ink-dim"> / {c.planned}</span></div>
                <div className="h-1.5 bg-bg rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-teal to-c3" style={{ width: `${c.rate}%` }} />
                </div>
                <div className="text-[10px] mono text-ink-dim">已付: {c.rate}%</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PublicLayout>
  );
}
