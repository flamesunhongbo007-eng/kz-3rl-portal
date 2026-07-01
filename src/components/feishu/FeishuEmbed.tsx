import { useEffect, useRef, useState } from 'react';

interface FeishuEmbedProps {
  url: string;
  title?: string;
  height?: number;
}

export function FeishuEmbed({ url, title = '飞书多维表格', height = 600 }: FeishuEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => { setLoaded(false); }, [url]);

  if (!url) {
    return (
      <div
        style={{ minHeight: height }}
        className="glass-soft flex flex-col items-center justify-center text-center p-8 border-dashed"
      >
        <div className="text-2xl text-ink-dim mb-2">▢</div>
        <div className="text-sm text-ink-muted mb-1">{title}</div>
        <div className="text-[11px] mono text-ink-dim">尚未配置飞书表格 URL</div>
        <div className="text-[10px] mono text-ink-dim mt-2">在 /admin/embeds 配置</div>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden" style={{ height }}>
      <div className="px-3 py-1.5 border-b border-border bg-bg-soft/50 flex items-center justify-between text-[10px] mono text-ink-dim">
        <span>▦ {title}</span>
        <a href={url} target="_blank" rel="noreferrer" className="text-c1 hover:underline">在新窗口打开 ↗</a>
      </div>
      <div className="relative" style={{ height: height - 28 }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-ink-dim text-xs">
            <div className="animate-pulse-soft">加载飞书表格…</div>
          </div>
        )}
        <iframe
          ref={ref}
          src={url}
          onLoad={() => setLoaded(true)}
          className="w-full h-full bg-bg"
          style={{ border: 'none' }}
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
