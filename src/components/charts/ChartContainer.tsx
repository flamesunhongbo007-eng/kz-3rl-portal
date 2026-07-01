import { ReactNode } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line, Bar, Doughnut, Scatter } from 'react-chartjs-2';
import { chartTheme } from '@/styles/theme';

Chart.register(...registerables);
Chart.defaults.color = chartTheme.text;
Chart.defaults.font.family = chartTheme.font.family;
Chart.defaults.font.size = chartTheme.font.size;
Chart.defaults.borderColor = chartTheme.grid;

interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  type: 'line' | 'bar' | 'doughnut' | 'scatter';
  data: any;
  options?: any;
  height?: number;
  legend?: ReactNode;
}

export function ChartContainer({ title, subtitle, type, data, options = {}, height = 280, legend }: ChartContainerProps) {
  const mergedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: !!legend, labels: { color: chartTheme.text, font: chartTheme.font } },
    },
    scales: type === 'doughnut' ? undefined : {
      x: { grid: { color: chartTheme.grid }, ticks: { color: chartTheme.text, font: chartTheme.font } },
      y: { grid: { color: chartTheme.grid }, ticks: { color: chartTheme.text, font: chartTheme.font } },
    },
    ...options,
  };

  const Comp = type === 'line' ? Line : type === 'bar' ? Bar : type === 'doughnut' ? Doughnut : Scatter;

  return (
    <div className="glass-soft p-4">
      {title && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-ink">{title}</h4>
          {subtitle && <p className="text-[10px] mono text-ink-dim mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div style={{ height }}>
        <Comp data={data} options={mergedOptions} />
      </div>
    </div>
  );
}
