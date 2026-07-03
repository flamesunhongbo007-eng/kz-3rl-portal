import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * 阿亚古孜—巴赫特宽轨铁路 · 总平面图（卫星底图）
 * - 卫星影像：Esri World Imagery（免费、无需 API key，全球高清）
 * - 参考层：Esri Reference（地名/边界/道路，叠加在卫星图上）
 * - 线路：teal 色 polyline，302.4 km 正线 + 4 个标段分界点
 * - 起终点：绿点（阿亚古孜 AK0）+ 橙点（巴赫特 AK302+436）
 */

// 铁路线路关键点（AK0 → AK302+436），4 段分界点用于按标段着色
// 坐标为公开地理位置的近似值（阿亚古孜、巴赫特边境村），后续接入真实 KML 可替换
const RAIL_POINTS: [number, number][] = [
  [47.9648, 80.4344], // AK0 · 阿亚古孜（既有赛梅–阿克托别铁路 22 号站）
  [47.7500, 80.7200], // AK40 途经点
  [47.6000, 80.9500], // AK80 · 一标段终点
  [47.4200, 81.2500], // AK130 途经点
  [47.1500, 81.5500], // AK170 · 二标段终点
  [46.9600, 81.8500], // AK205 途经点
  [46.8500, 82.1000], // AK241 · 三标段终点
  [46.7500, 82.4500], // AK275 途经点
  [46.6500, 82.6800], // AK302+436 · 巴赫特（中哈边境）
];

// 4 大标段颜色（保持站点 teal 主色，但 hue 略微区分）
const SEGMENT_COLORS = ['#00D7A0', '#00C295', '#00AE8A', '#009A7F'];

const STATIONS = [
  { name: '阿亚古孜', en: 'Ayagoz · AK0', pos: [47.9648, 80.4344] as [number, number], type: 'start' },
  { name: '巴赫特', en: 'Bakhty · AK302+436', pos: [46.6500, 82.6800] as [number, number], type: 'end' },
];

export function RailwayPlanMap({ height = 460 }: { height?: number }) {
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
      scrollWheelZoom: false, // 首页嵌入：默认不拦截页面滚动，双击/按钮才能缩放
      doubleClickZoom: true,
    });
    mapRef.current = map;

    // 卫星底图（Esri World Imagery · 免费公开）
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles © Esri · Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
        maxZoom: 18,
      },
    ).addTo(map);

    // 参考层：地名 / 边界 / 道路（暗色叠加，让地名看得清）
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18, opacity: 0.85 },
    ).addTo(map);

    // 按 4 大标段分别画线
    for (let i = 0; i < RAIL_POINTS.length - 1; i += 2) {
      const seg = RAIL_POINTS.slice(i, Math.min(i + 3, RAIL_POINTS.length));
      const segIdx = Math.floor(i / 2);
      // 外描边（黑色，增加对比）
      L.polyline(seg, { color: '#000', weight: 7, opacity: 0.55 }).addTo(map);
      // 主线（teal）
      L.polyline(seg, {
        color: SEGMENT_COLORS[segIdx] ?? SEGMENT_COLORS[0],
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
      }).addTo(map);
    }

    // 4 个标段分界点（小节点）
    const BOUNDARIES: { pos: [number, number]; label: string }[] = [
      { pos: [47.6000, 80.9500], label: 'AK80 · 一/二标段界' },
      { pos: [47.1500, 81.5500], label: 'AK170 · 二/三标段界' },
      { pos: [46.8500, 82.1000], label: 'AK241 · 三/四标段界' },
    ];
    BOUNDARIES.forEach((b) => {
      L.circleMarker(b.pos, {
        radius: 5,
        color: '#fff',
        weight: 2,
        fillColor: '#00D7A0',
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip(b.label, { direction: 'top', offset: [0, -6], className: 'rlp-tip' });
    });

    // 起终点大标
    STATIONS.forEach((s) => {
      const isStart = s.type === 'start';
      const color = isStart ? '#22c55e' : '#f97316';
      // 光晕外圈
      L.circleMarker(s.pos, {
        radius: 12,
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.15,
      }).addTo(map);
      // 主标
      L.circleMarker(s.pos, {
        radius: 6,
        color: '#fff',
        weight: 2,
        fillColor: color,
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip(
          `<div style="font-weight:800;font-size:11px;">${s.name}</div><div style="font-size:9px;opacity:0.75;letter-spacing:1px;">${s.en}</div>`,
          { direction: 'top', offset: [0, -8], permanent: true, className: 'rlp-tip rlp-tip-station' },
        );
    });

    // 自动 fit 到整条线
    const bounds = L.latLngBounds(RAIL_POINTS);
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="w-full satellite"
      style={{ height, background: '#0a1018' }}
    />
  );
}
