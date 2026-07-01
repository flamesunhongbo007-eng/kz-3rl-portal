import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { dataApi } from '@/lib/api';
import type { Decision } from '@/lib/types';

// 记忆点：时间倒序 + 翻页卡 + 决策人头像
export function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  useEffect(() => {
    dataApi.list<Decision>('DECISIONS', (a, b) => b.decision_date - a.decision_date).then(setDecisions);
  }, []);

  const colors = ['from-c1 to-c3', 'from-c2 to-c4', 'from-c5 to-c7', 'from-c6 to-c8', 'from-c3 to-c6', 'from-c4 to-c8'];
  const colorOf = (id: string) => colors[id.charCodeAt(id.length - 1) % colors.length];
  const initials = (n: string) => n.slice(0, 1);

  return (
    <PublicLayout>
      <header className="mb-10">
        <div className="text-[10px] mono tracking-[0.3em] text-c7 mb-2">SECTION / DECISIONS</div>
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">决策日志</h1>
        <p className="mt-2 text-sm text-ink-muted">重大决策记录与原因 · 时间倒序</p>
      </header>

      {decisions.length === 0 ? (
        <div className="glass-soft p-12 text-center text-ink-dim text-sm">暂无决策记录</div>
      ) : (
        <div className="space-y-3">
          {decisions.map((d, idx) => (
            <div
              key={d.record_id}
              className="group relative glass-soft p-5 hover:border-c7/40 transition-all duration-300 cursor-pointer overflow-hidden"
              style={{ perspective: '1000px' }}
            >
              {/* hover 时光泽扫过 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-c7/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              <div className="relative flex items-start gap-4">
                {/* 序号 + 头像 */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorOf(d.record_id)} flex items-center justify-center text-white text-base font-bold mono shadow-lg`}>
                    {initials(d.decider)}
                  </div>
                  <div className="text-[9px] mono text-ink-dim">#{String(idx + 1).padStart(2, '0')}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
                    <h3 className="text-base font-semibold text-ink group-hover:text-c7 transition-colors">{d.title}</h3>
                    <span className="text-[10px] mono text-ink-dim">{new Date(d.decision_date).toLocaleDateString('zh-CN')}</span>
                  </div>
                  {d.rationale && <p className="text-xs text-ink-muted leading-relaxed mb-2">{d.rationale}</p>}
                  <div className="flex items-center gap-2 text-[10px] mono">
                    <span className="text-ink-dim">决策人:</span>
                    <span className="text-c7">{d.decider}</span>
                  </div>
                </div>
              </div>

              {/* 角落装饰 */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-c7/30 rounded-tr-md" />
            </div>
          ))}
        </div>
      )}
    </PublicLayout>
  );
}
