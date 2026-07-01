import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { dataApi } from '@/lib/api';
import type { Section, ContentItem, FeishuEmbed as Embed } from '@/lib/types';
import { FeishuEmbed } from '@/components/feishu/FeishuEmbed';
import { Panel } from '@/components/ui/Panel';
import { SectionCard } from '@/components/ui/SectionCard';
import { statusColor } from '@/styles/theme';

export function SectionPage() {
  const { key } = useParams<{ key: string }>();
  const [section, setSection] = useState<Section | null>(null);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [allSections, setAllSections] = useState<Section[]>([]);

  useEffect(() => {
    Promise.all([
      dataApi.list<Section>('SECTIONS'),
      dataApi.list<ContentItem>('CONTENT'),
      dataApi.list<Embed>('EMBEDS'),
    ]).then(([secs, cts, ems]) => {
      setAllSections(secs);
      const sec = secs.find((s) => s.section_key === key);
      setSection(sec ?? null);
      setItems(cts.filter((c) => c.section_key === key).sort((a, b) => (b.date ?? 0) - (a.date ?? 0)));
      setEmbeds(ems.filter((e) => e.section_key === key));
    });
  }, [key]);

  if (!section) {
    return (
      <PublicLayout>
        <div className="text-center py-20">
          <div className="text-2xl text-ink-dim mb-2">◌</div>
          <div className="text-sm text-ink-muted">板块不存在或未启用</div>
          <Link to="/" className="text-xs text-c1 hover:underline mt-3 inline-block">← 返回首页</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mb-10 relative">
        <div className="text-[10px] mono tracking-[0.3em] text-ink-dim mb-2">
          <Link to="/" className="hover:text-c1">PORTAL</Link> / <span className="text-c1">{section.section_key.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-5xl text-c1 mono">{section.icon}</div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">{section.title_zh}</h1>
            {section.title_ru && <div className="text-sm text-ink-dim mono mt-1">{section.title_ru}</div>}
          </div>
        </div>
        {section.description && <p className="mt-4 text-sm text-ink-muted max-w-3xl">{section.description}</p>}
        {/* 装饰条 */}
        <div className="mt-6 h-px bg-gradient-to-r from-c1 via-c2 to-c3 opacity-50" />
      </div>

      {embeds.length > 0 && (
        <section className="mb-8 space-y-4">
          {embeds.map((e) => (
            <FeishuEmbed key={e.record_id} url={e.url} title={e.title} height={e.height || 500} />
          ))}
        </section>
      )}

      {items.length > 0 ? (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <SectionCard key={it.record_id} title={it.title} subtitle={it.status}>
                {it.body_md && <p className="text-xs">{it.body_md}</p>}
                <div className="flex flex-wrap gap-1 mt-3">
                  {(it.tags ?? []).map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <div className="text-[10px] mono text-ink-dim mt-3">
                  {it.date ? new Date(it.date).toLocaleDateString('zh-CN') : '—'}
                </div>
              </SectionCard>
            ))}
          </div>
        </section>
      ) : (
        <Panel>
          <div className="text-center py-12 text-ink-dim text-xs">
            本板块暂无条目。<br/>去 <Link to="/kz-secret-panel/content" className="text-c1 hover:underline">/kz-secret-panel/content</Link> 添加
          </div>
        </Panel>
      )}

      <section className="mt-12">
        <div className="text-[10px] mono uppercase tracking-[0.2em] text-ink-dim mb-3">导航</div>
        <div className="flex flex-wrap gap-2">
          {allSections.filter((s) => s.visible).map((s) => (
            <Link
              key={s.section_key}
              to={`/section/${s.section_key}`}
              className={`text-[11px] mono px-2.5 py-1.5 rounded-md border transition-all ${
                s.section_key === key
                  ? 'border-c1 text-c1 bg-c1/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : 'border-border text-ink-muted hover:border-c1/40 hover:text-ink'
              }`}
            >
              {s.icon} {s.title_zh}
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
