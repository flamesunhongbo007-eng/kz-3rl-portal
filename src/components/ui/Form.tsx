import { ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

const widthClass = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

export function Modal({ open, title, onClose, children, footer, width = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className={`gradient-border w-full ${widthClass[width]} max-h-[90vh] flex flex-col animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-gradient-to-b from-c1 to-c2 rounded-full" />
            <h3 className="text-sm font-semibold text-ink tracking-wide">{title}</h3>
          </div>
          <button onClick={onClose} className="text-ink-dim hover:text-ink text-xl leading-none w-8 h-8 rounded-md hover:bg-bg-soft/50 flex items-center justify-center transition-colors">×</button>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
        {footer && <div className="px-6 py-3 border-t border-border flex justify-end gap-2 bg-bg-soft/30">{footer}</div>}
      </div>
    </div>
  );
}

interface InputProps {
  label?: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: 'text' | 'number' | 'date' | 'url' | 'email';
  placeholder?: string;
  required?: boolean;
  icon?: ReactNode;
}

export function Input({ label, value, onChange, type = 'text', placeholder, required, icon }: InputProps) {
  return (
    <label className="block">
      {label && (
        <span className="block text-[10px] mono uppercase tracking-[0.15em] text-ink-dim mb-2">
          {label}{required && <span className="text-danger ml-1">*</span>}
        </span>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim text-sm">{icon}</span>}
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2 bg-bg-soft/60 border border-border rounded-md text-sm text-ink mono focus:border-c1 focus:bg-bg-soft focus:outline-none focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all`}
        />
      </div>
    </label>
  );
}

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}

export function Textarea({ label, value, onChange, rows = 3, placeholder }: TextareaProps) {
  return (
    <label className="block">
      {label && <span className="block text-[10px] mono uppercase tracking-[0.15em] text-ink-dim mb-2">{label}</span>}
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-bg-soft/60 border border-border rounded-md text-sm text-ink mono focus:border-c1 focus:bg-bg-soft focus:outline-none focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all resize-y"
      />
    </label>
  );
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <label className="block">
      {label && <span className="block text-[10px] mono uppercase tracking-[0.15em] text-ink-dim mb-2">{label}</span>}
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-bg-soft/60 border border-border rounded-md text-sm text-ink mono focus:border-c1 focus:bg-bg-soft focus:outline-none focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all appearance-none cursor-pointer pr-8"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b8'%3E%3Cpath d='M5.5 7.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
        >
          {options.map((o) => <option key={o.value} value={o.value} className="bg-bg-soft">{o.label}</option>)}
        </select>
      </div>
    </label>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
        checked ? 'bg-c1 border-c1 shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'border-border group-hover:border-c1/50'
      }`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">{label}</span>
    </label>
  );
}
