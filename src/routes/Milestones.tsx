import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { dataApi } from '@/lib/api';
import type { Milestone } from '@/lib/types';
import { statusColor } from '@/styles/theme';

// 记忆点：巨型时间轴 + 当前节点"光柱"
export function MilestonesPage() {
  const [ms, setMs] = useState<Milestone[]>([]);
  useEffect(() => { dataApi.list<Milestone>('MILESTONES', (a, b) => a.planned_date - b.planned_date).then(setMs); }, []);

  const done = ms.filter(m => m.status === '已完成').length;
  const pct = ms.length ? Math.round((done / ms.length) * 100) : 0;

  return (
    <PublicLayout>
      <header className="mb-10">
        <div className="text-[10px] mono tracking-[0.3em] text-c6 mb-2">SECTION / MILESTONES</div>
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">里程碑</h1>
        <p className="mt-2 text-sm text-ink-muted">项目关键节点与计划时间表 · 时间轴可视化</p>
      </header>

      {/* 巨型进度条 */}
      <div className="glass p-6 mb-10 relative overflow-hidden">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-[10px] mono uppercase tracking-[0.2em] text-ink-dim">总进度</div>
            <div className="text-5xl font-black mono text-c6 mt-1">{pct}<span className="text-xl">%</span></div>
          </div>
          <div className="text-right">
            <div className="text-[10px] mono uppercase tracking-[0.2em] text-ink-dim">已完成 / 总计</div>
            <div className="text-2xl font-bold mono text-ink mt-1">{done} <span className="text-ink-dim text-base">/ {ms.length}</span></div>
          </div>
        </div>
        <div className="h-2 bg-bg rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-c1 via-c3 to-c6 rounded-full transition-all duration-1000 relative"
            style={{ width: `${pct}%` }}
          >
            {/* 光柱头部 */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-c1 shadow-[0_0_15px_rgba(59,130,246,0.8)] rounded-full" />
          </div>
        </div>
      </div>

      {/* 时间轴 */}
      <div className="relative pl-8">
        {/* 中轴线 */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-c1 via-c3 to-c6 opacity-50" />

        <ul className="space-y-6">
          {ms.map((m) => {
            const isDone = m.status === '已完成';
            const isCurrent = m.status === '进行中';
            const sc = statusColor(m.status);
            return (
              <li key={m.record_id} className="relative">
                {/* 节点圆 */}
                <div
                  className={`absolute -left-[18px] top-2 w-4 h-4 rounded-full border-2 border-bg ${isCurrent ? 'animate-pulse' : ''}`}
                  style={{
                    background: sc,
                    boxShadow: isCurrent ? `0 0 16px ${sc}, 0 0 30px ${sc}80` : `0 0 8px ${sc}40`,
                  }}
                />
                {isCurrent && (
                  <div className="absolute -left-[10px] top-2 w-px h-px">
                    <div className="w-3 h-3 rounded-full animate-ping" style={{ background: sc, opacity: 0.6 }} />
                  </div>
                )}

                <div className={`glass-soft p-4 hover:border-c1/40 transition-all ${isCurrent ? 'border-c1/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : ''}`}>
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
                      {isCurrent && <span className="text-[10px] mono text-c1 animate-pulse">● CURRENT</span>}
                      {m.title}
                    </h3>
                    <span className="tag" style={{ color: sc, background: sc + '22', borderColor: sc + '40' }}>
                      {m.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[11px] mono text-ink-dim">
                    <span>阶段: <span className="text-c6">{m.phase}</span></span>
                    <span>计划: {new Date(m.planned_date).toLocaleDateString('zh-CN')}</span>
                    {m.actual_date && <span className="text-running">实际: {new Date(m.actual_date).toLocaleDateString('zh-CN')}</span>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </PublicLayout>
  );
}
