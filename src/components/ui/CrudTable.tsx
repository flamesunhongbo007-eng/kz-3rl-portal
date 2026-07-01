import { ReactNode } from 'react';

interface CrudTableProps<T extends { record_id: string }> {
  rows: T[];
  columns: { key: keyof T | string; label: string; render?: (row: T) => ReactNode; width?: string; align?: 'left' | 'center' | 'right' }[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyText?: string;
  hoverable?: boolean;
}

export function CrudTable<T extends { record_id: string }>({ rows, columns, onEdit, onDelete, emptyText = '暂无数据', hoverable = true }: CrudTableProps<T>) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] mono uppercase tracking-[0.15em] text-ink-dim border-b border-c1/20">
            {columns.map((c) => (
              <th
                key={String(c.key)}
                className={`px-3 py-2.5 font-semibold ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : ''}`}
                style={{ width: c.width }}
              >
                <span className="inline-block">{c.label}</span>
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-3 py-2.5 font-semibold text-right w-24">操作</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="px-3 py-12 text-center text-ink-dim text-xs">
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl opacity-40">◌</div>
                <div>{emptyText}</div>
              </div>
            </td></tr>
          ) : rows.map((row, idx) => (
            <tr
              key={row.record_id}
              className={`border-b border-border/30 transition-all duration-150 ${
                hoverable ? 'hover:bg-c1/[0.04] hover:border-c1/30' : ''
              } ${idx % 2 === 0 ? 'bg-transparent' : 'bg-bg/[0.2]'}`}
            >
              {columns.map((c) => (
                <td
                  key={String(c.key)}
                  className={`px-3 py-2.5 text-ink-muted ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : ''}`}
                >
                  {c.render ? c.render(row) : (row[c.key as keyof T] as ReactNode)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-3 py-2.5 text-right">
                  <div className="inline-flex gap-2">
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="text-[11px] mono text-c1 hover:text-c1 hover:underline transition-colors">编辑</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="text-[11px] mono text-danger/70 hover:text-danger transition-colors">删除</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
