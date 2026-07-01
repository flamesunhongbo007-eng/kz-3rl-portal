import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { adminAuth } from '@/lib/adminAuth';
import { dataApi } from '@/lib/api';
import { useEffect, useState } from 'react';

const items = [
  { to: '/kz-secret-panel/sections', label: '板块定义', icon: '◎', desc: 'Sections' },
  { to: '/kz-secret-panel/content', label: '板块内容', icon: '▣', desc: 'Content' },
  { to: '/kz-secret-panel/embeds', label: '飞书嵌入', icon: '▦', desc: 'Embeds' },
  { to: '/kz-secret-panel/members', label: '团队成员', icon: '◉', desc: 'Members' },
  { to: '/kz-secret-panel/milestones', label: '里程碑', icon: '◇', desc: 'Milestones' },
  { to: '/kz-secret-panel/risks', label: '风险登记', icon: '△', desc: 'Risks' },
  { to: '/kz-secret-panel/decisions', label: '决策日志', icon: '◈', desc: 'Decisions' },
];

export function AdminLayout() {
  const nav = useNavigate();
  const [mockMode, setMockMode] = useState(false);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    setMockMode(!import.meta.env.VITE_FEISHU_APP_ID);
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const logout = () => { adminAuth.logout(); nav('/kz-secret-panel'); };
  const reset = async () => {
    if (!confirm('确定要重置 mock 数据为初始状态？此操作不可撤销。')) return;
    await dataApi.resetMock();
    location.reload();
  };

  const time = now.toLocaleTimeString('zh-CN', { hour12: false });
  const date = now.toLocaleDateString('zh-CN');

  return (
    <div className="min-h-screen flex relative" style={{ background: 'linear-gradient(180deg, #020617 0%, #0a0f1f 100%)' }}>
      {/* 噪点纹理 */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")` }} />

      <aside className="w-60 border-r border-border/50 bg-bg/[0.6] backdrop-blur-xl p-4 flex flex-col relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-6 px-2 py-2 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-c1 via-c3 to-c2 flex items-center justify-center text-white text-lg font-bold mono shadow-[0_0_20px_rgba(59,130,246,0.4)]">K</div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-c1 to-c2 opacity-30 blur-md -z-10" />
          </div>
          <div>
            <div className="text-xs font-bold text-ink">KZ-3RL</div>
            <div className="text-[9px] mono text-ink-dim tracking-[0.2em]">ADMIN PANEL</div>
          </div>
        </Link>

        {/* 状态条 */}
        <div className="mb-4 px-2.5 py-2 rounded-md bg-bg-soft/40 border border-border/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] mono text-ink-dim tracking-wider">SYSTEM</span>
            <span className={`w-1.5 h-1.5 rounded-full ${mockMode ? 'bg-c4 animate-pulse' : 'bg-running'}`} />
          </div>
          <div className="text-[11px] mono font-semibold" style={{ color: mockMode ? '#eab308' : '#22c55e' }}>
            {mockMode ? 'MOCK MODE' : 'FEISHU LIVE'}
          </div>
        </div>

        {/* 导航 */}
        <nav className="flex-1 space-y-0.5">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-all duration-200 group ${
                  isActive
                    ? 'bg-c1/10 text-c1 border-l-2 border-c1 pl-2.5 shadow-[inset_1px_0_8px_rgba(59,130,246,0.2)]'
                    : 'text-ink-muted hover:bg-bg-soft/40 hover:text-ink border-l-2 border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`text-base transition-transform ${isActive ? 'scale-110 text-c1' : 'text-ink-dim group-hover:text-ink'}`}>{it.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{it.label}</div>
                    <div className="text-[8px] mono text-ink-dim tracking-wider opacity-60">{it.desc}</div>
                  </div>
                  {isActive && <span className="w-1 h-1 rounded-full bg-c1 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* 底部操作 */}
        <div className="border-t border-border/40 pt-3 mt-3 space-y-1">
          {mockMode && (
            <button onClick={reset} className="w-full text-left text-[11px] mono text-c4/80 hover:text-c4 hover:bg-c4/10 px-2.5 py-1.5 rounded transition-colors">↺ 重置 mock 数据</button>
          )}
          <button onClick={logout} className="w-full text-left text-[11px] mono text-danger/70 hover:text-danger hover:bg-danger/10 px-2.5 py-1.5 rounded transition-colors">⏻ 退出登录</button>
          <Link to="/kz-secret-panel" className="block text-[11px] mono text-ink-dim hover:text-c1 px-2.5 py-1.5 transition-colors">▦ 后台首页</Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10">
        {/* 顶部命令栏 */}
        <header className="sticky top-0 z-20 h-12 border-b border-border/50 bg-bg/40 backdrop-blur-xl flex items-center justify-between px-8">
          <div className="flex items-center gap-4 text-[10px] mono text-ink-dim">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-running animate-pulse" />
              <span>ONLINE</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div>v0.1.0 · PORTAL</div>
            <div className="w-px h-3 bg-border" />
            <div className="text-ink-muted">{date}</div>
          </div>
          <div className="flex items-center gap-4 text-[10px] mono text-ink-dim">
            <div className="text-c1 font-bold tabular-nums">{time}</div>
            <div className="w-px h-3 bg-border" />
            <div className="text-ink-muted">UTC+8</div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-3 rounded-sm border border-border/60 relative">
                <div className="absolute inset-0.5 bg-c1 rounded-[1px]" style={{ width: '78%' }} />
              </div>
              <span>78%</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
