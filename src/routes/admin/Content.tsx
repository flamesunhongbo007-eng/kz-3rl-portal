import { useEffect, useMemo, useState } from 'react';
import { dataApi } from '@/lib/api';
import type { ContentItem, Section } from '@/lib/types';
import { Panel } from '@/components/ui/Panel';
import { CrudTable } from '@/components/ui/CrudTable';
import { Button } from '@/components/ui/Button';
import { Modal, Input, Textarea, Select } from '@/components/ui/Form';
import { statusColor } from '@/styles/theme';

export function AdminContent() {
  const [rows, setRows] = useState<ContentItem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<string>('全部');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'card'>('table');

  const load = () => Promise.all([
    dataApi.list<ContentItem>('CONTENT', (a, b) => (b.date ?? 0) - (a.date ?? 0)),
    dataApi.list<Section>('SECTIONS', (a, b) => a.order - b.order),
  ]).then(([c, s]) => { setRows(c); setSections(s); });
  useEffect(() => { load(); }, []);

  const secLabel = (key: string) => sections.find((s) => s.section_key === key)?.title_zh || key;
  const counts = useMemo(() => {
    const map: Record<string, number> = { 全部: rows.length };
    sections.forEach(s => { map[s.section_key] = rows.filter(r => r.section_key === s.section_key).length; });
    return map;
  }, [rows, sections]);

  const filtered = useMemo(() => {
    let r = rows;
    if (filter !== '全部') r = r.filter(x => x.section_key === filter);
    if (search) r = r.filter(x =>
      x.title.toLowerCase().includes(search.toLowerCase()) ||
      (x.body_md ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (x.tags ?? []).join(' ').toLowerCase().includes(search.toLowerCase())
    );
    return r;
  }, [rows, filter, search]);

  const onSave = async (data: ContentItem) => {
    if (editing) await dataApi.update('CONTENT', editing.record_id, data);
    else await dataApi.create('CONTENT', data);
    setEditing(null); setCreating(false); load();
  };
  const onDelete = async (row: ContentItem) => {
    if (!confirm(`删除「${row.title}」？`)) return;
    await dataApi.remove('CONTENT', row.record_id); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10px] mono tracking-[0.3em] text-c2 mb-2">▸ MODULE / CONTENT</div>
          <h1 className="text-4xl font-black text-ink leading-none">板块内容</h1>
          <p className="text-xs text-ink-dim mt-2 max-w-lg">管理各板块下的条目（任务、文档、公告…）。用搜索框快速定位，或切换到卡片视图查看更多详情。</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView(view === 'table' ? 'card' : 'table')}
            className="text-[11px] mono px-3 py-1.5 rounded-md border border-border text-ink-muted hover:text-c1 hover:border-c1/40 transition-colors"
          >
            {view === 'table' ? '▦ 卡片视图' : '▤ 表格视图'}
          </button>
          <Button variant="glow" size="lg" onClick={() => setCreating(true)}>+ 新增条目</Button>
        </div>
      </div>

      {/* 搜索 + 板块筛选 */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim text-sm">⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索标题、内容、标签…"
            className="w-full pl-9 pr-3 py-2 bg-bg-soft/60 border border-border rounded-md text-sm text-ink mono placeholder:text-ink-dim focus:border-c1 focus:outline-none focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all"
          />
        </div>
        <div className="text-[10px] mono text-ink-dim">显示 <span className="text-c1 font-bold">{filtered.length}</span> / {rows.length} 条</div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <FilterBtn active={filter === '全部'} onClick={() => setFilter('全部')}>全部 ({counts['全部']})</FilterBtn>
        {sections.map((s) => {
          const n = counts[s.section_key] || 0;
          return (
            <FilterBtn key={s.section_key} active={filter === s.section_key} onClick={() => setFilter(s.section_key)}>
              {s.icon} {s.title_zh} ({n})
            </FilterBtn>
          );
        })}
      </div>

      {view === 'table' ? (
        <Panel title={`${filter === '全部' ? '全部' : secLabel(filter)} · ${filtered.length} 条`} subtitle="按时间倒序">
          <CrudTable<ContentItem>
            rows={filtered}
            columns={[
              { key: 'title', label: '标题' },
              { key: 'section_key', label: '板块', width: '110px', render: (r) => <span className="text-c1 text-[11px] mono">{secLabel(r.section_key)}</span> },
              { key: 'status', label: '状态', width: '100px', render: (r) => (
                <span className="tag" style={{ color: statusColor(r.status ?? ''), background: statusColor(r.status ?? '') + '22', borderColor: statusColor(r.status ?? '') + '40' }}>{r.status}</span>
              )},
              { key: 'date', label: '日期', width: '100px', render: (r) => <span className="text-[11px] mono text-ink-dim">{r.date ? new Date(r.date).toLocaleDateString('zh-CN') : '—'}</span> },
            ]}
            onEdit={setEditing}
            onDelete={onDelete}
            emptyText="无匹配条目"
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-ink-dim text-sm">无匹配条目</div>
          ) : filtered.map((it) => (
            <div key={it.record_id} className="glass-soft p-4 hover:border-c1/40 hover:translate-y-[-2px] transition-all duration-200 group">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-ink flex-1 line-clamp-2">{it.title}</h3>
                <span className="tag shrink-0" style={{ color: statusColor(it.status ?? ''), background: statusColor(it.status ?? '') + '22', borderColor: statusColor(it.status ?? '') + '40' }}>{it.status}</span>
              </div>
              {it.body_md && <p className="text-[11px] text-ink-muted line-clamp-2 mb-2">{it.body_md}</p>}
              <div className="flex flex-wrap gap-1 mb-3">{(it.tags ?? []).map((t) => <span key={t} className="tag text-[9px]">{t}</span>)}</div>
              <div className="flex items-center justify-between text-[10px] mono text-ink-dim">
                <span>{it.date ? new Date(it.date).toLocaleDateString('zh-CN') : '—'}</span>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditing(it)} className="text-c1 hover:underline">编辑</button>
                  <button onClick={() => onDelete(it)} className="text-danger hover:underline">删除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <ContentEditor initial={editing} sections={sections} onClose={() => { setEditing(null); setCreating(false); }} onSave={onSave} />
      )}
    </div>
  );
}

