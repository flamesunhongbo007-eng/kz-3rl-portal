import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function TopBar() {
  const loc = useLocation();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString('zh-CN', { hour12: false });

  // 公开站不显示 TopBar（hero 自己有 header）
  return null;
}

// 复刻 Tzafit II 的 header：3 logo + 中心标题 + Live 时钟
export function HeroHeader() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString('zh-CN', { hour12: false });
  return (
    <header className="fixed top-0 left-0 right-0 z-[900] flex items-center justify-between px-9 py-2.5 backdrop-blur-xl border-b border-teal/20" style={{ background: 'rgba(8,13,24,0.88)' }}>
      <div className="flex items-center gap-4">
        <img src="/logo-chec.png" alt="中国港湾" title="中国港湾工程有限责任公司" className="h-9 object-contain opacity-90 hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex-1 text-center px-4 min-w-0">
        <div className="text-[10px] tracking-[3.5px] uppercase text-teal font-bold opacity-80">总包施工单位</div>
        <div className="text-sm font-bold text-white tracking-wider truncate">阿亚古孜—巴赫特宽轨铁路 · 项目综合信息门户</div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="live-dot" />
        <span className="text-[11px] tracking-[1.5px] uppercase text-ink-mid font-semibold">实时门户</span>
        <span className="text-[11px] text-ink-dim pl-2.5 border-l border-teal/20 font-mono tabular-nums">KZ {time}</span>
      </div>
    </header>
  );
}
