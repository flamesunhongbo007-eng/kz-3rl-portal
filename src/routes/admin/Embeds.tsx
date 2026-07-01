import { useEffect, useState } from 'react';
import { dataApi } from '@/lib/api';
import type { FeishuEmbed, Section } from '@/lib/types';
import { Panel } from '@/components/ui/Panel';
import { CrudTable } from '@/components/ui/CrudTable';
import { Button } from '@/components/ui/Button';
import { Modal, Input, Select } from '@/components/ui/Form';
import { FeishuEmbed as FeishuEmbedView } from '@/components/feishu/FeishuEmbed';

export function AdminEmbeds() {
  const [rows, setRows] = useState<FeishuEmbed[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [editing, setEditing] = useState<FeishuEmbed | null>(null);
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<FeishuEmbed | null>(null);

  const load = () => Promise.all([
    dataApi.list<FeishuEmbed>('EMBEDS'),
    dataApi.list<Section>('SECTIONS'),
  ]).then(([e, s]) => { setRows(e); setSections(s); });
  useEffect(() => { load(); }, []);

  const secLabel = (key: string) => sections.find((s) => s.section_key === key)?.title_zh || key;
  const configured = rows.filter(r => r.url).length;

  const onSave = async (data: FeishuEmbed) => {
    if (editing) await dataApi.update('EMBEDS', editing.record_id, data);
    else await dataApi.create('EMBEDS', data);
    setEditing(null); setCreating(false); load();
  };
  const onDelete = async (row: FeishuEmbed) => {
    if (!confirm(`删除嵌入位「${row.title}」？`)) return;
    await dataApi.remove('EMBEDS', row.record_id); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10px] mono tracking-[0.3em] text-c3 mb-2">▸ MODULE / FEISHU EMBEDS</div>
          <h1 className="text-4xl font-black text-ink leading-none">飞书嵌入</h1>
          <p className="text-xs text-ink-dim mt-2 max-w-lg">把飞书多维表格的 URL 粘到这里，公开站会渲染成 iframe。<span className="text-c1">需在飞书开启「允许嵌入到外部网页」</span>。</p>
        </div>
        <Button variant="glow" size="lg" onClick={() => setCreating(true)}>+ 新增嵌入</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatBlock label="嵌入位总数" value={rows.length} unit="个" color="c1" icon="▦" />
        <StatBlock label="已配置 URL" value={configured} unit="个" color="running" icon="◉" />
        <StatBlock label="待配置" value={rows.length - configured} unit="个" color="c4" icon="◌" />
      </div>

      <Panel title="嵌入列表" subtitle="点击编辑 · 实时预览" variant="glow">
        <CrudTable<FeishuEmbed>
          rows={rows}
          columns={[
            { key: 'embed_key', label: 'KEY', width: '140px', render: (r) => <code className="text-[11px] mono text-c1 bg-c1/10 border border-c1/20 rounded px-2 py-0.5">{r.embed_key}</code> },
            { key: 'title', label: '标题' },
            { key: 'section_key', label: '板块', width: '110px', render: (r) => <span className="text-c3 text-[11px] mono">{secLabel(r.section_key)}</span> },
            { key: 'url', label: 'URL', render: (r) => r.url
              ? <span className="text-ink-muted text-[11px] mono truncate max-w-md inline-block align-middle">{r.url}</span>
              : <span className="text-c4 text-[11px] mono">— 未配置</span>
            },
            { key: 'height', label: '高', width: '70px', align: 'center', render: (r) => <span className="mono text-ink-muted">{r.height || 600}px</span> },
            { key: '_preview', label: '', width: '60px', align: 'right', render: (r) => (
              r.url ? <button onClick={() => setPreview(r)} className="text-[10px] mono text-c1 hover:underline">预览</button> : null
            )},
          ]}
          onEdit={setEditing}
          onDelete={onDelete}
        />
      </Panel>

      {preview && (
        <Panel title={`预览 · ${preview.title}`} subtitle={preview.url} actions={
          <button onClick={() => setPreview(null)} className="text-[11px] mono text-ink-dim hover:text-ink">× 关闭</button>
        }>
          <FeishuEmbedView url={preview.url} title={preview.title} height={preview.height || 500} />
        </Panel>
      )}

      {(editing || creating) && (
        <EmbedEditor initial={editing} sections={sections} onClose={() => { setEditing(null); setCreating(false); }} onSave={onSave} />
      )}
    </div>
  );
}

function StatBlock({ label, value, unit, color, icon }: { label: string; value: number; unit: string; color: string; icon: string }) {
  const colorMap: Record<string, string> = { c1: 'text-c1', c3: 'text-c3', c4: 'text-c4', running: 'text-running' };
  return (
    <div className="glass-soft p-4 hover:border-current transition-all group overflow-hidden">
      <div className="absolute relative">
        <div className="text-[10px] mono uppercase tracking-[0.2em] text-ink-dim mb-2">{label}</div>
        <div className="flex items-baseline gap-1.5">
          <div className={`text-3xl font-black mono tabular-nums ${colorMap[color]}`}>{value}</div>
          <div className="text-[10px] mono text-ink-dim">{unit}</div>
        </div>
        <div className="text-2xl opacity-5 absolute top-0 right-0">{icon}</div>
      </div>
    </div>
  );
}

function EmbedEditor({ initial, sections, onClose, onSave }: { initial: FeishuEmbed | null; sections: Section[]; onClose: () => void; onSave: (e: FeishuEmbed) => void }) {
  const [data, setData] = useState<FeishuEmbed>(initial ?? {
    record_id: '', embed_key: '', url: '', title: '', section_key: sections[0]?.section_key || '', height: 500,
  });
  const upd = (patch: Partial<FeishuEmbed>) => setData({ ...data, ...patch });
  return (
    <Modal
      open
      title={initial ? '编辑嵌入' : '新增嵌入'}
      onClose={onClose}
      width="md"
      footer={
        <>
          <Button onClick={onClose}>取消</Button>
          <Button variant="glow" onClick={() => onSave(data)}>保存</Button>
        </>
      }
    >
      <div className="space-y-3">
        <Input label="KEY（唯一标识）" value={data.embed_key} onChange={(v) => upd({ embed_key: v })} required />
        <Input label="标题" value={data.title} onChange={(v) => upd({ title: v })} required />
        <Select
          label="所属板块"
          value={data.section_key}
          onChange={(v) => upd({ section_key: v })}
          options={sections.map((s) => ({ value: s.section_key, label: s.title_zh }))}
        />
        <Input label="飞书表格 URL" type="url" value={data.url} onChange={(v) => upd({ url: v })} placeholder="https://feishu.cn/base/xxxx" />
        <Input label="高度（px）" type="number" value={data.height ?? 500} onChange={(v) => upd({ height: Number(v) })} />
        <div className="text-[11px] text-ink-dim mono bg-c1/5 border border-c1/20 rounded-md p-3">
          💡 飞书多维表格 → 分享 → 复制 URL（需开启「允许嵌入到外部网页」）
        </div>
      </div>
    </Modal>
  );
}
