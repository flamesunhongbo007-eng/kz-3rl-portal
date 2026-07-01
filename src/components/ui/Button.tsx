import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'glow';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-c1/15 border-c1/40 text-c1 hover:bg-c1/25 hover:border-c1/60',
  secondary: 'bg-bg-soft border-border text-ink hover:border-ink-muted hover:bg-bg-soft/80',
  danger: 'bg-danger/15 border-danger/40 text-danger hover:bg-danger/25',
  ghost: 'bg-transparent border-transparent text-ink-muted hover:text-ink hover:bg-bg-soft/50',
  glow: 'bg-gradient-to-r from-c1/20 to-c2/20 border-c1/40 text-c1 hover:from-c1/30 hover:to-c2/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]',
};

const sizeClass = {
  sm: 'px-2.5 py-1 text-[11px]',
  md: 'px-3.5 py-1.5 text-xs',
  lg: 'px-5 py-2.5 text-sm',
};

export function Button({ children, onClick, variant = 'secondary', size = 'md', type = 'button', disabled, className = '', icon }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 font-medium mono border rounded-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-0 ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    >
      {icon && <span className="text-current">{icon}</span>}
      {children}
    </button>
  );
}
