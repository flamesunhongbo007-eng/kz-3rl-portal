import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { Panel } from '@/components/ui/Panel';
import { chartColors } from '@/styles/theme';
import { FeishuEmbed } from '@/components/feishu/FeishuEmbed';
import { dataApi } from '@/lib/api';
import type { FeishuEmbed as Embed } from '@/lib/types';

// ===== 数据源 · 与飞书表格保持一致（截图: 2026/07/03） =====
type Row = {
  key: string;
  name: string;
  design: number;       // 设计总量（方）
  done: number;         // 开累完成（方）
  actualPct: number;    // 实际进度 %
  planPct: number;      // 时序进度 %
  planStart: string;    // 计划开始
  planEnd: string;      // 计划完成
  status: '正常' | '滞后';
};

const ROWS: Row[] = [
  { key: 'p1',   name: '一分部',   design:  9_505_568, done: 4_954_305, actualPct: 52, planPct: 47, planStart: '2026-03-19', planEnd: '2026-10-31', status: '正常' },
  { key: 'p23',  name: '二三分部', design: 10_955_411, done: 5_727_680, actualPct: 52, planPct: 44, planStart: '2026-04-01', planEnd: '2026-10-31', status: '正常' },
  { key: 'p4',   name: '四分部',   design: 19_190_095, done: 7_736_603, actualPct: 40, planPct: 44, planStart: '2026-04-01', planEnd: '2026-10-31', status: '滞后' },
];

// 千位分隔
const fmt = (n: number) => n.toLocaleString('en-US');
// 转成"万方"（保留 1 位小数）
const toWan = (n: number) => (n / 10_000).toFixed(1);

export function DashboardEarthwork() {
  const [embed, setEmbed] = useState<Embed | null>(null);

  useEffect(() => {
    dataApi.list<Embed>('EMBEDS').then((es) => {
      setEmbed(es.find((e) => e.section_key === 'earthwork') ?? null);
    });
  }, []);

  // 汇总
  const totalDesign = ROWS.reduce((s, r) => s + r.design, 0);
  const totalDone = ROWS.reduce((s, r) => s + r.done, 0);
  const totalLeft = totalDesign - totalDone;
  const totalActualPct = (totalDone / totalDesign) * 100;
  // 时序按设计量加权
  const totalPlanPct = ROWS.reduce((s, r) => s + (r.design * r.planPct), 0) / totalDesign;
  const delta = totalActualPct - totalPlanPct;

  // 图1：各分部完成/剩余（万方）
  const compareData = {
    labels: ROWS.map(r => r.name),
    datasets: [
      { label: '已完成', data: ROWS.map(r => Number(toWan(r.done))), backgroundColor: chartColors[0] },
      { label: '剩余',   data: ROWS.map(r => Number(toWan(r.design - r.done))), backgroundColor: chartColors[3] },
    ],
  };

  // 图2：实际 vs 时序（%）
  const paceData = {
    labels: ROWS.map(r => r.name),
    datasets: [
      { label: '实际进度 %', data: ROWS.map(r => r.actualPct), backgroundColor: chartColors[0] },
      { label: '时序进度 %', data: ROWS.map(r => r.planPct),   backgroundColor: chartColors[4] },
    ],
  };

  return (
    <PublicLayout>
      <header className="mb-10 relative">
        <div className="text-[10px] mono tracking-[0.3em] text-c1 mb-2">DASHBOARD / EARTHWORK</div>
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">土方仪表盘</h1>
        <p className="mt-2 text-sm text-ink-muted">
          三个分部土方完成情况 · 数据同步自飞书多维表格
          <span className="ml-3 text-teal/70 mono text-xs">合计 {toWan(totalDesign)} 万方 · 完成 {totalActualPct.toFixed(1)}% · 时序 {totalPlanPct.toFixed(1)}%</span>
        </p>
      </header>

      {/* 巨型数字 hero */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-3">
        <HeroNumber
          label="累计完成"
          value={toWan(totalDone)}
          unit="万方"
          color="c1"
          sub={`总设计量 ${toWan(totalDesign)} 万方`}
          pct={Math.round(totalActualPct)}
        />
        <HeroNumber
          label="剩余总量"
          value={toWan(totalLeft)}
          unit="万方"
          color="c4"
          sub={`占总量 ${(100 - totalActualPct).toFixed(1)}%`}
          pct={Math.round(100 - totalActualPct)}
        />
        <HeroNumber
          label="进度 vs 时序"
          value={(delta >= 0 ? '+' : '') + delta.toFixed(1)}
          unit="pct"
          color={delta >= 0 ? 'c2' : 'c5'}
          sub={`实际 ${totalActualPct.toFixed(1)}% · 计划 ${totalPlanPct.toFixed(1)}%`}
          trend={delta >= 0 ? 'up' : 'down'}
          delta={delta >= 0 ? '超前' : '滞后'}
        />
      </div>

      {/* 三分部详情表 · 数据源 */}
      <Panel title="三分部土方数据" subtitle="来源：飞书多维表格 · 单位：方（m³）" variant="glow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] mono uppercase tracking-wider text-ink-dim border-b border-teal/20">
                <th className="text-left py-2 px-3">分部</th>
                <th className="text-left py-2 px-3">状态</th>
                <th className="text-right py-2 px-3">实际</th>
                <th className="text-right py-2 px-3">时序</th>
                <th className="text-right py-2 px-3">设计总量</th>
                <th className="text-right py-2 px-3">开累完成</th>
                <th className="text-right py-2 px-3">剩余</th>
                <th className="text-left py-2 px-3">计划开始</th>
                <th className="text-left py-2 px-3">计划完成</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => {
                const isDelay = r.status === '滞后';
                const gap = r.actualPct - r.planPct;
                return (
                  <tr key={r.key} className="border-b border-border/30 hover:bg-teal/5 transition-colors">
                    <td className="py-3 px-3 font-bold text-ink">{r.name}</td>
                    <td className="py-3 px-3">
                      {isDelay ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(234,179,8,0.12)', color: '#facc15', border: '1px solid rgba(234,179,8,0.3)' }}>
                          ⚠ 进度滞后
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>
                          ✓ 进度正常
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right mono">
                      <span className="font-bold text-teal">{r.actualPct}%</span>
                    </td>
                    <td className="py-3 px-3 text-right mono text-ink-mid">
                      {r.planPct}%
                      <span className={`ml-1 text-[10px] ${gap >= 0 ? 'text-running' : 'text-warn'}`}>
                        ({gap >= 0 ? '+' : ''}{gap})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right mono text-ink-mid">{fmt(r.design)}</td>
                    <td className="py-3 px-3 text-right mono text-ink">{fmt(r.done)}</td>
                    <td className="py-3 px-3 text-right mono text-ink-dim">{fmt(r.design - r.done)}</td>
                    <td className="py-3 px-3 mono text-ink-dim">{r.planStart}</td>
                    <td className="py-3 px-3 mono text-ink-dim">{r.planEnd}</td>
                  </tr>
                );
              })}
              {/* 汇总行 */}
              <tr className="border-t-2 border-teal/40 bg-teal/5">
                <td className="py-3 px-3 font-black text-teal">合计</td>
                <td className="py-3 px-3"></td>
                <td className="py-3 px-3 text-right mono font-bold text-teal">{totalActualPct.toFixed(1)}%</td>
                <td className="py-3 px-3 text-right mono text-ink-mid">{totalPlanPct.toFixed(1)}%</td>
                <td className="py-3 px-3 text-right mono font-bold text-ink">{fmt(totalDesign)}</td>
                <td className="py-3 px-3 text-right mono font-bold text-ink">{fmt(totalDone)}</td>
                <td className="py-3 px-3 text-right mono font-bold text-ink">{fmt(totalLeft)}</td>
                <td className="py-3 px-3"></td>
                <td className="py-3 px-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 两张图并列 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8 mb-8">
        <ChartContainer title="各分部完成 / 剩余" subtitle="单位：万方" type="bar" data={compareData} />
        <ChartContainer title="实际进度 vs 时序进度" subtitle="百分比" type="bar" data={paceData} />
      </section>

      {embed && embed.url && (
        <Panel title="飞书数据源" subtitle="在后台可替换为真实表格 URL">
          <FeishuEmbed url={embed.url} title={embed.title} height={embed.height} />
        </Panel>
      )}
    </PublicLayout>
  );
}

