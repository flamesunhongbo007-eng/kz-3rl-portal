import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { KpiCard } from '@/components/ui/KpiCard';
import { Panel } from '@/components/ui/Panel';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { chartColors, statusColor } from '@/styles/theme';
import { dataApi } from '@/lib/api';
import type { Risk } from '@/lib/types';

export function ProcurementPage() {
  const [risks] = useState<Risk[]>([]);

  useEffect(() => {
    dataApi.list<Risk>('RISKS');
  }, []);

  // 采购分类（铁路非电气化项目真实物料）
  const categories = [
    { name: '钢轨', unit: '万吨', planned: 3.8, ordered: 3.6, delivered: 2.8, vendor: '鞍钢集团', value: 0.86 },
    { name: '道砟', unit: '万方', planned: 86, ordered: 84, delivered: 62, vendor: '多供应商', value: 0.42 },
    { name: '混凝土', unit: '万方', planned: 78, ordered: 78, delivered: 56, vendor: '现场拌合', value: 0.58 },
    { name: '桥梁钢结构', unit: '万吨', planned: 2.4, ordered: 2.2, delivered: 1.4, vendor: '中铁大桥局', value: 0.96 },
    { name: '轨枕', unit: '万根', planned: 52, ordered: 48, delivered: 32, vendor: '本地', value: 0.34 },
    { name: '道岔', unit: '组', planned: 86, ordered: 72, delivered: 38, vendor: '中铁宝桥', value: 0.62 },
  ];

  // 设备缺口
  const equipmentGap = {
    labels: ['自卸车', '挖机', '推土机', '平地机', '压路机', '装载机', '洒水车', '发电机'],
    datasets: [
      { label: '配置需求', data: [60, 25, 8, 6, 12, 10, 8, 15], backgroundColor: chartColors[0] },
      { label: '已到场', data: [48, 22, 8, 6, 11, 9, 7, 13], backgroundColor: chartColors[2] },
      { label: '缺口', data: [12, 3, 0, 0, 1, 1, 1, 2], backgroundColor: chartColors[1] },
    ],
  };

  // 资金占比
  const valueData = categories.map(c => ({ name: c.name, value: c.value }));
  const totalValue = valueData.reduce((a, b) => a + b.value, 0);

  return (
    <PublicLayout>
      <header className="mb-10 pt-6">
        <div className="text-[10px] mono tracking-[0.3em] text-teal mb-2">DASHBOARD · 03 · PROCUREMENT</div>
        <h1 className="text-2xl md:text-3xl font-black text-ink leading-tight whitespace-nowrap">物资采购仪表盘</h1>
        <p className="mt-2 text-sm text-ink-dim">钢轨、道砟、混凝土、桥梁钢结构、电气化设备全周期采购跟踪</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="合同总额" value={totalValue.toFixed(1)} unit="亿元" delta="合同 12 个" trend="up" color="c1" />
        <KpiCard label="已订" value="98" unit="%" delta="钢轨/道砟/混凝土" trend="up" color="running" />
        <KpiCard label="已到场" value="68" unit="%" delta="较计划 +3%" trend="up" color="c3" />
        <KpiCard label="在途" value="1.2" unit="亿元" delta="预计本月到位" color="c4" />
      </section>

      {/* 采购分类表 */}
      <Panel title="六大采购分类" subtitle="计划 / 已订 / 已到场 · 含主供应商与合同额" variant="glow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] mono uppercase tracking-wider text-ink-dim border-b border-teal/20">
                <th className="px-3 py-2 text-left">类别</th>
                <th className="px-3 py-2 text-left">单位</th>
                <th className="px-3 py-2 text-right">计划</th>
                <th className="px-3 py-2 text-right">已订</th>
                <th className="px-3 py-2 text-right">已到场</th>
                <th className="px-3 py-2 text-right">到货率</th>
                <th className="px-3 py-2 text-left">主供应商</th>
                <th className="px-3 py-2 text-right">合同额(亿元)</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => {
                const pct = (c.delivered / c.planned) * 100;
                return (
                  <tr key={c.name} className="border-b border-border/30 hover:bg-teal/[0.04] transition-colors">
                    <td className="px-3 py-3 text-ink font-medium">{c.name}</td>
                    <td className="px-3 py-3 mono text-ink-dim text-xs">{c.unit}</td>
                    <td className="px-3 py-3 text-right mono">{c.planned.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right mono text-ink-mid">{c.ordered.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right mono text-ink font-bold">{c.delivered.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-bg rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-teal to-c3" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="mono text-teal text-xs">{pct.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-ink-muted text-xs">{c.vendor}</td>
                    <td className="px-3 py-3 text-right mono text-ink">{c.value.toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-teal/30 bg-teal/[0.04]">
                <td className="px-3 py-3 text-ink font-bold" colSpan={7}>合计</td>
                <td className="px-3 py-3 text-right mono text-teal font-bold text-base">{totalValue.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 设备缺口 + 资金分布 */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartContainer
          title="大型机械缺口"
          subtitle="按设备类型 · 配置 / 已到场 / 缺口"
          type="bar"
          data={equipmentGap}
          height={300}
        />
        <Panel title="采购资金分布" subtitle="按类别合同额占比">
          <div className="space-y-3">
            {valueData.map((v, i) => {
              const pct = (v.value / totalValue) * 100;
              const colors = ['#00D7A0', '#00BF8F', '#33e0b6', '#009B77', '#009980', '#007a64'];
              return (
                <div key={v.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: colors[i % colors.length] }} />
                  <div className="flex-1 text-sm text-ink">{v.name}</div>
                  <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                  </div>
                  <div className="w-32 text-right mono text-xs">
                    <span className="text-ink font-bold">{v.value.toFixed(2)}</span>
                    <span className="text-ink-dim ml-1">亿 · {pct.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* 到场日志 */}
      <div className="mt-8">
        <Panel title="最近到场批次" subtitle="按时倒序 · 后台可编辑">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] mono uppercase tracking-wider text-ink-dim border-b border-border">
                <th className="px-3 py-2 text-left">日期</th>
                <th className="px-3 py-2 text-left">类别</th>
                <th className="px-3 py-2 text-left">批次/车次</th>
                <th className="px-3 py-2 text-right">数量</th>
                <th className="px-3 py-2 text-left">来源</th>
                <th className="px-3 py-2 text-left">检验状态</th>
              </tr>
            </thead>
            <tbody>
              {[
                { d: '07-01', t: '钢轨', b: 'R-2026-0728', n: '1,200 吨', s: '鞍山', c: '已验收' },
                { d: '06-30', t: '桥梁钢结构', b: 'B-220', n: '32 片梁', s: '武汉', c: '已验收' },
                { d: '06-29', t: '道砟', b: 'A-15', n: '8,000 方', s: '本地', c: '已验收' },
                { d: '06-28', t: '电力设备', b: 'E-118', n: '4 套牵引变电所', s: '西门子', c: '已验收' },
                { d: '06-27', t: '混凝土', b: 'C-4512', n: '2,400 方', s: '现场', c: '已验收' },
                { d: '06-26', t: '信号系统', b: 'S-12', n: '6 套应答器', s: '卡斯柯', c: '待验收' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-teal/[0.04]">
                  <td className="px-3 py-2 mono text-[11px] text-ink-dim">{row.d}</td>
                  <td className="px-3 py-2 text-ink">{row.t}</td>
                  <td className="px-3 py-2 mono text-[11px] text-ink-mid">{row.b}</td>
                  <td className="px-3 py-2 text-right mono text-ink">{row.n}</td>
                  <td className="px-3 py-2 text-ink-muted text-xs">{row.s}</td>
                  <td className="px-3 py-2">
                    <span className="tag" style={{
                      color: statusColor(row.c === '待验收' ? '阻塞' : '已完成'),
                      background: statusColor(row.c === '待验收' ? '阻塞' : '已完成') + '22',
                    }}>{row.c}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </PublicLayout>
  );
}
