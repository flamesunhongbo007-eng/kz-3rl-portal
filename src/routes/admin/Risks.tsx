import { useEffect, useState } from 'react';
import { dataApi } from '@/lib/api';
import type { Risk } from '@/lib/types';
import { Panel } from '@/components/ui/Panel';
import { CrudTable } from '@/components/ui/CrudTable';
import { Button } from '@/components/ui/Button';
import { Modal, Input, Textarea, Select } from '@/components/ui/Form';
import { severityColor } from '@/styles/theme';

export function AdminRisks() {
  const [rows, setRows] = useState<Risk[]>([]);
  const [editing, setEditing] = useState<Risk | null>(null);
  const [creating, setCreating] = useState(false);
  const load = () => dataApi.list<Risk>('RISKS').then(setRows);
  useEffect(() => { load(); }, []);
  const onSave = async (d: Risk) => {
    if (editing) await dataApi.update('RISKS', editing.record_id, d); else await dataApi.create('RISKS', d);
    setEditing(null); setCreating(false); load();
  };
  const onDelete = async (r: Risk) => { if (confirm(`删除「${r.title}」？`)) { await dataApi.remove('RISKS', r.record_id); load(); } };

  // 2x2 矩阵数据
  const matrix: Record<string, Record<string, Risk[]>> = {
    低: { 低: [], 中: [], 高: [] }, 中: { 低: [], 中: [], 高: [] },
    高: { 低: [], 中: [], 高: [] }, 严重: { 低: [], 中: [], 高: [] },
  };
  rows.forEach(r => { if (matrix[r.severity]?.[r.probability]) matrix[r.severity][r.probability].push(r); });
  const max = Math.max(1, ...Object.values(matrix).flatMap(s => Object.values(s)).map(arr => arr.length));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10px] mono tracking-[0.3em] text-c2 mb-2">▸ MODULE / RISKS</div>
          <h1 className="text-4xl font-black text-ink leading-none">风险登记</h1>
          <p className="text-xs text-ink-dim mt-2 max-w-lg">风险矩阵、严重度、应对措施。矩阵单元格越亮 = 该象限风险越多。</p>
        </div>
        <Button variant="glow" size="lg" onClick={() => setCreating(true)}>+ 新增风险</Button>
      </div>

      {/* 风险矩阵 */}
      <Panel title="风险矩阵" subtitle="严重度 × 概率" variant="glow">
        <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-1.5 text-[10px] mono">
          <div></div>
          {['低', '中', '高'].map(p => (
            <div key={p} className="text-center text-ink-dim tracking-wider py-1">概率 · {p}</div>
          ))}
          {(['严重', '高', '中', '低'] as const).map(s => (
            <>
              <div key={`label-${s}`} className="flex items-center justify-end pr-2 text-ink-dim" style={{ color: severityColor(s) }}>严重 · {s}</div>
              {(['低', '中', '高'] as const).map(p => {
                const arr = matrix[s]?.[p] || [];
                const intensity = arr.length / max;
                return (
                  <div
                    key={`${s}-${p}`}
                    className="relative h-20 rounded-md border border-border/40 flex flex-col items-center justify-center gap-1 transition-all hover:border-c1/40"
                    style={{
                      background: `linear-gradient(135deg, ${severityColor(s)}${Math.round(intensity * 60).toString(16).padStart(2, '0')} 0%, transparent 100%)`,
                    }}
                  >
                    <div className="text-2xl font-black mono tabular-nums" style={{ color: severityColor(s) }}>{arr.length}</div>
                    {arr.length > 0 && <div className="text-[9px] text-ink-dim">{arr.length} 项</div>}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </Panel>

      <Panel title="风险列表" subtitle="按严重度排序">
        <CrudTable<Risk>
          rows={[...rows].sort((a, b) => {
            const order = { 严重: 4, 高: 3, 中: 2, 低: 1 };
            return order[b.severity] - order[a.severity];
          })}
          columns={[
            { key: 'title', label: '风险' },
            { key: 'severity', label: '严重度', width: '100px', render: (r) => (
              <span className="inline-flex items-center gap-1.5 text-[11px] mono" style={{ color: severityColor(r.severity) }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: severityColor(r.severity), boxShadow: `0 0 6px ${severityColor(r.severity)}` }} />
                {r.severity}
              </span>
            )},
            { key: 'probability', label: '概率', width: '80px', render: (r) => <span className="text-ink-muted mono text-[11px]">{r.probability}</span> },
            { key: 'owner', label: '负责人', render: (r) => <span className="text-c2 text-[11px] mono">{r.owner || '—'}</span> },
            { key: 'mitigation', label: '应对', render: (r) => <span className="text-[11px] text-ink-dim line-clamp-1">{r.mitigation || '—'}</span> },
          ]}
          onEdit={setEditing}
          onDelete={onDelete}
        />
      </Panel>

      {(editing || creating) && <RiskEditor initial={editing} onClose={() => { setEditing(null); setCreating(false); }} onSave={onSave} />}
    </div>
  );
}

function RiskEditor({ initial, onClose, onSave }: { initial: Risk | null; onClose: () => void; onSave: (r: Risk) => void }) {
  const [data, setData] = useState<Risk>(initial ?? { record_id: '', title: '', severity: '中', probability: '中', status: '开放' });
  const upd = (p: Partial<Risk>) => setData({ ...data, ...p });
  return (
    <Modal open title={initial ? '编辑风险' : '新增风险'} onClose={onClose} footer={
      <><Button onClick={onClose}>取消</Button><Button variant="glow" onClick={() => onSave(data)}>保存</Button></>
    }>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Input label="风险描述" value={data.title} onChange={(v) => upd({ title: v })} required /></div>
        <Select label="严重度" value={data.severity} onChange={(v) => upd({ severity: v as Risk['severity'] })} options={['低', '中', '高', '严重'].map((s) => ({ value: s, label: s }))} />
        <Select label="概率" value={data.probability} onChange={(v) => upd({ probability: v as Risk['probability'] })} options={['低', '中', '高'].map((s) => ({ value: s, label: s }))} />
        <Input label="负责人" value={data.owner ?? ''} onChange={(v) => upd({ owner: v })} />
        <Select label="状态" value={data.status} onChange={(v) => upd({ status: v })} options={['开放', '处理中', '监控', '关闭'].map((s) => ({ value: s, label: s }))} />
        <div className="col-span-2"><Textarea label="应对措施" value={data.mitigation ?? ''} onChange={(v) => upd({ mitigation: v })} rows={4} /></div>
      </div>
    </Modal>
  );
}
