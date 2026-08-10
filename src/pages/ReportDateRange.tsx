import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, ArrowDownToLine, ArrowUpFromLine, TrendingUp, FileDown } from 'lucide-react';
import Header from '../components/Header';
import { inventoryHistory } from '../data/mockData';

export default function ReportDateRange() {
  const [from, setFrom] = useState('2026-07-01');
  const [to, setTo] = useState('2026-07-31');

  const txns = inventoryHistory.filter(t => t.date >= from && t.date <= to);
  const totalIn = txns.filter(t => t.type === 'in').reduce((s, t) => s + t.total, 0);
  const totalOut = txns.filter(t => t.type === 'out').reduce((s, t) => s + t.total, 0);

  const byDate = Array.from(new Set(txns.map(t => t.date))).sort().map(d => {
    const day = txns.filter(t => t.date === d);
    return {
      date: d,
      in: day.filter(t => t.type === 'in').reduce((s, t) => s + t.total, 0),
      out: day.filter(t => t.type === 'out').reduce((s, t) => s + t.total, 0),
    };
  });

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Date Range Report"
        breadcrumbs={[{ label: 'Reports' }, { label: 'Date Range' }]}
        secondaryActions={[{ label: 'Export PDF', onClick: () => {} }]}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* Date filter */}
          <div className="bg-white rounded-xl border px-4 py-3 mb-4 flex items-center gap-4" style={{ borderColor: '#E2E8F0' }}>
            <Calendar size={14} style={{ color: '#94A3B8' }} />
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: '#64748B' }}>From</label>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                className="text-xs border rounded-lg px-3 py-1.5 outline-none" style={{ borderColor: '#E2E8F0' }} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: '#64748B' }}>To</label>
              <input type="date" value={to} onChange={e => setTo(e.target.value)}
                className="text-xs border rounded-lg px-3 py-1.5 outline-none" style={{ borderColor: '#E2E8F0' }} />
            </div>
            {['This Week', 'This Month', 'Last Month'].map(r => (
              <button key={r} className="text-xs px-2.5 py-1 rounded-md font-medium"
                style={{ background: r === 'This Month' ? '#EFF6FF' : 'transparent', color: r === 'This Month' ? '#2563EB' : '#94A3B8' }}>
                {r}
              </button>
            ))}
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Transactions', value: txns.length, sub: `${txns.filter(t => t.type === 'in').length} in · ${txns.filter(t => t.type === 'out').length} out`, color: '#2563EB', bg: '#EFF6FF', icon: <TrendingUp size={15} /> },
              { label: 'Total In', value: `₹${totalIn.toLocaleString()}`, sub: 'Stock received', color: '#16A34A', bg: '#DCFCE7', icon: <ArrowDownToLine size={15} /> },
              { label: 'Total Out', value: `₹${totalOut.toLocaleString()}`, sub: 'Stock issued', color: '#DC2626', bg: '#FEE2E2', icon: <ArrowUpFromLine size={15} /> },
              { label: 'Net Movement', value: `₹${(totalIn - totalOut).toLocaleString()}`, sub: 'Inventory change', color: totalIn - totalOut >= 0 ? '#16A34A' : '#D97706', bg: '#FEF3C7', icon: <TrendingUp size={15} /> },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border px-5 py-4" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs" style={{ color: '#64748B' }}>{s.label}</div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>{s.icon}</div>
                </div>
                <div className="text-xl font-bold" style={{ color: '#0F172A' }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl border p-5 mb-4" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Daily Movement (₹)</div>
            <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>{from} → {to}</div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={byDate}>
                <defs>
                  <linearGradient id="dr-in" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dr-out" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="in" name="Stock In" stroke="#2563EB" strokeWidth={2} fill="url(#dr-in)" />
                <Area type="monotone" dataKey="out" name="Stock Out" stroke="#DC2626" strokeWidth={2} fill="url(#dr-out)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Transactions table */}
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Transactions in Range</div>
              <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#2563EB' }}>
                <FileDown size={12} /> Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['ID', 'Date', 'Type', 'Product', 'Qty', 'Total', 'Party'].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txns.map(t => (
                    <tr key={t.id} className="border-t" style={{ borderColor: '#F1F5F9' }}>
                      <td className="px-3 py-3 font-mono" style={{ color: t.type === 'in' ? '#2563EB' : '#DC2626' }}>{t.id}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.date}</td>
                      <td className="px-3 py-3 font-medium" style={{ color: t.type === 'in' ? '#16A34A' : '#DC2626' }}>{t.type === 'in' ? 'Stock In' : 'Stock Out'}</td>
                      <td className="px-3 py-3" style={{ color: '#0F172A' }}>{t.product}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.type === 'in' ? `+${t.qty}` : `-${t.qty}`}</td>
                      <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>₹{t.total.toLocaleString()}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.party}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

