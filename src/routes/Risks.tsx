import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { dataApi } from '@/lib/api';
import type { Risk } from '@/lib/types';
import { Panel } from '@/components/ui/Panel';
import { severityColor } from '@/styles/theme';

// 记忆点：2x2 矩阵散点 + 4 个统计
export function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  useEffect(() => { dataApi.list<Risk>('RISKS').then(setRisks); }, []);

  const sevOrder = { '严重': 4, '高': 3, '中': 2, '低': 1 } as const;
  const sorted = [...risks].sort((a, b) => sevOrder[b.severity] - sevOrder[a.severity]);

  // 矩阵数据
  const matrix: Record<string, Record<string, Risk[]>> = {
    低: { 低: [], 中: [], 高: [] }, 中: { 低: [], 中: [], 高: [] },
    高: { 低: [], 中: [], 高: [] }, 严重: { 低: [], 中: [], 高: [] },
  };
  risks.forEach(r => { if (matrix[r.severity]?.[r.probability]) matrix[r.severity][r.probability].push(r); });
  const max = Math.max(1, ...Object.values(matrix).flatMap(s => Object.values(s)).map(arr => arr.length));

  return (
    <PublicLayout>
      <header className="mb-10">
        <div className="text-[10px] mono tracking-[0.3em] text-c2 mb-2">SECTION / RISKS</div>
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">风险登记</h1>
        <p className="mt-2 text-sm text-ink-muted">风险矩阵与应对措施 · 鼠标悬停查看详情</p>
      </header>

      {/* 4 个统计卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {(['严重', '高', '中', '低'] as const).map((s) => {
          const count = risks.filter((r) => r.severity === s).length;
          return (
            <div key={s} className="glass-soft p-5 relative overflow-hidden" style={{ borderColor: severityColor(s) + '40' }}>
              <div className="text-[10px] mono uppercase tracking-[0.2em] text-ink-dim mb-2">{s}风险</div>
              <div className="text-4xl font-black mono tabular-nums" style={{ color: severityColor(s) }}>{count}</div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10" style={{ background: severityColor(s) }} />
            </div>
          );
        })}
      </div>

      {/* 风险矩阵 */}
      <Panel title="风险矩阵" subtitle="严重度 × 概率" variant="glow">
        <div className="grid grid-cols-[100px_1fr_1fr_1fr] gap-1.5 text-[10px] mono">
          <div></div>
          {['低', '中', '高'].map(p => (
            <div key={p} className="text-center text-ink-dim tracking-wider py-2">概率 · {p}</div>
          ))}
          {(['严重', '高', '中', '低'] as const).map(s => (
            <>
              <div key={`label-${s}`} className="flex items-center justify-end pr-3 font-bold" style={{ color: severityColor(s) }}>严重 · {s}</div>
              {(['低', '中', '高'] as const).map(p => {
                const arr = matrix[s]?.[p] || [];
                const intensity = arr.length / max;
                return (
                  <div
                    key={`${s}-${p}`}
                    className="relative h-28 rounded-md border border-border/40 flex flex-col items-center justify-center gap-1 transition-all hover:border-c1/40 hover:scale-[1.02] cursor-pointer group"
                    style={{
                      background: `radial-gradient(ellipse at center, ${severityColor(s)}${Math.round(intensity * 80).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
                    }}
                  >
                    <div className="text-3xl font-black mono tabular-nums" style={{ color: severityColor(s) }}>{arr.length}</div>
                    {arr.length > 0 && (
                      <div className="text-[9px] text-ink-dim opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center line-clamp-2">
                        {arr.slice(0, 2).map(r => r.title).join(' · ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </Panel>

      {/* 风险列表 */}
      <Panel title="风险列表" subtitle="按严重度排序" className="mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] mono uppercase tracking-wider text-ink-dim border-b border-border">
              <th className="px-3 py-2">风险</th>
              <th className="px-3 py-2 w-24">严重度</th>
              <th className="px-3 py-2 w-20">概率</th>
              <th className="px-3 py-2">应对</th>
              <th className="px-3 py-2 w-24">状态</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-ink-dim py-8 text-xs">暂无风险</td></tr>
            ) : sorted.map((r) => (
              <tr key={r.record_id} className="border-b border-border/30 hover:bg-bg-soft/30 transition-colors">
                <td className="px-3 py-2.5">
                  <div className="text-ink">{r.title}</div>
                  {r.owner && <div className="text-[10px] mono text-ink-dim mt-0.5">负责人: {r.owner}</div>}
                </td>
                <td className="px-3 py-2.5">
                  <span className="tag" style={{ color: severityColor(r.severity), background: severityColor(r.severity) + '22', borderColor: severityColor(r.severity) + '40' }}>{r.severity}</span>
                </td>
                <td className="px-3 py-2.5 text-ink-muted">{r.probability}</td>
                <td className="px-3 py-2.5 text-ink-muted text-xs">{r.mitigation || '—'}</td>
                <td className="px-3 py-2.5 text-ink-muted">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </PublicLayout>
  );
}
