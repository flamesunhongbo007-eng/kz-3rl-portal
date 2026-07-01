import { useEffect, useState } from 'react';
import { dataApi } from '@/lib/api';
import type { Section } from '@/lib/types';
import { Panel } from '@/components/ui/Panel';
import { CrudTable } from '@/components/ui/CrudTable';
import { Button } from '@/components/ui/Button';
import { Modal, Input, Textarea, Checkbox } from '@/components/ui/Form';

export function AdminSections() {
  const [rows, setRows] = useState<Section[]>([]);
  const [editing, setEditing] = useState<Section | null>(null);
  const [creating, setCreating] = useState(false);

  const load = () => dataApi.list<Section>('SECTIONS', (a, b) => a.order - b.order).then(setRows);
  useEffect(() => { load(); }, []);

  const onSave = async (data: Section) => {
    if (editing) await dataApi.update('SECTIONS', editing.record_id, data);
    else await dataApi.create('SECTIONS', data);
    setEditing(null); setCreating(false); load();
  };
  const onDelete = async (row: Section) => {
    if (!confirm(`删除板块「${row.title_zh}」？`)) return;
    await dataApi.remove('SECTIONS', row.record_id); load();
  };

  const visible = rows.filter(r => r.visible).length;
  const hidden = rows.length - visible;

  return (
    <div className="space-y-6">
      {/* 头部：巨型数字 + 操作 */}
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10px] mono tracking-[0.3em] text-c1 mb-2">▸ MODULE / SECTIONS</div>
          <h1 className="text-4xl font-black text-ink leading-none">板块定义</h1>
          <p className="text-xs text-ink-dim mt-2 max-w-lg">管理公开站展示的所有板块（首页导航 + /section/:key）。可见板块会出现在顶部导航和首页网格。</p>
        </div>
        <Button variant="glow" size="lg" onClick={() => setCreating(true)}>+ 新增板块</Button>
      </div>

      {/* 3 个状态卡 */}
      <div className="grid grid-cols-3 gap-3">
        <StatBlock label="板块总数" value={rows.length} unit="个" color="c1" icon="◈" />
        <StatBlock label="已启用" value={visible} unit="个" color="running" icon="●" />
        <StatBlock label="已隐藏" value={hidden} unit="个" color="c4" icon="○" />
      </div>

      <Panel title="板块列表" subtitle="按显示顺序排序 · 点击行编辑" variant="glow">
        <CrudTable<Section>
          rows={rows}
          columns={[
            { key: 'order', label: '序', width: '60px', render: (r) => (
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-md bg-c1/10 border border-c1/30 flex items-center justify-center text-c1 mono text-[11px] font-bold">
                  {String(r.order).padStart(2, '0')}
                </div>
              </div>
            )},
            { key: 'icon', label: '图标', width: '70px', render: (r) => (
              <span className="text-2xl text-c1 mono inline-block hover:scale-125 transition-transform cursor-default">{r.icon}</span>
            )},
            { key: 'section_key', label: 'KEY', width: '140px', render: (r) => (
              <code className="text-[11px] mono text-c1 bg-c1/10 border border-c1/20 rounded px-2 py-0.5 inline-block">{r.section_key}</code>
            )},
            { key: 'title_zh', label: '标题（中文）', render: (r) => (
              <div>
                <div className="text-ink font-medium">{r.title_zh}</div>
                {r.title_ru && <div className="text-[10px] mono text-ink-dim mt-0.5">{r.title_ru}</div>}
              </div>
            )},
            { key: 'description', label: '说明', render: (r) => <span className="text-[11px] text-ink-dim line-clamp-1">{r.description || '—'}</span> },
            { key: 'visible', label: '可见', width: '80px', align: 'center', render: (r) => (
              r.visible
                ? <span className="inline-flex items-center gap-1 text-running text-[11px] mono"><span className="w-1.5 h-1.5 rounded-full bg-running shadow-[0_0_6px_rgba(34,197,94,0.6)]" />ON</span>
                : <span className="text-ink-dim text-[11px] mono">○ OFF</span>
            )},
          ]}
          onEdit={setEditing}
          onDelete={onDelete}
        />
      </Panel>

      {(editing || creating) && (
        <SectionEditor initial={editing} onClose={() => { setEditing(null); setCreating(false); }} onSave={onSave} />
      )}
    </div>
  );
}

function StatBlock({ label, value, unit, color, icon }: { label: string; value: number; unit: string; color: string; icon: string }) {
  const colorMap: Record<string, string> = {
    c1: 'text-c1', c2: 'text-c2', c3: 'text-c3', c4: 'text-c4',
    c5: 'text-c5', c6: 'text-c6', c7: 'text-c7', c8: 'text-c8',
    running: 'text-running', danger: 'text-danger',
  };
  const borderMap: Record<string, string> = {
    c1: 'border-c1/30', c2: 'border-c2/30', c3: 'border-c3/30', c4: 'border-c4/30',
    running: 'border-running/30', danger: 'border-danger/30',
  };
  return (
    <div className={`relative glass-soft p-4 ${borderMap[color]} hover:border-current transition-all duration-200 group overflow-hidden`}>
      <div className="absolute top-0 right-0 text-3xl opacity-5 group-hover:opacity-10 transition-opacity">{icon}</div>
      <div className="text-[10px] mono uppercase tracking-[0.2em] text-ink-dim mb-2">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <div className={`text-3xl font-black mono tabular-nums ${colorMap[color]} drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]`}>{value}</div>
        <div className="text-[10px] mono text-ink-dim">{unit}</div>
      </div>
      <div className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-current to-transparent ${colorMap[color]} opacity-50`} style={{ width: '60%' }} />
    </div>
  );
}

function SectionEditor({ initial, onClose, onSave }: { initial: Section | null; onClose: () => void; onSave: (s: Section) => void }) {
  const [data, setData] = useState<Section>(initial ?? {
    record_id: '', section_key: '', title_zh: '', title_ru: '', order: 99, visible: true, icon: '◎', description: '',
  });
  const upd = (patch: Partial<Section>) => setData({ ...data, ...patch });

  return (
    <Modal
      open
      title={initial ? '编辑板块' : '新增板块'}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>取消</Button>
          <Button variant="glow" onClick={() => onSave(data)}>保存</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Input label="板块 KEY（英文，唯一）" value={data.section_key} onChange={(v) => upd({ section_key: v })} required />
        <Input label="显示顺序" type="number" value={data.order} onChange={(v) => upd({ order: Number(v) })} />
        <Input label="图标（单字符）" value={data.icon} onChange={(v) => upd({ icon: v })} />
        <Input label="标题（中文）" value={data.title_zh} onChange={(v) => upd({ title_zh: v })} required />
        <div className="col-span-2"><Input label="标题（俄文）" value={data.title_ru ?? ''} onChange={(v) => upd({ title_ru: v })} /></div>
        <div className="col-span-2"><Textarea label="说明" value={data.description ?? ''} onChange={(v) => upd({ description: v })} /></div>
        <div className="col-span-2 pt-2 border-t border-border/30">
          <Checkbox label="对用户可见" checked={data.visible} onChange={(v) => upd({ visible: v })} />
        </div>
      </div>
    </Modal>
  );
}
