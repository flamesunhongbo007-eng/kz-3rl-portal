import { useEffect, useState } from 'react';
import { dataApi } from '@/lib/api';
import type { Member } from '@/lib/types';
import { Panel } from '@/components/ui/Panel';
import { CrudTable } from '@/components/ui/CrudTable';
import { Button } from '@/components/ui/Button';
import { Modal, Input, Textarea } from '@/components/ui/Form';

export function AdminMembers() {
  const [rows, setRows] = useState<Member[]>([]);
  const [editing, setEditing] = useState<Member | null>(null);
  const [creating, setCreating] = useState(false);
  const load = () => dataApi.list<Member>('MEMBERS').then(setRows);
  useEffect(() => { load(); }, []);
  const onSave = async (d: Member) => {
    if (editing) await dataApi.update('MEMBERS', editing.record_id, d); else await dataApi.create('MEMBERS', d);
    setEditing(null); setCreating(false); load();
  };
  const onDelete = async (r: Member) => { if (confirm(`删除「${r.name}」？`)) { await dataApi.remove('MEMBERS', r.record_id); load(); } };

  const initials = (name: string) => name.slice(0, 1);
  const colors = ['from-c1 to-c3', 'from-c2 to-c4', 'from-c3 to-c5', 'from-c5 to-c7', 'from-c6 to-c8'];
  const colorOf = (id: string) => colors[id.charCodeAt(id.length - 1) % colors.length];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10px] mono tracking-[0.3em] text-c5 mb-2">▸ MODULE / TEAM</div>
          <h1 className="text-4xl font-black text-ink leading-none">团队成员</h1>
          <p className="text-xs text-ink-dim mt-2 max-w-lg">管理项目部核心成员。头像用姓名首字母自动生成。</p>
        </div>
        <Button variant="glow" size="lg" onClick={() => setCreating(true)}>+ 新增成员</Button>
      </div>

      {/* 头像墙 */}
      <div className="flex items-center gap-2 flex-wrap glass-soft p-4">
        <div className="text-[10px] mono text-ink-dim tracking-wider mr-2">ROSTER · {rows.length}</div>
        <div className="flex -space-x-2">
          {rows.slice(0, 12).map((m) => (
            <div
              key={m.record_id}
              title={`${m.name} · ${m.role}`}
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${colorOf(m.record_id)} border-2 border-bg flex items-center justify-center text-white text-xs font-bold mono shadow-lg hover:scale-125 hover:z-10 transition-transform cursor-default`}
            >
              {initials(m.name)}
            </div>
          ))}
          {rows.length > 12 && (
            <div className="w-9 h-9 rounded-full bg-bg-soft border-2 border-bg flex items-center justify-center text-ink-muted text-[10px] mono">+{rows.length - 12}</div>
          )}
        </div>
      </div>

      <Panel title="成员列表" subtitle="点击编辑" variant="glow">
        <CrudTable<Member>
          rows={rows}
          columns={[
            { key: 'name', label: '姓名', width: '200px', render: (r) => (
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorOf(r.record_id)} flex items-center justify-center text-white text-xs font-bold mono shrink-0`}>
                  {initials(r.name)}
                </div>
                <div>
                  <div className="text-ink font-medium">{r.name}</div>
                  {r.email && <div className="text-[10px] mono text-ink-dim">{r.email}</div>}
                </div>
              </div>
            )},
            { key: 'role', label: '职位' },
            { key: 'org', label: '组织', render: (r) => <span className="text-c3 text-[11px] mono">{r.org || '—'}</span> },
            { key: 'bio', label: '简介', render: (r) => <span className="text-[11px] text-ink-dim line-clamp-1">{r.bio || '—'}</span> },
          ]}
          onEdit={setEditing}
          onDelete={onDelete}
        />
      </Panel>

      {(editing || creating) && <MemberEditor initial={editing} onClose={() => { setEditing(null); setCreating(false); }} onSave={onSave} />}
    </div>
  );
}

function MemberEditor({ initial, onClose, onSave }: { initial: Member | null; onClose: () => void; onSave: (m: Member) => void }) {
  const [data, setData] = useState<Member>(initial ?? { record_id: '', name: '', role: '', org: '', email: '' });
  const upd = (p: Partial<Member>) => setData({ ...data, ...p });
  return (
    <Modal open title={initial ? '编辑成员' : '新增成员'} onClose={onClose} footer={
      <><Button onClick={onClose}>取消</Button><Button variant="glow" onClick={() => onSave(data)}>保存</Button></>
    }>
      <div className="grid grid-cols-2 gap-4">
        <Input label="姓名" value={data.name} onChange={(v) => upd({ name: v })} required />
        <Input label="职位" value={data.role} onChange={(v) => upd({ role: v })} required />
        <Input label="组织" value={data.org ?? ''} onChange={(v) => upd({ org: v })} />
        <Input label="邮箱" type="email" value={data.email ?? ''} onChange={(v) => upd({ email: v })} />
        <div className="col-span-2"><Textarea label="简介" value={data.bio ?? ''} onChange={(v) => upd({ bio: v })} /></div>
      </div>
    </Modal>
  );
}
