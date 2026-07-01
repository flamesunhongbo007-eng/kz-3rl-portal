import { useEffect, useState } from 'react';
import { dataApi } from '@/lib/api';
import type { Decision } from '@/lib/types';
import { Panel } from '@/components/ui/Panel';
import { CrudTable } from '@/components/ui/CrudTable';
import { Button } from '@/components/ui/Button';
import { Modal, Input, Textarea } from '@/components/ui/Form';

export function AdminDecisions() {
  const [rows, setRows] = useState<Decision[]>([]);
  const [editing, setEditing] = useState<Decision | null>(null);
  const [creating, setCreating] = useState(false);
  const load = () => dataApi.list<Decision>('DECISIONS', (a, b) => b.decision_date - a.decision_date).then(setRows);
  useEffect(() => { load(); }, []);
  const onSave = async (d: Decision) => {
    if (editing) await dataApi.update('DECISIONS', editing.record_id, d); else await dataApi.create('DECISIONS', d);
    setEditing(null); setCreating(false); load();
  };
  const onDelete = async (r: Decision) => { if (confirm(`删除「${r.title}」？`)) { await dataApi.remove('DECISIONS', r.record_id); load(); } };

  const colors = ['from-c1 to-c3', 'from-c2 to-c4', 'from-c5 to-c7', 'from-c6 to-c8'];
  const colorOf = (id: string) => colors[id.charCodeAt(id.length - 1) % colors.length];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10px] mono tracking-[0.3em] text-c7 mb-2">▸ MODULE / DECISIONS</div>
          <h1 className="text-4xl font-black text-ink leading-none">决策日志</h1>
          <p className="text-xs text-ink-dim mt-2 max-w-lg">重大决策记录与原因。时间倒序展示。</p>
        </div>
        <Button variant="glow" size="lg" onClick={() => setCreating(true)}>+ 新增决策</Button>
      </div>

      {/* 时间线卡片视图 */}
      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="text-center py-16 text-ink-dim text-sm">暂无决策记录</div>
        ) : rows.map((d, idx) => (
          <div key={d.record_id} className="relative glass-soft p-4 hover:border-c7/40 hover:translate-x-1 transition-all duration-200 group">
            {/* 序号气泡 */}
            <div className={`absolute -left-2 -top-2 w-7 h-7 rounded-full bg-gradient-to-br ${colorOf(d.record_id)} flex items-center justify-center text-white text-[10px] font-bold mono shadow-lg`}>
              {String(idx + 1).padStart(2, '0')}
            </div>
            {/* 时间线虚线 */}
            {idx < rows.length - 1 && <div className="absolute -bottom-3 left-1/2 w-px h-3 bg-gradient-to-b from-c7/30 to-transparent" />}

            <div className="flex items-start gap-4 ml-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-semibold text-ink">{d.title}</h3>
                  <span className="text-[10px] mono text-ink-dim">· {new Date(d.decision_date).toLocaleDateString('zh-CN')}</span>
                </div>
                {d.rationale && <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 mb-2">{d.rationale}</p>}
                <div className="flex items-center gap-2 text-[10px] mono">
                  <span className="text-ink-dim">决策人:</span>
                  <span className="text-c7">{d.decider}</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(d)} className="text-[11px] mono text-c1 hover:underline">编辑</button>
                <button onClick={() => onDelete(d)} className="text-[11px] mono text-danger/70 hover:text-danger">删除</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(editing || creating) && <DecEditor initial={editing} onClose={() => { setEditing(null); setCreating(false); }} onSave={onSave} />}
    </div>
  );
}

function DecEditor({ initial, onClose, onSave }: { initial: Decision | null; onClose: () => void; onSave: (d: Decision) => void }) {
  const [data, setData] = useState<Decision>(initial ?? { record_id: '', title: '', decider: '', decision_date: Date.now() });
  const upd = (p: Partial<Decision>) => setData({ ...data, ...p });
  return (
    <Modal open title={initial ? '编辑决策' : '新增决策'} onClose={onClose} footer={
      <><Button onClick={onClose}>取消</Button><Button variant="glow" onClick={() => onSave(data)}>保存</Button></>
    }>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Input label="决策标题" value={data.title} onChange={(v) => upd({ title: v })} required /></div>
        <Input label="决策人" value={data.decider} onChange={(v) => upd({ decider: v })} required />
        <Input label="日期" type="date" value={new Date(data.decision_date).toISOString().slice(0, 10)} onChange={(v) => upd({ decision_date: new Date(v).getTime() })} />
        <div className="col-span-2"><Textarea label="决策原因" value={data.rationale ?? ''} onChange={(v) => upd({ rationale: v })} rows={5} /></div>
      </div>
    </Modal>
  );
}
