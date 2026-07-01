import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface KmlViewerProps {
  url: string; // public 下的路径或远程 URL
  height?: number;
}

export function KmlViewer({ url, height = 500 }: KmlViewerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(ref.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([48.0, 66.0], 5);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    // 直接用 omnivore 解析 KML（如果文件存在）
    fetch(url)
      .then((r) => (r.ok ? r.text() : null))
      .then((text) => {
        if (!text) return;
        // 简易 KML 解析：提取所有 <coordinates>
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const coords = Array.from(xml.getElementsByTagName('coordinates')).map((e) => e.textContent || '');
        const allLatLngs: [number, number][] = [];
        coords.forEach((line) => {
          line.trim().split(/\s+/).forEach((pt) => {
            const [lng, lat] = pt.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) allLatLngs.push([lat, lng]);
          });
        });
        if (allLatLngs.length === 0) return;
        const polyline = L.polyline(allLatLngs, { color: '#3b82f6', weight: 3, opacity: 0.85 }).addTo(map);
        map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
        // 起点终点
        L.circleMarker(allLatLngs[0], { radius: 6, color: '#22c55e', fillColor: '#22c55e', fillOpacity: 1 }).addTo(map).bindPopup('起点');
        L.circleMarker(allLatLngs[allLatLngs.length - 1], { radius: 6, color: '#f97316', fillColor: '#f97316', fillOpacity: 1 }).addTo(map).bindPopup('终点');
      })
      .catch(() => { /* KML 加载失败，保持空地图 */ });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [url]);

  return (
    <div className="glass overflow-hidden" style={{ height }}>
      <div className="px-3 py-1.5 border-b border-border bg-bg-soft/50 text-[10px] mono text-ink-dim">
        ◐ 线路图（KML）
      </div>
      <div ref={ref} style={{ height: height - 28 }} className="w-full" />
    </div>
  );
}
