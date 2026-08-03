import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, ArrowDownToLine, ArrowUpFromLine, TrendingDown, FileDown } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { fuelTransactions, fuelTrend } from '../data/mockData';

export default function ReportFuel() {
  const [fuelType, setFuelType] = useState('All');

  const txns = fuelTransactions.filter(t => fuelType === 'All' || t.fuelType === fuelType);

  const totalIn = txns.filter(t => t.type === 'in').reduce((s, t) => s + (t as any).actualQty, 0);
  const totalOut = txns.filter(t => t.type === 'out').reduce((s, t) => s + (t as any).qty, 0);
  const totalLoss = txns.filter(t => t.type === 'in').reduce((s, t) => s + (t as any).lossQty, 0);
  const lossPct = totalIn ? ((totalLoss / totalIn) * 100).toFixed(2) : '0.00';

  const dieselIn = fuelTransactions.filter(t => t.type === 'in' && t.fuelType === 'Diesel').reduce((s, t) => s + (t as any).actualQty, 0);
  const dieselOut = fuelTransactions.filter(t => t.type === 'out' && t.fuelType === 'Diesel').reduce((s, t) => s + (t as any).qty, 0);
  const skIn = fuelTransactions.filter(t => t.type === 'in' && t.fuelType === 'S/K').reduce((s, t) => s + (t as any).actualQty, 0);
  const skOut = fuelTransactions.filter(t => t.type === 'out' && t.fuelType === 'S/K').reduce((s, t) => s + (t as any).qty, 0);

  const monthlyByFuel = ['Diesel', 'S/K'].map(f => {
    const monthly = fuelTrend.map(m => m.month);
    return monthly.map(month => {
      const idx = fuelTrend.findIndex(t => t.month === month);
      return { month, [f]: idx >= 0 ? (f === 'Diesel' ? fuelTrend[idx].fuelOut : Math.round(fuelTrend[idx].fuelOut * 0.1)) : 0 };
    });
  });

  const monthlyData = fuelTrend.map(m => ({
    month: m.month,
    fuelIn: m.fuelIn,
    fuelOut: m.fuelOut,
    loss: m.loss,
  }));

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Fuel Report"
        breadcrumbs={[{ label: 'Reports' }, { label: 'Fuel' }]}
        secondaryActions={[{ label: 'Export PDF', onClick: () => {} }]}
        badge={{ label: `${txns.length} transactions`, color: '#7C3AED' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Total In', value: `${totalIn.toLocaleString()} L`, color: '#16A34A', bg: '#DCFCE7', icon: <ArrowDownToLine size={15} /> },
              { label: 'Total Out', value: `${totalOut.toLocaleString()} L`, color: '#7C3AED', bg: '#F3E8FF', icon: <ArrowUpFromLine size={15} /> },
              { label: 'Total Loss', value: `${totalLoss} L`, sub: `${lossPct}% of invoice`, color: '#DC2626', bg: '#FEE2E2', icon: <TrendingDown size={15} /> },
              { label: 'Net Balance', value: `${(totalIn - totalOut).toLocaleString()} L`, color: '#0891B2', bg: '#ECFEFF', icon: <Droplets size={15} /> },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border px-5 py-4 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                <div>
                  <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{s.label}</div>
                  {s.sub && <div className="text-[10px]" style={{ color: '#CBD5E1' }}>{s.sub}</div>}
                </div>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>{s.icon}</div>
              </div>
            ))}
          </div>

          {/* Fuel type comparison */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Monthly In vs Out</div>
              <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>Litres across both fuels</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData} barGap={2}>
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
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="rf-loss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="loss" name="Loss (L)" stroke="#DC2626" strokeWidth={2} fill="url(#rf-loss)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diesel vs S/K summary */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[{ name: 'Diesel', color: '#7C3AED', bg: '#F3E8FF', inQ: dieselIn, outQ: dieselOut },
              { name: 'S/K', color: '#0891B2', bg: '#ECFEFF', inQ: skIn, outQ: skOut }].map(f => (
              <div key={f.name} className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: f.bg }}>
                      <Droplets size={15} style={{ color: f.color }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>{f.name}</div>
                      <div className="text-xs" style={{ color: '#94A3B8' }}>Monthly summary</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-around text-center">
                  <div>
                    <div className="text-lg font-bold" style={{ color: '#16A34A' }}>{f.inQ.toLocaleString()} L</div>
                    <div className="text-[11px]" style={{ color: '#94A3B8' }}>In</div>
                  </div>
                  <div className="w-px h-10" style={{ background: '#E2E8F0' }} />
                  <div>
                    <div className="text-lg font-bold" style={{ color: f.color }}>{f.outQ.toLocaleString()} L</div>
                    <div className="text-[11px]" style={{ color: '#94A3B8' }}>Out</div>
                  </div>
                  <div className="w-px h-10" style={{ background: '#E2E8F0' }} />
                  <div>
                    <div className="text-lg font-bold" style={{ color: '#DC2626' }}>{f.name === 'Diesel' ? 7 : 2} L</div>
                    <div className="text-[11px]" style={{ color: '#94A3B8' }}>Loss</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Fuel Transactions</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {['All', 'Diesel', 'S/K'].map(t => (
                    <button key={t} onClick={() => setFuelType(t)}
                      className="text-xs px-2.5 py-1.5 rounded-lg font-medium"
                      style={{ background: fuelType === t ? '#2563EB' : '#F1F5F9', color: fuelType === t ? 'white' : '#64748B' }}>
                      {t}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#2563EB' }}>
                  <FileDown size={12} /> Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['ID', 'Type', 'Fuel', 'Date', 'Quantity', 'Details', 'Person', 'Balance After'].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txns.map(t => (
                    <tr key={t.id} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}>
                      <td className="px-3 py-3 font-mono" style={{ color: '#2563EB' }}>{t.id}</td>
                      <td className="px-3 py-3">
                        <Badge label={t.type === 'in' ? 'Fuel In' : 'Fuel Out'} variant={t.type === 'in' ? 'success' : 'purple'} />
                      </td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.fuelType}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.date}</td>
                      <td className="px-3 py-3 font-semibold" style={{ color: t.type === 'in' ? '#16A34A' : '#7C3AED' }}>
                        {t.type === 'in' ? `+${(t as any).actualQty}L` : `-${(t as any).qty}L`}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#64748B' }}>
                        {t.type === 'in' ? `Loss: ${(t as any).lossQty}L · Inv: ${(t as any).invoiceQty}L` : (t as any).machine || (t as any).department}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>
                        {t.type === 'in' ? (t as any).receivedBy : (t as any).issuedTo}
                      </td>
                      <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>
                        {t.type === 'in' ? `${(t as any).tankAfter}L` : `${(t as any).stockAfter}L`}
                      </td>
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

