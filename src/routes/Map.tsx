import { PublicLayout } from '@/components/layout/PublicLayout';
import { KmlViewer } from '@/components/map/KmlViewer';

export function MapPage() {
  return (
    <PublicLayout>
      <header className="mb-10">
        <div className="text-[10px] mono tracking-[0.3em] text-c8 mb-2">SECTION / MAP</div>
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">线路图</h1>
        <p className="mt-2 text-sm text-ink-muted">线路走向 KML 地图（暗色主题 · 将 <code className="text-c1 mono">route.kml</code> 放入 <code className="text-c1 mono">public/</code> 后自动加载）</p>
      </header>
      <KmlViewer url="/route.kml" height={620} />
    </PublicLayout>
  );
}
