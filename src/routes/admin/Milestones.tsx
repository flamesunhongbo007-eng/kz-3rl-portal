import { useEffect, useState } from 'react';
import { dataApi } from '@/lib/api';
import type { Milestone } from '@/lib/types';
import { Panel } from '@/components/ui/Panel';
import { CrudTable } from '@/components/ui/CrudTable';
import { Button } from '@/components/ui/Button';
import { Modal, Input, Select } from '@/components/ui/Form';
import { statusColor } from '@/styles/theme';

export function AdminMilestones() {
  const [rows, setRows] = useState<Milestone[]>([]);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [creating, setCreating] = useState(false);
  const load = () => dataApi.list<Milestone>('MILESTONES', (a, b) => a.planned_date - b.planned_date).then(setRows);
  useEffect(() => { load(); }, []);
  const onSave = async (d: Milestone) => {
    if (editing) await dataApi.update('MILESTONES', editing.record_id, d); else await dataApi.create('MILESTONES', d);
    setEditing(null); setCreating(false); load();
  };
  const onDelete = async (r: Milestone) => { if (confirm(`删除「${r.title}」？`)) { await dataApi.remove('MILESTONES', r.record_id); load(); } };

  const done = rows.filter(r => r.status === '已完成').length;
  const inProgress = rows.filter(r => r.status === '进行中').length;
  const total = rows.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10px] mono tracking-[0.3em] text-c6 mb-2">▸ MODULE / MILESTONES</div>
          <h1 className="text-4xl font-black text-ink leading-none">里程碑</h1>
          <p className="text-xs text-ink-dim mt-2 max-w-lg">关键节点与计划时间表。状态决定时间轴上的颜色。</p>
        </div>
        <Button variant="glow" size="lg" onClick={() => setCreating(true)}>+ 新增里程碑</Button>
      </div>

      {/* 进度环 + 统计 */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass-soft p-4 col-span-1 relative overflow-hidden">
          <div className="text-[10px] mono uppercase tracking-[0.2em] text-ink-dim mb-2">完成度</div>
          <div className="flex items-baseline gap-1">
            <div className="text-3xl font-black mono text-c6">{pct}<span className="text-base">%</span></div>
          </div>
          <div className="mt-2 h-1 bg-bg rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-c1 via-c3 to-c6 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <StatBlock label="已完成" value={done} unit="节点" color="running" />
        <StatBlock label="进行中" value={inProgress} unit="节点" color="c1" />
        <StatBlock label="计划中" value={total - done - inProgress} unit="节点" color="c4" />
      </div>

      <Panel title="里程碑列表" subtitle="按计划时间" variant="glow">
        <CrudTable<Milestone>
          rows={rows}
          columns={[
            { key: 'title', label: '标题' },
            { key: 'phase', label: '阶段', width: '100px', render: (r) => <span className="text-c6 text-[11px] mono">{r.phase}</span> },
            { key: 'status', label: '状态', width: '110px', render: (r) => (
              <span className="inline-flex items-center gap-1.5 text-[11px] mono" style={{ color: statusColor(r.status) }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(r.status), boxShadow: `0 0 6px ${statusColor(r.status)}` }} />
                {r.status}
              </span>
            )},
            { key: 'planned_date', label: '计划', width: '110px', render: (r) => <span className="mono text-[11px] text-ink-muted">{new Date(r.planned_date).toLocaleDateString('zh-CN')}</span> },
            { key: 'actual_date', label: '实际', width: '110px', render: (r) => <span className="mono text-[11px] text-running">{r.actual_date ? new Date(r.actual_date).toLocaleDateString('zh-CN') : '—'}</span> },
          ]}
          onEdit={setEditing}
          onDelete={onDelete}
        />
      </Panel>

      {(editing || creating) && <MsEditor initial={editing} onClose={() => { setEditing(null); setCreating(false); }} onSave={onSave} />}
    </div>
  );
}

function StatBlock({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  const colorMap: Record<string, string> = { c1: 'text-c1', c3: 'text-c3', c4: 'text-c4', c5: 'text-c5', c6: 'text-c6', running: 'text-running' };
  return (
    <div className="glass-soft p-4">
      <div className="text-[10px] mono uppercase tracking-[0.2em] text-ink-dim mb-2">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <div className={`text-3xl font-black mono tabular-nums ${colorMap[color]}`}>{value}</div>
        <div className="text-[10px] mono text-ink-dim">{unit}</div>
      </div>
    </div>
  );
}

function MsEditor({ initial, onClose, onSave }: { initial: Milestone | null; onClose: () => void; onSave: (m: Milestone) => void }) {
  const [data, setData] = useState<Milestone>(initial ?? { record_id: '', title: '', phase: '施工', status: '计划中', planned_date: Date.now() });
  const upd = (p: Partial<Milestone>) => setData({ ...data, ...p });
  return (
    <Modal open title={initial ? '编辑里程碑' : '新增里程碑'} onClose={onClose} footer={
      <><Button onClick={onClose}>取消</Button><Button variant="glow" onClick={() => onSave(data)}>保存</Button></>
    }>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Input label="标题" value={data.title} onChange={(v) => upd({ title: v })} required /></div>
        <Input label="阶段" value={data.phase} onChange={(v) => upd({ phase: v })} />
        <Select label="状态" value={data.status} onChange={(v) => upd({ status: v })} options={['计划中', '进行中', '已完成', '延期'].map((s) => ({ value: s, label: s }))} />
        <Input label="计划日期" type="date" value={new Date(data.planned_date).toISOString().slice(0, 10)} onChange={(v) => upd({ planned_date: new Date(v).getTime() })} />
        <Input label="实际日期" type="date" value={data.actual_date ? new Date(data.actual_date).toISOString().slice(0, 10) : ''} onChange={(v) => upd({ actual_date: v ? new Date(v).getTime() : undefined })} />
      </div>
    </Modal>
  );
}
