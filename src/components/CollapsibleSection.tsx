import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  badgeColor?: string;
  children: ReactNode;
}

export default function CollapsibleSection({
  title,
  subtitle,
  icon,
  defaultOpen = false,
  badge,
  badgeColor = '#2563EB',
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F1F5F9', color: '#475569' }}>
              {icon}
            </span>
          )}
          <div>
            <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>{title}</div>
            {subtitle && <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{subtitle}</div>}
          </div>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: badgeColor + '15', color: badgeColor }}>
              {badge}
            </span>
          )}
        </div>
        <span style={{ color: '#94A3B8' }}>
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-1 border-t" style={{ borderColor: '#F1F5F9' }}>
          {children}
        </div>
      )}
    </div>
  );
}

