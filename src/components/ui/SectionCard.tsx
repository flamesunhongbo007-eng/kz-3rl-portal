import { ReactNode } from 'react';

interface SectionCardProps {
  icon?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  onClick?: () => void;
  href?: string;
}

export function SectionCard({ icon, title, subtitle, children, className = '', gradient = false, onClick, href }: SectionCardProps) {
  const base = gradient ? 'gradient-border' : 'glass';
  const interactive = (onClick || href) ? 'cursor-pointer hover:translate-y-[-3px] hover:border-c1/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] transition-all duration-300 group' : '';
  const body = (
    <div className={`${base} ${interactive} ${className} p-5 h-full relative overflow-hidden`}>
      {/* hover 时左上角扫光 */}
      {(onClick || href) && (
        <div className="absolute inset-0 bg-gradient-to-br from-c1/[0.04] to-c2/[0.04] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}
      {icon && (
        <div className="text-3xl text-c1 mono mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      )}
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {subtitle && <span className="text-[10px] mono text-ink-dim uppercase tracking-wider">{subtitle}</span>}
      </div>
      <div className="text-ink-muted text-xs leading-relaxed">
        {children}
      </div>
      {/* 角落装饰 */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-c1/20 rounded-tr-md opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
  if (href) return <a href={href} className="block">{body}</a>;
  if (onClick) return <div onClick={onClick}>{body}</div>;
  return body;
}
