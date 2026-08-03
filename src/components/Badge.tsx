type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'gray' | 'blue';

const variants: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: '#DCFCE7', color: '#16A34A' },
  danger: { bg: '#FEE2E2', color: '#DC2626' },
  warning: { bg: '#FEF3C7', color: '#D97706' },
  info: { bg: '#EFF6FF', color: '#2563EB' },
  purple: { bg: '#F3E8FF', color: '#7C3AED' },
  gray: { bg: '#F1F5F9', color: '#64748B' },
  blue: { bg: '#DBEAFE', color: '#1D4ED8' },
};

export default function Badge({ label, variant }: { label: string; variant: BadgeVariant }) {
  const v = variants[variant];
  return (
    <span
      className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: v.bg, color: v.color }}
    >
      {label}
    </span>
  );
}

export function statusBadge(status: string) {
  const map: Record<string, BadgeVariant> = {
    'Completed': 'success',
    'In Progress': 'info',
    'Scheduled': 'warning',
    'Issued': 'success',
    'Running': 'success',
    'Under Maintenance': 'warning',
    'Low Stock': 'danger',
    'Critical': 'danger',
    'High': 'warning',
    'Normal': 'gray',
  };
  return <Badge label={status} variant={map[status] ?? 'gray'} />;
}
