import { Bell, Plus, ChevronRight } from 'lucide-react';

interface BreadcrumbItem { label: string; id?: string }

interface HeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  primaryAction?: { label: string; onClick: () => void };
  secondaryActions?: { label: string; onClick: () => void }[];
  badge?: { label: string; color: string };
}

export default function Header({ title, breadcrumbs, primaryAction, secondaryActions, badge }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b" style={{ borderColor: '#E2E8F0', minHeight: 64 }}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 mb-1">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-xs" style={{ color: '#94A3B8' }}>{b.label}</span>
                {i < breadcrumbs.length - 1 && <ChevronRight size={12} style={{ color: '#CBD5E1' }} />}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold" style={{ color: '#0F172A' }}>{title}</h1>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: badge.color + '15', color: badge.color }}>
              {badge.label}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {secondaryActions?.map((a, i) => (
          <button
            key={i}
            onClick={a.onClick}
            className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
            style={{ borderColor: '#E2E8F0', color: '#475569' }}
          >
            {a.label}
          </button>
        ))}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
            style={{ background: '#2563EB', color: 'white' }}
          >
            <Plus size={13} />
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
