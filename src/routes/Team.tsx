import { useEffect, useRef, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { dataApi } from '@/lib/api';
import type { Member } from '@/lib/types';
import { SectionCard } from '@/components/ui/SectionCard';

// 3D 倾斜卡片网格
export function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  useEffect(() => { dataApi.list<Member>('MEMBERS').then(setMembers); }, []);

  const colors = ['from-c1 to-c3', 'from-c2 to-c4', 'from-c3 to-c5', 'from-c5 to-c7', 'from-c6 to-c8', 'from-c1 to-c5', 'from-c2 to-c6', 'from-c4 to-c8'];
  const colorOf = (id: string, idx: number) => colors[(id.charCodeAt(id.length - 1) + idx) % colors.length];

  return (
    <PublicLayout>
      <header className="mb-10">
        <div className="text-[10px] mono tracking-[0.3em] text-c5 mb-2">SECTION / TEAM</div>
        <h1 className="text-4xl md:text-5xl font-black text-ink leading-none">团队成员</h1>
        <p className="mt-2 text-sm text-ink-muted">项目部核心成员与各分部负责人 · 鼠标移上卡片有 3D 倾斜效果</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 perspective-1000">
        {members.map((m, idx) => (
          <TiltCard key={m.record_id} member={m} color={colorOf(m.record_id, idx)} />
        ))}
      </section>
    </PublicLayout>
  );
}

function TiltCard({ member, color }: { member: Member; color: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
  };

  const initials = member.name.slice(0, 1);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative glass-soft p-5 transition-transform duration-200 group cursor-default"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* 头像 */}
      <div className="relative mb-4 flex justify-center" style={{ transform: 'translateZ(20px)' }}>
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl font-bold mono shadow-[0_0_30px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-shadow`}>
          {initials}
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-running border-2 border-bg animate-pulse" />
      </div>
      <div className="text-center" style={{ transform: 'translateZ(15px)' }}>
        <h3 className="text-base font-semibold text-ink">{member.name}</h3>
        <div className="text-[11px] text-c1 mono mt-0.5">{member.role}</div>
        {member.org && <div className="text-[10px] mono text-ink-dim mt-1">{member.org}</div>}
        {member.bio && <p className="text-[11px] text-ink-muted mt-2 line-clamp-2">{member.bio}</p>}
      </div>
      {/* 角落装饰 */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-c1/30 rounded-tl-md" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-c2/30 rounded-br-md" />
    </div>
  );
}
