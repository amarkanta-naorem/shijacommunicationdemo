import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Truck, Search, FileDown } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { suppliers, products, stockInTransactions } from '../data/mockData';

const COLORS = ['#2563EB', '#64748B', '#7C3AED', '#0891B2'];

export default function ReportSupplierWise() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');

  const data = suppliers.map(s => {
    const items = products.filter(p => p.supplier === s.name);
    const receipts = stockInTransactions.filter(t => t.supplier === s.name);
    return {
      ...s,
      itemsCount: items.length,
      receipts: receipts.length,
      qtyIn: receipts.reduce((sum, r) => sum + r.qty, 0),
      stockInValue: receipts.reduce((sum, r) => sum + r.total, 0),
    };
  });

  const filtered = data.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'All' || s.type === type;
    return matchSearch && matchType;
  });

  const chartData = data.map(s => ({ name: s.name, value: s.stockInValue })).filter(d => d.value > 0);
  const totalValue = data.reduce((s, x) => s + x.stockInValue, 0);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Supplier Wise Report"
        breadcrumbs={[{ label: 'Reports' }, { label: 'Supplier Wise' }]}
        secondaryActions={[{ label: 'Export', onClick: () => {} }]}
        badge={{ label: `${data.length} suppliers`, color: '#16A34A' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Active Suppliers', value: data.length, color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Total Procured', value: `₹${totalValue.toLocaleString()}`, color: '#16A34A', bg: '#DCFCE7' },
              { label: 'Equipment Suppliers', value: data.filter(s => s.type === 'Equipment').length, color: '#D97706', bg: '#FEF3C7' },
              { label: 'Fuel Suppliers', value: data.filter(s => s.type === 'Fuel').length, color: '#7C3AED', bg: '#F3E8FF' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border px-5 py-4" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-xs mb-2" style={{ color: '#64748B' }}>{s.label}</div>
                <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Donut */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Procurement Share</div>
              <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>By stock-in value</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" paddingAngle={3}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`₹${(v as number).toLocaleString()}`, 'Value']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 mt-2">
                {chartData.map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs" style={{ color: '#475569' }}>{s.name}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#0F172A' }}>
                      {totalValue ? `${((s.value / totalValue) * 100).toFixed(0)}%` : '0%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details table */}
            <div className="col-span-2 bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
                <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                  <Search size={14} style={{ color: '#94A3B8' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search supplier..." className="bg-transparent text-sm outline-none flex-1" />
                </div>
                <div className="flex items-center gap-1">
                  {['All', 'Equipment', 'Fuel'].map(t => (
                    <button key={t} onClick={() => setType(t)}
                      className="text-xs px-2.5 py-1.5 rounded-lg font-medium"
                      style={{ background: type === t ? '#2563EB' : '#F1F5F9', color: type === t ? 'white' : '#64748B' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['Supplier', 'Type', 'Items', 'Receipts', 'Qty In', 'Stock In Value', 'Share', 'Status'].map(h => (
                        <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, i) => {
                      const pct = totalValue ? (s.stockInValue / totalValue) * 100 : 0;
                      return (
                        <tr key={s.id} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                                style={{ background: s.type === 'Fuel' ? '#ECFEFF' : '#EFF6FF', color: s.type === 'Fuel' ? '#0891B2' : '#2563EB' }}>
                                <Truck size={14} />
                              </div>
                              <div>
                                <div className="font-medium" style={{ color: '#0F172A' }}>{s.name}</div>
                                <div className="text-[10px]" style={{ color: '#94A3B8' }}>{s.contactPerson}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3"><Badge label={s.type} variant={s.type === 'Fuel' ? 'purple' : 'info'} /></td>
                          <td className="px-3 py-3" style={{ color: '#475569' }}>{s.itemsCount}</td>
                          <td className="px-3 py-3" style={{ color: '#475569' }}>{s.receipts}</td>
                          <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>{s.qtyIn}</td>
                          <td className="px-3 py-3 font-semibold" style={{ color: '#16A34A' }}>₹{s.stockInValue.toLocaleString()}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2" style={{ minWidth: 80 }}>
                              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                              </div>
                              <span className="text-[10px] font-medium" style={{ color: '#64748B' }}>{pct.toFixed(0)}%</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <Badge label={s.status} variant="success" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

