import { useEffect, useMemo, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { dataApi } from '@/lib/api';
import type { ContentItem } from '@/lib/types';
import { statusColor } from '@/styles/theme';

// 记忆点：4 列 Kanban 看板
export function TasksPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [filter, setFilter] = useState<string>('全部');
  useEffect(() => {
    dataApi.list<ContentItem>('CONTENT', (a, b) => (b.date ?? 0) - (a.date ?? 0)).then((r) =>
      setItems(r.filter((c) => c.section_key === 'tasks'))
    );
  }, []);

  const filtered = useMemo(() => filter === '全部' ? items : items.filter((i) => i.status === filter), [items, filter]);

  const columns: { key: string; label: string; color: string; statuses: string[] }[] = [
    { key: 'plan', label: '计划中', color: 'c4', statuses: ['计划中', '待'] },
    { key: 'progress', label: '进行中', color: 'c1', statuses: ['进行中', '在'] },
    { key: 'block', label: '阻塞', color: 'danger', statuses: ['阻塞', '卡', '风险'] },
    { key: 'done', label: '已完成', color: 'running', statuses: ['已完成', 'done', '完成'] },
  ];

  return (
    <PublicLayout>
      <header className="mb-10">
        <div className="text-[10px] mono tracking-[0.3em] text-c1 mb-2">SECTION / TASKS</div>
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">任务看板</h1>
        <p className="mt-2 text-sm text-ink-muted">Kanban 风格 · 按状态自动分列</p>
      </header>

      <div className="flex flex-wrap gap-1.5 mb-6">
        <FilterBtn active={filter === '全部'} onClick={() => setFilter('全部')}>全部 ({items.length})</FilterBtn>
        {Array.from(new Set(items.map((i) => i.status ?? '其他'))).map((s) => (
          <FilterBtn key={s} active={filter === s} onClick={() => setFilter(s)}>{s}</FilterBtn>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {columns.map((col) => {
          const colItems = items.filter(it => col.statuses.some(s => (it.status ?? '').includes(s)));
          return (
            <div key={col.key} className="relative">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${col.color}`} />
                  <h3 className="text-sm font-semibold text-ink">{col.label}</h3>
                </div>
                <span className="text-[10px] mono text-ink-dim bg-bg-soft border border-border rounded-full px-2 py-0.5">{colItems.length}</span>
              </div>
              <div className="space-y-2 min-h-[200px] glass-soft p-2 border-dashed">
                {colItems.length === 0 ? (
                  <div className="text-center text-ink-dim text-[10px] mono py-8 opacity-50">空</div>
                ) : colItems.map(it => (
                  <div
                    key={it.record_id}
                    className="group relative bg-bg-soft/60 hover:bg-bg-soft border border-border/50 hover:border-c1/40 rounded-md p-2.5 transition-all cursor-pointer"
                  >
                    {/* 状态条 */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-md" style={{ background: statusColor(it.status ?? '') }} />
                    <div className="text-xs text-ink leading-snug mb-1.5">{it.title}</div>
                    {it.body_md && <div className="text-[10px] text-ink-dim line-clamp-1 mb-1.5">{it.body_md}</div>}
                    <div className="flex items-center justify-between text-[9px] mono text-ink-dim">
                      <div className="flex gap-1">
                        {(it.tags ?? []).slice(0, 2).map(t => <span key={t} className="tag text-[8px]">{t}</span>)}
                      </div>
                      <span>{it.date ? new Date(it.date).toLocaleDateString('zh-CN').slice(5) : '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PublicLayout>
  );
}

function FilterBtn({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] mono px-2.5 py-1.5 rounded-md border transition-colors ${
        active ? 'border-c1 text-c1 bg-c1/10' : 'border-border text-ink-muted hover:border-ink-muted'
      }`}
    >
      {children}
    </button>
  );
}
