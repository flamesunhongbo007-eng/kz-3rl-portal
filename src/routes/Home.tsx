import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { dataApi } from '@/lib/api';
import type { Section, ContentItem, Milestone, Risk } from '@/lib/types';
import { isMockMode } from '@/lib/config';

export function HomePage() {
  const mock = isMockMode();
  const [sections, setSections] = useState<Section[]>([]);
  const [tasks, setTasks] = useState<ContentItem[]>([]);
  const [ms, setMs] = useState<Milestone[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);

  useEffect(() => {
    Promise.all([
      dataApi.list<Section>('SECTIONS', (a, b) => a.order - b.order),
      dataApi.list<ContentItem>('CONTENT', (a, b) => (b.date ?? 0) - (a.date ?? 0)),
      dataApi.list<Milestone>('MILESTONES', (a, b) => a.planned_date - b.planned_date),
      dataApi.list<Risk>('RISKS'),
    ]).then(([s, t, m, r]) => {
      setSections(s.filter((x) => x.visible));
      setTasks(t.filter((x) => x.section_key === 'tasks').slice(0, 5));
      setMs(m);
      setRisks(r);
    });
  }, []);

  const totalMs = ms.length;
  const doneMs = ms.filter((m) => m.status === '已完成').length;
  const openRisks = risks.filter((r) => r.status === '开放' || r.status === '处理中').length;
  const highRisks = risks.filter((r) => r.severity === '高' || r.severity === '严重').length;

  // 粒子
  const particles = Array.from({ length: 50 }, (_, i) => ({
    left: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    duration: 12 + Math.random() * 18,
    delay: Math.random() * 25,
  }));

  // 5 dashboard 卡片（铁路版 · 按 Tzafit II 结构）
  const dashboards = [
    { num: '01', title: '建设进度', desc: '全线 302.4 km 施工现场实时概览 · 4 个土建标段进度跟踪与日报管理', tags: ['路基', '桥涵', '站场', '4 标段'], icon: 'M2 20h20M4 20V10l8-7 8 7v10M10 20v-5h4v5', href: '/dashboard/construction' },
    { num: '02', title: '文档管理', desc: '工程图纸、设计规范、技术核定、变更函件集中归档与版本控制', tags: ['图纸', '规范', '变更', '审批'], icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6', href: '/dashboard/document' },
    { num: '03', title: '物资采购', desc: '钢轨、道砟、混凝土、机械设备采购订单与到场跟踪', tags: ['钢轨', '道砟', '设备', '到场'], icon: 'M3 3h18l-2 13H5L3 3zM7 16v4h10v-4', href: '/dashboard/procurement' },
    { num: '04', title: '总包协调', desc: '与业主方、分包商、监理单位的工作联系单与协调事项管理', tags: ['业主', '分包', '监理', '会议'], icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', href: '/dashboard/transmittals' },
    { num: '05', title: '合同里程碑', desc: '全线合同节点 · 付款计划与现金流 · 今日位置', tags: ['付款', '节点', '现金流', 'EPC'], icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', href: '/dashboard/milestone' },
  ];

  return (
    <PublicLayout fullBleed>
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-16">
        {/* 背景层 */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(0,215,160,0.14) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 85% 50%, rgba(0,100,220,0.10) 0%, transparent 55%), radial-gradient(ellipse 35% 35% at 15% 75%, rgba(0,155,119,0.07) 0%, transparent 50%), linear-gradient(175deg, #0A101E 0%, #070C16 55%, #080D18 100%)' }}
        />
        {/* 网格 */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,215,160,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,215,160,0.025) 1px, transparent 1px)', backgroundSize: '55px 55px', maskImage: 'radial-gradient(ellipse 85% 85% at 50% 40%, black 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 40%, black 30%, transparent 80%)' }} />
        {/* 扫描线 */}
        <div className="scan-line" />

        {/* 外环：旋转铁路轨道（钢轨+枕木）*/}
        <svg className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-[680px] h-[680px] opacity-[0.07] spin-slow" viewBox="0 0 680 680" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="340" cy="340" r="335" stroke="#00D7A0" strokeWidth="0.6" />
          <circle cx="340" cy="340" r="280" stroke="#00D7A0" strokeWidth="0.4" />
          <circle cx="340" cy="340" r="220" stroke="#00D7A0" strokeWidth="0.4" />
          <circle cx="340" cy="340" r="160" stroke="#00D7A0" strokeWidth="0.4" />
          <circle cx="340" cy="340" r="95" stroke="#00D7A0" strokeWidth="0.8" />
          <circle cx="340" cy="340" r="28" stroke="#00D7A0" strokeWidth="2" fill="rgba(0,215,160,0.12)" />
          {/* 钢轨线（12 条径向）*/}
          <g stroke="#00D7A0" strokeWidth="0.7">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              const x1 = 340 + 5 * Math.cos(a), y1 = 340 + 5 * Math.sin(a);
              const x2 = 340 + 335 * Math.cos(a), y2 = 340 + 335 * Math.sin(a);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
          {/* 枕木标记（短横线，模拟铁路）*/}
          <g stroke="#00D7A0" strokeWidth="2">
            {Array.from({ length: 36 }).map((_, i) => {
              const a = (i * 10 * Math.PI) / 180;
              const r1 = 80, r2 = 200, r3 = 260;
              return (
                <g key={i}>
                  <line x1={340 + r1 * Math.cos(a) - 4} y1={340 + r1 * Math.sin(a)} x2={340 + r1 * Math.cos(a) + 4} y2={340 + r1 * Math.sin(a)} transform={`rotate(${i * 10} 340 340)`} />
                  <line x1={340 + r2 * Math.cos(a) - 4} y1={340 + r2 * Math.sin(a)} x2={340 + r2 * Math.cos(a) + 4} y2={340 + r2 * Math.sin(a)} transform={`rotate(${i * 10} 340 340)`} />
                  <line x1={340 + r3 * Math.cos(a) - 4} y1={340 + r3 * Math.sin(a)} x2={340 + r3 * Math.cos(a) + 4} y2={340 + r3 * Math.sin(a)} transform={`rotate(${i * 10} 340 340)`} />
                </g>
              );
            })}
          </g>
        </svg>

        {/* 内环：反向旋转 */}
        <svg className="absolute right-[155px] top-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-10 spin-rev" viewBox="0 0 300 300" fill="none">
          <circle cx="150" cy="150" r="145" stroke="#00D7A0" strokeWidth="1" />
          <circle cx="150" cy="150" r="100" stroke="#00D7A0" strokeWidth="0.6" />
          <circle cx="150" cy="150" r="55" stroke="#00D7A0" strokeWidth="1.2" fill="rgba(0,215,160,0.05)" />
          <g stroke="#00D7A0" strokeWidth="1">
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * 45 * Math.PI) / 180;
              return <line key={i} x1={150 + 5 * Math.cos(a)} y1={150 + 5 * Math.sin(a)} x2={150 + 145 * Math.cos(a)} y2={150 + 145 * Math.sin(a)} />;
            })}
          </g>
        </svg>

        {/* 粒子 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* 角标 */}
        <div className="absolute top-24 right-10 hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-lg text-[10px] font-extrabold tracking-[2px] uppercase z-10" style={{ background: 'rgba(0,215,160,0.06)', border: '1px solid rgba(0,215,160,0.18)', color: '#00D7A0' }}>
          <span className="text-base">⚡</span> 1520 mm 宽轨 · 非电气化
        </div>

        {/* Hero 内容 */}
        <div className="relative z-10 text-center px-10 pb-16 max-w-[960px] w-full">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 border border-teal rounded-full text-[10px] font-extrabold tracking-[3.5px] uppercase text-teal mb-7 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
            项目综合信息门户
            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
          </div>

          <h1 className="text-[clamp(44px,7vw,74px)] font-extrabold leading-[1.02] tracking-[-2px] mb-5 animate-fade-up [animation-delay:0.15s]">
            阿亚古孜—巴赫特<br />
            宽轨铁路
          </h1>

          <p className="text-lg text-ink-mid leading-relaxed mb-2.5 animate-fade-up [animation-delay:0.25s]">
            正线全长 302.4 公里 · 阿拜州 · 哈中过境通道
          </p>

          <div className="inline-block text-xs font-bold tracking-[2.5px] uppercase text-teal opacity-75 mb-[52px] animate-fade-up [animation-delay:0.35s]">
            1520 mm 宽轨 · 非电气化 · 哈萨克斯坦国家标准
          </div>

          {mock && (
            <div className="text-center mb-4 animate-fade-up [animation-delay:0.4s]">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono text-c4 border border-c4/30 bg-c4/10 rounded-md px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-c4 animate-pulse" />
                MOCK 模式 · 填写 .env.local 切换至飞书真实数据
              </div>
            </div>
          )}

          {/* 6 项 ibar */}
          <div className="flex rounded-[14px] overflow-hidden border border-teal/20 backdrop-blur-md animate-fade-up [animation-delay:0.45s]" style={{ background: 'rgba(0,215,160,0.05)' }}>
            {[
              { lbl: '业主', val: '哈萨克斯坦铁路公司' },
              { lbl: '正线长度', val: '302.4 km' },
              { lbl: '轨距', val: '1520 mm 宽轨' },
              { lbl: '电气化', val: '非电气化' },
              { lbl: '站场', val: '14 座' },
              { lbl: '土建标段', val: '4 个' },
            ].map((it, i, arr) => (
              <div key={it.lbl} className={`flex-1 py-[18px] px-5 text-center ${i < arr.length - 1 ? 'border-r border-teal/20' : ''}`}>
                <div className="text-[9.5px] font-extrabold tracking-[2.5px] uppercase text-teal opacity-75 mb-1.5">{it.lbl}</div>
                <div className="text-sm font-bold">{it.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 滚动提示 */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-ink-dim text-[10px] tracking-[2.5px] uppercase z-10 animate-fade-up [animation-delay:1.2s]">
          <span>向下浏览</span>
          <div className="w-px h-9 bg-gradient-to-b from-teal to-transparent animate-pulse-soft" />
        </div>
      </section>

      {/* ============ STATS STRIP ============ */}
      <section className="border-y border-teal/20" style={{ background: 'rgba(0,215,160,0.03)' }}>
        <div className="max-w-[1380px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {[
            { val: '302.4', lbl: '正线全长（公里）' },
            { val: `${totalMs ? Math.round((doneMs / totalMs) * 100) : 0}%`, lbl: '总体进度' },
            { val: '4', lbl: '土建标段' },
            { val: '14', lbl: '新建/改造站场' },
            { val: 'EPC', lbl: '合同模式' },
            { val: '2026', lbl: '执行年度' },
          ].map((s, i, arr) => (
            <div key={s.lbl} className={`py-7 px-5 text-center transition-colors hover:bg-teal-dim ${i < arr.length - 1 ? 'border-r border-teal/20' : ''}`}>
              <div className="text-[28px] font-extrabold text-teal leading-none mb-1.5 tracking-[-1px] animate-fade-up">{s.val}</div>
              <div className="text-[10px] font-bold tracking-[2px] uppercase text-ink-dim">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ TECHNOLOGY：铁路 5 段式解剖图 ============ */}
      <section>
        <div className="max-w-[1380px] mx-auto px-10 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 文字 */}
          <div>
            <div className="text-[10px] font-extrabold tracking-[3px] uppercase text-teal mb-3.5">Railway Infrastructure Technology · 铁路基础设施技术</div>
            <h2 className="text-[36px] font-extrabold leading-[1.15] mb-5 tracking-[-0.5px]">
              1520 mm <em className="not-italic text-teal">宽轨 · 非电气化</em>体系
            </h2>
            <p className="text-[15px] text-ink-mid leading-[1.75] mb-5">
              阿亚古孜—巴赫特宽轨铁路采用 1520 mm 宽轨标准（与俄罗斯、白俄罗斯、中亚五国铁路网完全兼容），按照哈萨克斯坦国家标准设计，本线为<strong className="text-white">非电气化铁路</strong>，设计年通过能力 1,500 万吨。
            </p>
            <p className="text-[15px] text-ink-mid leading-[1.75] mb-5">
              项目正线长度 302.436 km · 支线 4.076 km · 站线 130.748 km，分为 <strong className="text-white">AK0-AK80 / AK80-AK170 / AK170-AK241 / AK241-AK302+436 共 4 个土建标段</strong>，起于既有赛梅-阿克托别铁路 22 号站，向东延伸至中国新疆塔城巴克图口岸。
            </p>
            <div className="grid grid-cols-2 gap-3 mt-7">
              {[
                { lbl: '轨距', val: '1,520 mm' },
                { lbl: '电气化', val: '非电气化' },
                { lbl: '正线', val: '302.4 km' },
                { lbl: '支线', val: '4.1 km' },
                { lbl: '站线', val: '130.7 km' },
                { lbl: '年通过能力', val: '1,500 万吨' },
              ].map((it) => (
                <div key={it.lbl} className="py-3.5 px-4 rounded-[10px] border border-teal/20 transition-all hover:border-teal hover:bg-teal-dim" style={{ background: 'rgba(255,255,255,0.025)' }}>
                  <div className="text-[10px] text-teal tracking-[1.5px] uppercase font-bold mb-1">{it.lbl}</div>
                  <div className="text-[13px] font-semibold">{it.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 段式铁路解剖图 */}
          <div className="relative rounded-[18px] overflow-hidden border border-teal/20 min-h-[420px] flex flex-col" style={{ background: 'linear-gradient(135deg, #0e1a28, #0a1018)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,215,160,0.08), transparent 70%)' }} />

            {/* 顶部：标签 + 5 个圆点 */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3">
              <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-teal">铁路纵断面图 · AK0 — AK302+436</span>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-2 h-2 rounded-full border border-teal/30 cursor-pointer transition-colors ${i === 0 ? 'bg-teal' : 'bg-teal/10'}`} />
                ))}
              </div>
            </div>

            <svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full" style={{ display: 'block' }}>
              <defs>
                <linearGradient id="earthwork" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a3a5c" /><stop offset="100%" stopColor="#0d2a45" /></linearGradient>
                <linearGradient id="bridge" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#003d30" /><stop offset="100%" stopColor="#005a44" /></linearGradient>
                <linearGradient id="tunnel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1a2e" /><stop offset="100%" stopColor="#0d0d20" /></linearGradient>
                <linearGradient id="track" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#005a44" /><stop offset="100%" stopColor="#003d30" /></linearGradient>
                <linearGradient id="elec" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a1800" /><stop offset="100%" stopColor="#7a2800" /></linearGradient>
              </defs>

              {/* 标题 */}
              <text x="360" y="22" textAnchor="middle" fill="#00D7A0" fontSize="11" fontWeight="700" letterSpacing="1">阿亚古孜—巴赫特 · 铁路纵断面剖视图</text>
              <text x="360" y="38" textAnchor="middle" fill="#667788" fontSize="8">302.4 km 正线 · 1520 mm 宽轨 · 阿拜州 · 非电气化</text>

              {/* 5 段：路基 / 桥涵 / 站场 / 轨道 / 道口（去掉了电气化）*/}
              <rect x="30" y="60" width="150" height="100" fill="url(#earthwork)" />
              <text x="105" y="190" textAnchor="middle" fill="#4a9aca" fontSize="9" fontWeight="700">路基工程</text>
              <text x="105" y="204" textAnchor="middle" fill="#336688" fontSize="7">EARTHWORK</text>
              <text x="105" y="216" textAnchor="middle" fill="#336688" fontSize="7">~ 1,800 万方</text>

              <rect x="180" y="60" width="120" height="100" fill="url(#bridge)" />
              <rect x="195" y="100" width="12" height="60" fill="#007755" />
              <rect x="232" y="100" width="12" height="60" fill="#007755" />
              <rect x="269" y="100" width="12" height="60" fill="#007755" />
              <rect x="180" y="78" width="120" height="12" fill="#00D7A0" opacity="0.5" />
              <text x="240" y="190" textAnchor="middle" fill="#00a080" fontSize="9" fontWeight="700">桥涵工程</text>
              <text x="240" y="204" textAnchor="middle" fill="#005540" fontSize="7">BRIDGES &amp; CULVERTS</text>
              <text x="240" y="216" textAnchor="middle" fill="#005540" fontSize="7">约 280 处</text>

              <rect x="300" y="60" width="80" height="100" fill="url(#tunnel)" />
              <text x="340" y="190" textAnchor="middle" fill="#778899" fontSize="9" fontWeight="700">站场工程</text>
              <text x="340" y="204" textAnchor="middle" fill="#556677" fontSize="7">STATIONS</text>
              <text x="340" y="216" textAnchor="middle" fill="#556677" fontSize="7">14 座 · 130.7 km</text>

              <rect x="380" y="60" width="220" height="100" fill="url(#track)" />
              <rect x="400" y="100" width="180" height="6" fill="#00D7A0" />
              <rect x="400" y="115" width="180" height="6" fill="#00D7A0" />
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
                <rect key={i} x={400 + i * 13} y="96" width="8" height="28" fill="#1a1a1a" stroke="#444" />
              ))}
              <ellipse cx="490" cy="135" rx="90" ry="8" fill="#3a3a3a" opacity="0.5" />
              <text x="490" y="190" textAnchor="middle" fill="#00D7A0" fontSize="9" fontWeight="700">轨道工程</text>
              <text x="490" y="204" textAnchor="middle" fill="#009980" fontSize="7">TRACK</text>
              <text x="490" y="216" textAnchor="middle" fill="#009980" fontSize="7">302.4 km 正线</text>

              <rect x="600" y="60" width="90" height="100" fill="url(#elec)" />
              <text x="645" y="110" textAnchor="middle" fill="#ff8844" fontSize="9" fontWeight="700">非电气化</text>
              <text x="645" y="124" textAnchor="middle" fill="#884422" fontSize="7">NON-ELECTRIFIED</text>
              <text x="645" y="138" textAnchor="middle" fill="#884422" fontSize="7">内燃机车牵引</text>
              <text x="645" y="190" textAnchor="middle" fill="#ff8844" fontSize="9" fontWeight="700">机务设施</text>
              <text x="645" y="204" textAnchor="middle" fill="#884422" fontSize="7">LOCOMOTIVE</text>
              <text x="645" y="216" textAnchor="middle" fill="#884422" fontSize="7">整备场 · 加油点</text>

              <line x1="30" y1="160" x2="690" y2="160" stroke="#00D7A0" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.3" />
              <path d="M 690,160 L 700,160" stroke="#00D7A0" strokeWidth="2" />
              <text x="710" y="164" fill="#00D7A0" fontSize="10" fontWeight="700">→</text>
            </svg>

            {/* 底部信息 */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-md text-[10px] font-bold tracking-[1.5px] uppercase z-20" style={{ background: 'rgba(8,13,24,0.85)', border: '1px solid rgba(0,215,160,0.18)', color: '#00D7A0', backdropFilter: 'blur(8px)' }}>
              五段基础设施工程
            </div>
          </div>
        </div>
      </section>

      {/* ============ DASHBOARDS：5 卡片 ============ */}
      <section className="border-t border-teal/20">
        <div className="max-w-[1380px] mx-auto px-10 py-24">
          <div className="text-center mb-12">
            <div className="text-[10px] font-extrabold tracking-[3px] uppercase text-teal mb-2.5">项目核心模块</div>
            <h2 className="text-3xl font-extrabold tracking-[-0.5px]">五大业务模块</h2>
            <p className="text-sm text-ink-dim mt-3">总包项目管理全流程覆盖 · 点击进入各模块独立仪表盘</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dashboards.map((d) => (
              <a key={d.num} href={d.href} className="group relative block">
                <div className="relative rounded-[14px] p-6 transition-all duration-300 group-hover:-translate-y-1 overflow-hidden" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(0,215,160,0.18)' }}>
                  {/* 角部光晕 */}
                  <div className="absolute -top-20 -right-20 w-[220px] h-[220px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,215,160,0.25), transparent 65%)' }} />
                  {/* 顶部装饰线 */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3.5 transition-all" style={{ background: 'rgba(0,215,160,0.09)', border: '1px solid rgba(0,215,160,0.25)' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00D7A0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d={d.icon} />
                    </svg>
                  </div>
                  <div className="text-[10px] font-extrabold tracking-[3px] uppercase text-teal opacity-55 mb-2">模块 {d.num}</div>
                  <h3 className="text-base font-extrabold mb-2 tracking-[-0.2px] group-hover:text-teal transition-colors">{d.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-3.5">
                    {d.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <p className="text-xs text-ink-mid leading-relaxed mb-4">{d.desc}</p>
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[1.5px] uppercase text-teal">
                    进入模块
                    <span className="inline-flex transition-transform group-hover:translate-x-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* 全部板块导航（11 板块的快速入口）*/}
          {sections.length > 0 && (
            <div className="mt-12 pt-8 border-t border-teal/20">
              <div className="text-[10px] font-extrabold tracking-[3px] uppercase text-teal mb-4 text-center">// 全部板块 · 共 {sections.length} 项</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {sections.map((s) => (
                  <a key={s.section_key} href={`/section/${s.section_key}`} className="text-[11px] font-mono px-3 py-1.5 rounded-md border transition-colors" style={{ borderColor: 'rgba(0,215,160,0.18)', color: '#6A8CAA' }}>
                    {s.icon} {s.title_zh}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ PARTNERS ============ */}
      <section className="border-t border-teal/20" style={{ background: 'rgba(0,215,160,0.02)' }}>
        <div className="max-w-[1380px] mx-auto px-10 py-12 flex items-center justify-between gap-10 flex-wrap">
          <div className="flex items-center gap-6">
            <img src="/logo-chec.png" alt="中国港湾" className="h-10 object-contain opacity-80 hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h3 className="text-sm font-bold mb-1.5">中国港湾工程有限责任公司</h3>
            <p className="text-xs text-ink-dim leading-relaxed">
              China Harbour Engineering Company (CHEC)<br />
              项目总包施工单位
            </p>
          </div>
          <div className="text-right text-xs text-ink-dim leading-relaxed">
            <div className="text-teal font-extrabold text-[11px] tracking-[2px] uppercase mb-1.5">项目名称</div>
            <strong className="text-ink-mid">阿亚古孜 — 巴赫特宽轨铁路</strong><br />
            正线 302.4 km · 阿拜州 · 哈中过境通道
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
