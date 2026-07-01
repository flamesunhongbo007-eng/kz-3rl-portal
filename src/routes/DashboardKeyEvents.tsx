import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Panel } from '@/components/ui/Panel';
import { dataApi } from '@/lib/api';
import { statusColor, severityColor } from '@/styles/theme';
import type { ContentItem } from '@/lib/types';

export function DashboardKeyEvents() {
  const [items, setItems] = useState<ContentItem[]>([]);
  useEffect(() => {
    dataApi.list<ContentItem>('CONTENT').then((r) =>
      setItems(r.filter((c) => c.tags?.includes('风险') || c.status === '阻塞' || c.status === '进行中').slice(0, 12))
    );
  }, []);

  const urgent = items.filter((i) => i.tags?.includes('风险') || i.status === '阻塞').length;
  const inProgress = items.filter((i) => i.status === '进行中').length;

  // 心跳倒计时：阻塞事项的"心跳"动画
  return (
    <PublicLayout>
      <header className="mb-10 relative">
        <div className="text-[10px] mono tracking-[0.3em] text-danger mb-2">DASHBOARD / KEY EVENTS</div>
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">重要事项仪表盘</h1>
        <p className="mt-2 text-sm text-ink-muted">剩余时间提醒、紧急程度、负责人</p>
      </header>

      {/* 紧急程度色块 + 倒计时 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <UrgencyCard label="紧急" value={urgent} color="danger" pulse />
        <UrgencyCard label="进行中" value={inProgress} color="c1" />
        <UrgencyCard label="本周到期" value="3" color="c4" />
        <UrgencyCard label="已闭环" value="8" color="running" />
      </div>

      <Panel title="事项清单" subtitle="按紧急程度排序">
        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="text-center text-ink-dim py-8 text-xs">暂无重要事项</div>
          ) : items.map((it, idx) => {
            const isUrgent = it.status === '阻塞' || it.tags?.includes('风险');
            return (
              <div
                key={it.record_id}
                className={`relative p-3 rounded-md border transition-all hover:translate-x-1 ${
                  isUrgent
                    ? 'border-danger/30 bg-danger/[0.04] hover:border-danger/60'
                    : 'border-border/50 bg-bg-soft/30 hover:border-c1/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* 序号 */}
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] mono font-bold shrink-0 ${
                    isUrgent ? 'bg-danger/20 text-danger' : 'bg-bg-soft text-ink-dim'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  {/* 心跳点 */}
                  {isUrgent && (
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-danger" />
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink truncate">{it.title}</div>
                    {it.body_md && <div className="text-[11px] text-ink-dim mt-0.5 line-clamp-1">{it.body_md}</div>}
                  </div>
                  <span className="tag" style={{ color: statusColor(it.status ?? ''), background: statusColor(it.status ?? '') + '22', borderColor: statusColor(it.status ?? '') + '40' }}>
                    {it.status}
                  </span>
                  <div className="text-[10px] mono text-ink-dim shrink-0 w-20 text-right">
                    {it.date ? new Date(it.date).toLocaleDateString('zh-CN') : '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </PublicLayout>
  );
}

function UrgencyCard({ label, value, color, pulse }: { label: string; value: number | string; color: string; pulse?: boolean }) {
  const colorMap: Record<string, string> = { danger: 'text-danger', c1: 'text-c1', c3: 'text-c3', c4: 'text-c4', running: 'text-running' };
  return (
    <div className={`relative glass-soft p-5 overflow-hidden ${pulse ? 'border-danger/30' : ''}`}>
      {pulse && (
        <>
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-danger" />
          </span>
        </>
      )}
      <div className="text-[10px] mono uppercase tracking-[0.2em] text-ink-dim mb-2">{label}</div>
      <div className={`text-4xl font-black mono tabular-nums ${colorMap[color]}`}>{value}</div>
    </div>
  );
}