function FilterBtn({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] mono px-2.5 py-1.5 rounded-md border transition-all ${
        active
          ? 'border-c1 text-c1 bg-c1/10 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
          : 'border-border text-ink-muted hover:border-c1/40 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

function ContentEditor({ initial, sections, onClose, onSave }: { initial: ContentItem | null; sections: Section[]; onClose: () => void; onSave: (c: ContentItem) => void }) {
  const [data, setData] = useState<ContentItem>(initial ?? {
    record_id: '', section_key: sections[0]?.section_key || '', title: '', body_md: '', status: '计划中', tags: [], date: Date.now(),
  });
  const upd = (patch: Partial<ContentItem>) => setData({ ...data, ...patch });
  return (
    <Modal
      open
      title={initial ? '编辑条目' : '新增条目'}
      onClose={onClose}
      width="lg"
      footer={
        <>
          <Button onClick={onClose}>取消</Button>
          <Button variant="glow" onClick={() => onSave(data)}>保存</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input label="标题" value={data.title} onChange={(v) => upd({ title: v })} required />
        </div>
        <Select
          label="所属板块"
          value={data.section_key}
          onChange={(v) => upd({ section_key: v })}
          options={sections.map((s) => ({ value: s.section_key, label: s.title_zh }))}
        />
        <Select
          label="状态"
          value={data.status || ''}
          onChange={(v) => upd({ status: v })}
          options={['计划中', '进行中', '阻塞', '已完成', '归档', '已取消'].map((s) => ({ value: s, label: s }))}
        />
        <Input label="日期" type="date" value={data.date ? new Date(data.date).toISOString().slice(0, 10) : ''} onChange={(v) => upd({ date: v ? new Date(v).getTime() : undefined })} />
        <Input label="标签（逗号分隔）" value={(data.tags ?? []).join(', ')} onChange={(v) => upd({ tags: v.split(/[,，]/).map((s) => s.trim()).filter(Boolean) })} />
        <div className="col-span-2">
          <Textarea label="内容" value={data.body_md ?? ''} onChange={(v) => upd({ body_md: v })} rows={5} />
        </div>
      </div>
    </Modal>
  );
}
