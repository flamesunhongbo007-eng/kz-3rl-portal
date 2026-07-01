interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  color?: string; // tailwind class fragment e.g. 'c1'
}

export function KpiCard({ label, value, unit, delta, trend = 'flat', color = 'c1' }: KpiCardProps) {
  const colorMap: Record<string, string> = {
    c1: 'text-c1', c2: 'text-c2', c3: 'text-c3', c4: 'text-c4', c5: 'text-c5',
    c6: 'text-c6', c7: 'text-c7', c8: 'text-c8', c9: 'text-c9', danger: 'text-danger', running: 'text-running',
  };
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—';
  const trendColor = trend === 'up' ? 'text-running' : trend === 'down' ? 'text-danger' : 'text-ink-dim';
  return (
    <div className="glass p-5 hover:translate-y-[-2px] transition-all duration-200">
      <div className="text-[10px] mono uppercase tracking-wider text-ink-dim mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className={`text-3xl font-bold mono ${colorMap[color] || 'text-ink'}`}>{value}</div>
        {unit && <div className="text-xs text-ink-muted">{unit}</div>}
      </div>
      {delta && (
        <div className={`text-[11px] mono mt-2 ${trendColor}`}>
          {trendIcon} {delta}
        </div>
      )}
    </div>
  );
}
