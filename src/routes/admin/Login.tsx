import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { adminAuth } from '@/lib/adminAuth';

export function LoginPage() {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  if (adminAuth.isLoggedIn()) return <Navigate to="/kz-secret-panel/sections" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const ok = await adminAuth.login(pwd);
    setLoading(false);
    if (ok) nav('/kz-secret-panel/sections');
    else setErr('密码错误');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: 'radial-gradient(ellipse at top, #0a1226 0%, #020617 60%)' }}>
      {/* 背景装饰：极光 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-c1/10 blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-c2/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-c3/5 blur-3xl" />
        {/* 网格 */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(71,85,105,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <form onSubmit={submit} className="relative w-full max-w-sm animate-slide-up">
        {/* 角落装饰 */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-c1/60 rounded-tl-lg" />
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-c1/60 rounded-tr-lg" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-c2/60 rounded-bl-lg" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-c2/60 rounded-br-lg" />

        <div className="gradient-border p-8 relative overflow-hidden">
          {/* 顶部装饰条 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-c1 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-c2 to-transparent" />

          <div className="text-center mb-7">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-c1/30 blur-2xl rounded-full" />
              <div className="relative w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-c1 via-c3 to-c2 flex items-center justify-center text-white text-2xl font-bold mono shadow-[0_0_30px_rgba(59,130,246,0.5)]">K</div>
            </div>
            <h1 className="text-lg font-bold text-ink tracking-wider">KZ-3RL</h1>
            <div className="text-[10px] mono text-ink-dim tracking-[0.3em] mt-1">ADMIN · CONTROL CENTER</div>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] mono text-ink-dim">
              <span className="w-1 h-1 rounded-full bg-running animate-pulse" />
              <span>AUTHENTICATION REQUIRED</span>
            </div>
          </div>

          <label className="block">
            <div className="flex items-center justify-between mb-2">
              <span className="block text-[10px] mono uppercase tracking-[0.2em] text-ink-dim">CREDENTIAL</span>
              <span className="text-[9px] mono text-c4">SECURE</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-c1 text-sm">⚿</span>
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 bg-bg-soft/80 border border-c1/30 rounded-md text-sm text-ink mono focus:border-c1 focus:bg-bg-soft focus:outline-none focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15),inset_0_0_8px_rgba(59,130,246,0.05)] transition-all"
                placeholder="ENTER PASSWORD"
              />
            </div>
          </label>

          {err && (
            <div className="mt-3 flex items-center gap-2 text-[11px] text-danger mono bg-danger/10 border border-danger/30 rounded-md px-3 py-2 animate-fade-in">
              <span>⚠</span><span>{err} · ACCESS DENIED</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full relative py-2.5 bg-gradient-to-r from-c1/30 to-c2/30 border border-c1/50 text-c1 hover:from-c1/40 hover:to-c2/40 rounded-md text-sm mono font-bold tracking-[0.2em] transition-all disabled:opacity-40 overflow-hidden group"
          >
            <span className="relative z-10">{loading ? '⟳ VERIFYING…' : '▸ LOGIN'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>

          <div className="mt-5 pt-4 border-t border-border/30 text-[10px] mono text-ink-dim text-center">
            DEFAULT: <span className="text-c1">admin123</span> · 修改 .env.local
          </div>
        </div>
      </form>
    </div>
  );
}
