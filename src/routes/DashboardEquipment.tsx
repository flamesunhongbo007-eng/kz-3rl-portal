import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { KpiCard } from '@/components/ui/KpiCard';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { Panel } from '@/components/ui/Panel';
import { chartColors, statusColor } from '@/styles/theme';
import { dataApi } from '@/lib/api';
import type { FeishuEmbed as Embed } from '@/lib/types';

export function DashboardEquipment() {
  const [embed, setEmbed] = useState<Embed | null>(null);
  useEffect(() => { dataApi.list<Embed>('EMBEDS').then((es) => setEmbed(es.find((e) => e.section_key === 'equipment') ?? null)); }, []);

  const data = {
    labels: ['挖机', '自卸车', '推土机', '平地机', '压路机', '装载机', '洒水车', '发电机'],
    datasets: [
      { label: '配置需求', data: [25, 60, 8, 6, 12, 10, 8, 15], backgroundColor: chartColors[0] },
      { label: '已到场', data: [22, 48, 8, 6, 11, 9, 7, 13], backgroundColor: chartColors[2] },
      { label: '缺口', data: [3, 12, 0, 0, 1, 1, 1, 2], backgroundColor: chartColors[1] },
    ],
  };

  const sections = {
    labels: ['一分部', '二三分部', '四分部'],
    datasets: [{ label: '到场率', data: [88, 76, 95], backgroundColor: [chartColors[0], chartColors[1], chartColors[2]] }],
  };

  return (
    <PublicLayout>
      <header className="mb-10">
        <div className="text-[10px] mono tracking-[0.3em] text-c2 mb-2">DASHBOARD / EQUIPMENT</div>
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">设备资源仪表盘</h1>
        <p className="mt-2 text-sm text-ink-muted">各分部设备配置、缺口与到场情况</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="配置总数" value="144" unit="台" color="c1" />
        <KpiCard label="已到场" value="124" unit="台" delta="到场率 86%" trend="up" color="c3" />
        <KpiCard label="设备缺口" value="20" unit="台" delta="需补充" trend="down" color="c2" />
        <KpiCard label="待进场" value="3" unit="批次" color="c4" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <ChartContainer title="设备缺口" subtitle="按类型" type="bar" data={data} />
        <ChartContainer title="各分部到场率" subtitle="%" type="doughnut" data={sections} />
      </section>

      <Panel title="缺口清单" subtitle="需要补给的设备">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] mono uppercase tracking-wider text-ink-dim border-b border-border">
              <th className="px-3 py-2">设备</th>
              <th className="px-3 py-2 text-right">缺口</th>
              <th className="px-3 py-2 text-right">进度</th>
              <th className="px-3 py-2 w-32">状态</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: '自卸车', gap: 12, fill: 80, status: '紧急' },
              { name: '挖机', gap: 3, fill: 88, status: '处理中' },
              { name: '发电机', gap: 2, fill: 87, status: '处理中' },
              { name: '装载机', gap: 1, fill: 90, status: '计划中' },
              { name: '压路机', gap: 1, fill: 92, status: '计划中' },
              { name: '洒水车', gap: 1, fill: 87, status: '计划中' },
            ].map((row) => (
              <tr key={row.name} className="border-b border-border/30 hover:bg-bg-soft/30 transition-colors group">
                <td className="px-3 py-2.5 text-ink">
                  <span className="font-medium">{row.name}</span>
                </td>
                <td className="px-3 py-2.5 text-right mono text-c2 font-bold">{row.gap}</td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 h-1.5 bg-bg rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-c3 to-c1 rounded-full transition-all" style={{ width: `${row.fill}%` }} />
                    </div>
                    <span className="mono text-[11px] text-ink-dim w-8">{row.fill}%</span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <span className="tag" style={{ color: statusColor(row.status), background: statusColor(row.status) + '22', borderColor: statusColor(row.status) + '40' }}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </PublicLayout>
  );
}
