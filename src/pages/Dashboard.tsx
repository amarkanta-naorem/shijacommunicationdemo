import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Package, Droplets, ArrowDownToLine, ArrowUpFromLine,
  Wrench, CheckCircle2, AlertTriangle, TrendingDown, Fuel,
  Clock, Zap, ArrowRight
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import Badge, { statusBadge } from '../components/Badge';
import { inventoryTrend, fuelTrend, maintenanceStats, supplierContribution, maintenanceJobs, alerts, fuelTransactions } from '../data/mockData';

const PIE_COLORS = ['#2563EB', '#64748B'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg px-3 py-2 text-xs shadow-lg" style={{ borderColor: '#E2E8F0' }}>
        <p className="font-semibold mb-1" style={{ color: '#0F172A' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.value > 999 ? `₹${(p.value / 1000).toFixed(1)}k` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const recentActivity = [
    ...maintenanceJobs.slice(0, 3).map(j => ({ type: 'maintenance', id: j.id, label: `${j.type} — ${j.generator.split('(')[0].trim()}`, status: j.status, time: 'Today', icon: <Wrench size={13} /> })),
    ...fuelTransactions.slice(0, 2).map(f => ({ type: 'fuel', id: f.id, label: `Fuel ${f.type === 'in' ? 'In' : 'Out'} — ${f.fuelType} ${f.type === 'in' ? (f as any).invoiceQty : (f as any).qty}L`, status: f.type === 'in' ? 'Received' : 'Issued', time: 'Today', icon: <Fuel size={13} /> })),
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
      <div className="px-6 py-6 max-w-screen-2xl">

        {/* KPI Row 1 */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          <KpiCard
            label="Inventory Value"
            value="₹2,39,200"
            sub="Across 10 products"
            icon={<Package size={17} color="#2563EB" />}
            iconBg="#EFF6FF"
            trend={{ value: '8.4%', up: true }}
          />
          <KpiCard
            label="Diesel Stock"
            value="1,035 L"
            sub="Reorder at 800L"
            icon={<Droplets size={17} color="#7C3AED" />}
            iconBg="#F3E8FF"
            trend={{ value: '12.1%', up: false }}
          />
          <KpiCard
            label="S/K Stock"
            value="223 L"
            sub="Reorder at 100L"
            icon={<Fuel size={17} color="#0891B2" />}
            iconBg="#ECFEFF"
          />
          <KpiCard
            label="Today's Stock In"
            value="₹9,000"
            sub="Oil Filters × 20 units"
            icon={<ArrowDownToLine size={17} color="#16A34A" />}
            iconBg="#DCFCE7"
          />
          <KpiCard
            label="Today's Stock Out"
            value="₹2,500"
            sub="7 items issued"
            icon={<ArrowUpFromLine size={17} color="#DC2626" />}
            iconBg="#FEE2E2"
          />
        </div>

        {/* KPI Row 2 */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <KpiCard
            label="Pending Maintenance"
            value="3"
            sub="2 PM · 1 CM"
            icon={<Clock size={17} color="#D97706" />}
            iconBg="#FEF3C7"
            trend={{ value: '1 overdue', up: false }}
          />
          <KpiCard
            label="Completed This Month"
            value="22"
            sub="13 PM · 9 CM"
            icon={<CheckCircle2 size={17} color="#16A34A" />}
            iconBg="#DCFCE7"
            trend={{ value: '18.9%', up: true }}
          />
          <KpiCard
            label="Fuel Loss (Jul)"
            value="7 L"
            sub="₹560 estimated"
            icon={<TrendingDown size={17} color="#DC2626" />}
            iconBg="#FEE2E2"
            trend={{ value: '63% lower', up: true }}
          />
          <KpiCard
            label="Low Stock Alerts"
            value="3"
            sub="2 critical · 1 warning"
            icon={<AlertTriangle size={17} color="#D97706" />}
            iconBg="#FEF3C7"
          />
          <KpiCard
            label="Active Generators"
            value="5 / 7"
            sub="2 under maintenance"
            icon={<Zap size={17} color="#2563EB" />}
            iconBg="#EFF6FF"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Inventory Trend */}
          <div className="col-span-2 bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Inventory Movement</div>
                <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>Stock In vs Stock Out (₹)</div>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ color: '#64748B' }}>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#2563EB' }} />Stock In</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#E2E8F0' }} />Stock Out</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={inventoryTrend}>
                <defs>
                  <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="stockIn" name="Stock In" stroke="#2563EB" strokeWidth={2} fill="url(#gIn)" />
                <Area type="monotone" dataKey="stockOut" name="Stock Out" stroke="#94A3B8" strokeWidth={2} fill="url(#gOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Supplier Contribution */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Supplier Share</div>
            <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>By procurement value (Jul)</div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={supplierContribution} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" paddingAngle={3}>
                  {supplierContribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-2">
              {supplierContribution.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-xs" style={{ color: '#475569' }}>{s.name}</span>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: '#0F172A' }}>₹{(s.amount / 1000).toFixed(0)}k <span style={{ color: '#94A3B8', fontWeight: 400 }}>({s.value}%)</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Fuel Trend */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Fuel Consumption</div>
            <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>In vs Out (Litres)</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={fuelTrend} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="fuelIn" name="Fuel In" fill="#7C3AED" radius={[3, 3, 0, 0]} />
                <Bar dataKey="fuelOut" name="Fuel Out" fill="#C4B5FD" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Maintenance Stats */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Maintenance Activity</div>
            <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>PM vs CM completed</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={maintenanceStats} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="pm" name="Preventive" fill="#2563EB" radius={[3, 3, 0, 0]} />
                <Bar dataKey="cm" name="Complaint" fill="#F59E0B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts Panel */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Active Alerts</div>
                <div className="text-xs" style={{ color: '#94A3B8' }}>Requires attention</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#FEE2E2', color: '#DC2626' }}>5 open</span>
            </div>
            <div className="flex flex-col gap-2">
              {alerts.map(a => (
                <div key={a.id} className="flex gap-3 p-2.5 rounded-lg" style={{ background: '#F8FAFC' }}>
                  <div className="mt-0.5">
                    <AlertTriangle size={13} style={{ color: a.severity === 'danger' ? '#DC2626' : a.severity === 'warning' ? '#D97706' : '#2563EB' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug" style={{ color: '#374151' }}>{a.message}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity + Work Orders */}
        <div className="grid grid-cols-2 gap-4">
          {/* Recent Work Orders */}
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Recent Work Orders</div>
              <button onClick={() => onNavigate('work-orders')} className="flex items-center gap-1 text-xs" style={{ color: '#2563EB' }}>
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: '#F8FAFC' }}>
              {maintenanceJobs.map(job => (
                <div key={job.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: job.type === 'PM' ? '#EFF6FF' : '#FEF3C7' }}>
                    <Wrench size={14} style={{ color: job.type === 'PM' ? '#2563EB' : '#D97706' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: '#0F172A' }}>{job.generator}</div>
                    <div className="text-xs" style={{ color: '#94A3B8' }}>{job.id} · {job.site}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {statusBadge(job.status)}
                    <span className="text-xs" style={{ color: '#94A3B8' }}>{job.scheduledDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Today's Transactions</div>
              <button onClick={() => onNavigate('inventory-history')} className="flex items-center gap-1 text-xs" style={{ color: '#2563EB' }}>
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: '#F8FAFC' }}>
              {[
                { id: 'SI-2026-001', type: 'in', label: 'Oil Filter × 20', sub: 'Mahindra · INV-MH-4521', value: '+₹9,000', time: '09:14 AM' },
                { id: 'SO-2026-001', type: 'out', label: 'Oil Filter × 2', sub: 'To Amit Verma · PM-G12', value: '-₹900', time: '10:32 AM' },
                { id: 'SO-2026-002', type: 'out', label: 'Engine Oil × 5L', sub: 'To Vikram Singh · PM-G08', value: '-₹1,600', time: '11:15 AM' },
                { id: 'FO-2026-061', type: 'fuel', label: 'Diesel Out 50L', sub: 'DG-G12 · Amit Verma', value: '50 L', time: '12:00 PM' },
                { id: 'FO-2026-062', type: 'fuel', label: 'Diesel Out 30L', sub: 'DG-G08 · Vikram Singh', value: '30 L', time: '02:20 PM' },
              ].map(t => (
                <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: t.type === 'in' ? '#DCFCE7' : t.type === 'fuel' ? '#F3E8FF' : '#FEE2E2' }}>
                    {t.type === 'in' ? <ArrowDownToLine size={14} style={{ color: '#16A34A' }} /> :
                      t.type === 'fuel' ? <Fuel size={14} style={{ color: '#7C3AED' }} /> :
                        <ArrowUpFromLine size={14} style={{ color: '#DC2626' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: '#0F172A' }}>{t.label}</div>
                    <div className="text-xs" style={{ color: '#94A3B8' }}>{t.sub}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold" style={{ color: t.type === 'in' ? '#16A34A' : t.type === 'fuel' ? '#7C3AED' : '#DC2626' }}>{t.value}</div>
                    <div className="text-xs" style={{ color: '#94A3B8' }}>{t.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
