import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { KpiCard } from '@/components/ui/KpiCard';
import { Panel } from '@/components/ui/Panel';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { dataApi } from '@/lib/api';
import type { ContentItem } from '@/lib/types';
import { chartColors } from '@/styles/theme';

export function DocumentDashboardPage() {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    dataApi.list<ContentItem>('CONTENT', (a, b) => (b.date ?? 0) - (a.date ?? 0)).then(r =>
      setItems(r.filter(x => x.section_key === 'documents'))
    );
  }, []);

  // 文档分册（按专业）
  const volumes = [
    { name: '线路', count: 86, progress: 96, color: 'c1' },
    { name: '路基', count: 64, progress: 88, color: 'c3' },
    { name: '桥涵', count: 52, progress: 92, color: 'c4' },
    { name: '站场', count: 28, progress: 71, color: 'c6' },
    { name: '通信信号', count: 18, progress: 62, color: 'c7' },
    { name: '机务', count: 12, progress: 45, color: 'c2' },
  ];

  // 收发函件状态
  const corr = {
    labels: ['设计变更', '技术核定', '工程签证', '监理通知', '业主函件'],
    inbound: [12, 8, 23, 18, 6],
    outbound: [14, 11, 19, 12, 9],
  };

  // 文档来源
  const sources = {
    labels: ['设计院', '咨询单位', '设备厂家', '业主提供', '内部编制'],
    datasets: [{ data: [42, 18, 24, 8, 12], backgroundColor: [chartColors[0], chartColors[1], chartColors[2], chartColors[3], chartColors[4]] }],
  };

  return (
    <PublicLayout>
      <header className="mb-10 pt-6">
        <div className="text-[10px] mono tracking-[0.3em] text-teal mb-2">DASHBOARD · 02 · DOCUMENT CONTROL</div>
        <h1 className="text-2xl md:text-3xl font-black text-ink leading-tight whitespace-nowrap">文档管理中心</h1>
        <p className="mt-2 text-sm text-ink-dim">工程图纸、设计规范、技术核定、变更函件集中归档 · 完整可追溯</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="文档总数" value="754" unit="份" delta="本月 +38" trend="up" color="c1" />
        <KpiCard label="待审批" value="23" unit="份" delta="5 份超时" trend="down" color="c2" />
        <KpiCard label="已批准" value="681" unit="份" delta="通过率 90.3%" trend="up" color="running" />
        <KpiCard label="本月查询" value="2,184" unit="次" delta="日均 78" trend="up" color="c4" />
      </section>

      <Panel title="六大专业分册" subtitle="按专业分类的文档完成度" variant="glow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {volumes.map(v => (
            <div key={v.name} className="glass-soft p-4 hover:border-teal/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-ink">{v.name}分册</div>
                <span className="text-[10px] mono text-teal">{v.count} 份</span>
              </div>
              <div className="text-2xl font-bold mono text-ink mb-1">{v.progress}<span className="text-sm text-ink-dim">%</span></div>
              <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal to-c3" style={{ width: `${v.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartContainer
          title="本月收发函件"
          subtitle="按类型划分 · 入站 / 出站"
          type="bar"
          data={{
            labels: corr.labels,
            datasets: [
              { label: '入站', data: corr.inbound, backgroundColor: chartColors[0] },
              { label: '出站', data: corr.outbound, backgroundColor: chartColors[2] },
            ],
          }}
          height={280}
        />
        <ChartContainer
          title="文档来源构成"
          subtitle="按提供方划分"
          type="doughnut"
          data={sources}
          height={280}
        />
      </div>

      <div className="mt-8">
        <Panel title="最近文档" subtitle="按时倒序 · 后台可编辑" variant="glow">
          {items.length === 0 ? (
            <div className="text-center text-ink-dim text-xs py-8">暂无文档</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.slice(0, 8).map(it => (
                <div key={it.record_id} className="glass-soft p-4 hover:border-teal/40 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-md bg-c1/10 border border-c1/30 flex items-center justify-center text-c1 text-base shrink-0">▤</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-ink group-hover:text-teal transition-colors">{it.title}</div>
                      {it.body_md && <div className="text-[11px] text-ink-dim mt-0.5 line-clamp-1">{it.body_md}</div>}
                      <div className="flex items-center gap-1 mt-1.5">
                        {(it.tags ?? []).slice(0, 3).map(t => <span key={t} className="tag text-[9px]">{t}</span>)}
                      </div>
                    </div>
                    <div className="text-[10px] mono text-ink-dim shrink-0">
                      {it.date ? new Date(it.date).toLocaleDateString('zh-CN') : '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </PublicLayout>
  );
}