// 记忆点：巨型数字 + 流光进度条
function HeroNumber({ label, value, unit, color, sub, trend, delta, pct }: { label: string; value: string; unit: string; color: string; sub?: string; trend?: 'up' | 'down'; delta?: string; pct?: number }) {
  const colorMap: Record<string, string> = { c1: 'text-c1', c2: 'text-c2', c3: 'text-c3', c4: 'text-c4', c5: 'text-c5', c6: 'text-c6' };
  const bgMap: Record<string, string> = { c1: 'from-c1/10', c2: 'from-c2/10', c3: 'from-c3/10', c4: 'from-c4/10', c5: 'from-c5/10', c6: 'from-c6/10' };
  return (
    <div className={`relative glass p-6 overflow-hidden group bg-gradient-to-br ${bgMap[color] ?? 'from-c1/10'} to-transparent`}>
      <div className="text-[10px] mono uppercase tracking-[0.2em] text-ink-dim mb-3">{label}</div>
      <div className="flex items-baseline gap-2 mb-2">
        <div className={`text-5xl md:text-6xl font-black mono tabular-nums ${colorMap[color] ?? 'text-c1'} drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]`}>{value}</div>
        <div className="text-sm text-ink-muted">{unit}</div>
        {trend && delta && (
          <div className={`text-xs mono ${trend === 'up' ? 'text-running' : 'text-danger'}`}>
            {trend === 'up' ? '↑' : '↓'} {delta}
          </div>
        )}
      </div>
      {sub && <div className="text-[11px] mono text-ink-dim mb-3">{sub}</div>}
      {pct !== undefined && (
        <div className="h-1 bg-bg rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${color === 'c1' ? 'from-c1 to-c2' : color === 'c2' ? 'from-c2 to-c3' : color === 'c4' ? 'from-c4 to-c2' : 'from-c1 to-c4'} rounded-full transition-all duration-1000`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      {/* 角落装饰 */}
      <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none">
        <div className="absolute top-3 right-3 w-1 h-12 bg-gradient-to-b from-current to-transparent opacity-30" style={{ color: (colorMap[color] ?? 'text-c1').replace('text-', '') }} />
        <div className="absolute top-3 right-3 w-12 h-1 bg-gradient-to-r from-current to-transparent opacity-30" style={{ color: (colorMap[color] ?? 'text-c1').replace('text-', '') }} />
      </div>
    </div>
  );
}
