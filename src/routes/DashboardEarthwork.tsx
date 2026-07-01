import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { KpiCard } from '@/components/ui/KpiCard';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { Panel } from '@/components/ui/Panel';
import { chartColors, statusColor } from '@/styles/theme';
import { FeishuEmbed } from '@/components/feishu/FeishuEmbed';
import { dataApi } from '@/lib/api';
import type { FeishuEmbed as Embed } from '@/lib/types';

export function DashboardEarthwork() {
  const [embed, setEmbed] = useState<Embed | null>(null);

  useEffect(() => {
    dataApi.list<Embed>('EMBEDS').then((es) => {
      setEmbed(es.find((e) => e.section_key === 'earthwork') ?? null);
    });
  }, []);

  const cumData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    datasets: [{
      label: '累计土方量（万方）',
      data: [12, 38, 78, 142, 220, 312, 410, 510, 598, 680, 752, 815],
      borderColor: chartColors[0],
      backgroundColor: chartColors[0] + '33',
      tension: 0.35,
      fill: true,
    }],
  };

  const compareData = {
    labels: ['一分部', '二三分部', '四分部'],
    datasets: [
      { label: '已完成', data: [128, 245, 88], backgroundColor: chartColors[0] },
      { label: '未完成', data: [42, 95, 72], backgroundColor: chartColors[1] },
    ],
  };

  const dayData = {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
    datasets: [{
      label: '日完成（方）',
      data: [3200, 4100, 3800, 4500, 5100, 4900, 5300, 5800, 6200, 7100, 6800, 7500, 8100, 7800, 8500, 9200, 8800, 9500, 10200, 9800, 11000, 10500, 11200, 12000, 11800, 12500, 13000, 12800, 13500, 14000],
      borderColor: chartColors[2],
      backgroundColor: chartColors[2] + '22',
      tension: 0.35,
      fill: true,
    }],
  };

  return (
    <PublicLayout>
      <header className="mb-10 relative">
        <div className="text-[10px] mono tracking-[0.3em] text-c1 mb-2">DASHBOARD / EARTHWORK</div>
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">土方仪表盘</h1>
        <p className="mt-2 text-sm text-ink-muted">全线土方日完成量、累计量及各分部对比</p>
      </header>

      {/* 巨型数字 hero */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-3">
        <HeroNumber label="累计完成" value="815" unit="万方" color="c1" sub="总目标 1200 万方" pct={68} />
        <HeroNumber label="今日完成" value="14000" unit="方" color="c2" sub="昨日 13500 方" trend="up" delta="+500" />
        <HeroNumber label="日均产能" value="8500" unit="方" color="c4" sub="目标 10000 方" pct={85} />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <ChartContainer title="累计土方量" subtitle="2026 年" type="line" data={cumData} />
        <ChartContainer title="各分部对比" subtitle="万方" type="bar" data={compareData} />
      </section>

      <section className="mb-8">
        <ChartContainer title="日完成量趋势" subtitle="近 30 天" type="line" data={dayData} />
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
  const bgMap: Record<string, string> = { c1: 'from-c1/10', c2: 'from-c2/10', c3: 'from-c3/10', c4: 'from-c4/10' };
  return (
    <div className={`relative glass p-6 overflow-hidden group bg-gradient-to-br ${bgMap[color]} to-transparent`}>
      <div className="text-[10px] mono uppercase tracking-[0.2em] text-ink-dim mb-3">{label}</div>
      <div className="flex items-baseline gap-2 mb-2">
        <div className={`text-5xl md:text-6xl font-black mono tabular-nums ${colorMap[color]} drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]`}>{value}</div>
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
        <div className="absolute top-3 right-3 w-1 h-12 bg-gradient-to-b from-current to-transparent opacity-30" style={{ color: colorMap[color].replace('text-', '') }} />
        <div className="absolute top-3 right-3 w-12 h-1 bg-gradient-to-r from-current to-transparent opacity-30" style={{ color: colorMap[color].replace('text-', '') }} />
      </div>
    </div>
  );
}
