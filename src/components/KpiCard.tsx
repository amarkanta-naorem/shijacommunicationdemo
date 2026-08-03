interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { value: string; up: boolean };
  onClick?: () => void;
}

export default function KpiCard({ label, value, sub, icon, iconBg, trend, onClick }: KpiCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-5 border flex flex-col gap-3 transition-shadow cursor-default"
      style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
    >
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium" style={{ color: '#64748B' }}>{label}</div>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: iconBg }}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold" style={{ color: '#0F172A', letterSpacing: '-0.02em' }}>{value}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{sub}</div>}
      </div>
      {trend && (
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium" style={{ color: trend.up ? '#16A34A' : '#DC2626' }}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-xs" style={{ color: '#94A3B8' }}>vs last month</span>
        </div>
      )}
    </div>
  );
}
