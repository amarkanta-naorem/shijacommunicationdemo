import { useState } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Header from '../components/Header';
import { inventoryTrend, fuelTrend, maintenanceStats, supplierContribution } from '../data/mockData';
import { FileDown, Filter } from 'lucide-react';

const TABS = ['Overview', 'Inventory', 'Maintenance', 'Fuel'];

export default function Reports() {
  const [tab, setTab] = useState('Overview');
  const [dateRange, setDateRange] = useState({ from: '2026-07-01', to: '2026-07-31' });

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Reports & Analytics"
        breadcrumbs={[{ label: 'Reports' }]}
        secondaryActions={[
          { label: 'Export PDF', onClick: () => {} },
          { label: 'Export Excel', onClick: () => {} },
        ]}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* Filters bar */}
          <div className="bg-white rounded-xl border px-4 py-3 mb-4 flex items-center gap-4" style={{ borderColor: '#E2E8F0' }}>
            <Filter size={14} style={{ color: '#94A3B8' }} />
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: '#64748B' }}>From</label>
              <input type="date" value={dateRange.from} onChange={e => setDateRange(s => ({ ...s, from: e.target.value }))}
                className="text-xs border rounded-lg px-3 py-1.5 outline-none" style={{ borderColor: '#E2E8F0' }} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: '#64748B' }}>To</label>
              <input type="date" value={dateRange.to} onChange={e => setDateRange(s => ({ ...s, to: e.target.value }))}
                className="text-xs border rounded-lg px-3 py-1.5 outline-none" style={{ borderColor: '#E2E8F0' }} />
            </div>
            <div className="h-4 w-px" style={{ background: '#E2E8F0' }} />
            {['This Week', 'This Month', 'Last Month', 'Custom'].map(r => (
              <button key={r} className="text-xs px-2.5 py-1 rounded-md font-medium"
                style={{ background: r === 'This Month' ? '#EFF6FF' : 'transparent', color: r === 'This Month' ? '#2563EB' : '#94A3B8' }}>
                {r}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-4">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="text-sm px-4 py-2 rounded-lg font-medium transition-colors"
                style={{ background: tab === t ? '#0F172A' : 'transparent', color: tab === t ? 'white' : '#64748B' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Summary KPIs */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Stock Value', value: '₹2,39,200', sub: '+8.4% vs last month', up: true },
              { label: 'Transactions', value: '47', sub: '28 In · 19 Out', up: true },
              { label: 'Maintenance Jobs', value: '13', sub: '9 PM · 4 CM', up: false },
              { label: 'Fuel Consumed', value: '1,380 L', sub: 'Diesel + S/K', up: false },
            ].map((k, i) => (
              <div key={i} className="bg-white rounded-xl border px-5 py-4" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-xs mb-2" style={{ color: '#64748B' }}>{k.label}</div>
                <div className="text-xl font-bold" style={{ color: '#0F172A' }}>{k.value}</div>
                <div className="text-xs mt-1" style={{ color: k.up ? '#16A34A' : '#94A3B8' }}>{k.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Stock Movement Trend</div>
              <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>Monthly Stock In vs Out (₹)</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={inventoryTrend}>
                  <defs>
                    <linearGradient id="r-gIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="stockIn" name="Stock In" stroke="#2563EB" strokeWidth={2} fill="url(#r-gIn)" />
                  <Area type="monotone" dataKey="stockOut" name="Stock Out" stroke="#94A3B8" strokeWidth={2} fill="none" strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Maintenance Completion</div>
              <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>PM vs CM over 6 months</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={maintenanceStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="pm" name="Preventive" fill="#2563EB" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="cm" name="Complaint" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Fuel: In vs Out</div>
              <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>Litres per month</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={fuelTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="fuelIn" name="In" fill="#7C3AED" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="fuelOut" name="Out" fill="#C4B5FD" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Fuel Loss Trend</div>
              <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>Litres lost per month</div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={fuelTrend}>
                  <defs>
                    <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="loss" name="Loss (L)" stroke="#DC2626" strokeWidth={2} fill="url(#lossGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Supplier Breakdown</div>
              <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>By procurement value</div>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={supplierContribution} cx="50%" cy="50%" innerRadius={32} outerRadius={52} dataKey="value" paddingAngle={3}>
                    {supplierContribution.map((_, i) => <Cell key={i} fill={['#2563EB', '#475569'][i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              {supplierContribution.map((s, i) => (
                <div key={i} className="flex justify-between items-center text-xs mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm" style={{ background: ['#2563EB', '#475569'][i] }} />
                    <span style={{ color: '#475569' }}>{s.name}</span>
                  </div>
                  <span className="font-semibold" style={{ color: '#0F172A' }}>₹{(s.amount / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
