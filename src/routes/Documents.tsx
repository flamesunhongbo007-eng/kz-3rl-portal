import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { dataApi } from '@/lib/api';
import type { ContentItem } from '@/lib/types';
import { Panel } from '@/components/ui/Panel';

// 记忆点：文档类型图标墙
const docIcons: Record<string, { icon: string; color: string; ext: string }> = {
  合同: { icon: '▤', color: 'from-c1 to-c3', ext: 'DOC' },
  报价: { icon: '◈', color: 'from-c2 to-c4', ext: 'XLS' },
  地质: { icon: '◬', color: 'from-c5 to-c7', ext: 'PDF' },
  发文: { icon: '✉', color: 'from-c3 to-c5', ext: 'PDF' },
  设备: { icon: '⚙', color: 'from-c6 to-c8', ext: 'XLS' },
  default: { icon: '▤', color: 'from-c4 to-c6', ext: 'DOC' },
};

export function DocumentsPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  useEffect(() => {
    dataApi.list<ContentItem>('CONTENT', (a, b) => (b.date ?? 0) - (a.date ?? 0)).then((r) =>
      setItems(r.filter((c) => c.section_key === 'documents'))
    );
  }, []);

  const getDocType = (tags: string[] = []): keyof typeof docIcons => {
    for (const t of tags) { if (docIcons[t]) return t as keyof typeof docIcons; }
    return 'default';
  };

  return (
    <PublicLayout>
      <header className="mb-10">
        <div className="text-[10px] mono tracking-[0.3em] text-c8 mb-2">SECTION / DOCUMENTS</div>
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">文档资料</h1>
        <p className="mt-2 text-sm text-ink-muted">合同、图纸、报告归档索引 · 按类型视觉分组</p>
      </header>

      {items.length === 0 ? (
        <Panel><div className="text-center text-ink-dim text-xs py-12">暂无文档</div></Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((it) => {
            const t = getDocType(it.tags);
            const info = docIcons[t];
            return (
              <div
                key={it.record_id}
                className="group relative glass-soft p-5 hover:border-c1/40 hover:translate-y-[-2px] transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* 大图标背景 */}
                <div className={`absolute -top-6 -right-6 text-7xl bg-gradient-to-br ${info.color} bg-clip-text text-transparent opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none`}>
                  {info.icon}
                </div>
                {/* 类型标签 */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${info.color} flex items-center justify-center text-white text-lg shadow-lg`}>
                    {info.icon}
                  </div>
                  <div>
                    <div className="text-[10px] mono text-ink-dim tracking-wider">{info.ext} · {t}</div>
                    <div className="text-[10px] mono text-ink-dim">{it.date ? new Date(it.date).toLocaleDateString('zh-CN') : '—'}</div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-ink line-clamp-2 mb-1.5 group-hover:text-c1 transition-colors">
                  {it.title}
                </h3>
                {it.body_md && <p className="text-[11px] text-ink-muted line-clamp-2 mb-2">{it.body_md}</p>}
                <div className="flex flex-wrap gap-1">
                  {(it.tags ?? []).map(tag => <span key={tag} className="tag text-[9px]">{tag}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PublicLayout>
  );
}
