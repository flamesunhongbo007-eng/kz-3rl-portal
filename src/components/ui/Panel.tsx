import { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glow' | 'minimal';
}

export function Panel({ title, subtitle, actions, children, className = '', variant = 'default' }: PanelProps) {
  const variantClass = {
    default: 'glass',
    glow: 'gradient-border',
    minimal: 'bg-bg-soft/40 border border-border/60 rounded-xl',
  }[variant];

  return (
    <div className={`${variantClass} overflow-hidden transition-all duration-200 ${className}`}>
      {title && (
        <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-gradient-to-r from-bg-soft/40 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-gradient-to-b from-c1 to-c2 rounded-full" />
            <div>
              <h3 className="text-sm font-semibold text-ink tracking-wide">{title}</h3>
              {subtitle && <p className="text-[10px] mono text-ink-dim mt-0.5 tracking-wider">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-5 relative">
        {/* 角落装饰 */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-30">
          <div className="absolute top-2 right-2 w-px h-8 bg-gradient-to-b from-c1 to-transparent" />
          <div className="absolute top-2 right-2 w-8 h-px bg-gradient-to-r from-c1 to-transparent" />
        </div>
        {children}
      </div>
    </div>
  );
}
