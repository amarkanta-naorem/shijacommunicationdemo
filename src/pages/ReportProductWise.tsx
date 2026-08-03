import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Package, TrendingUp, FileDown } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { products, stockInTransactions, stockOutTransactions } from '../data/mockData';

export default function ReportProductWise() {
  const [search, setSearch] = useState('');

  const data = products.map(p => {
    const inTx = stockInTransactions.filter(t => t.sku === p.sku).reduce((s, t) => s + t.qty, 0);
    const outTx = stockOutTransactions.filter(t => t.sku === p.sku).reduce((s, t) => s + t.qty, 0);
    const inVal = stockInTransactions.filter(t => t.sku === p.sku).reduce((s, t) => s + t.total, 0);
    const outVal = stockOutTransactions.filter(t => t.sku === p.sku).reduce((s, t) => s + t.total, 0);
    return { ...p, stockIn: inTx, stockOut: outTx, inValue: inVal, outValue: outVal };
  });

  const filtered = data.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = data.map(p => ({ name: p.sku, 'Stock In': p.stockIn, 'Stock Out': p.stockOut }));

  const totalIn = data.reduce((s, p) => s + p.inValue, 0);
  const totalOut = data.reduce((s, p) => s + p.outValue, 0);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Product Wise Report"
        breadcrumbs={[{ label: 'Reports' }, { label: 'Product Wise' }]}
        secondaryActions={[{ label: 'Export', onClick: () => {} }]}
        badge={{ label: `${data.length} products`, color: '#2563EB' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Products Tracked', value: data.length, color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Total Stock In (₹)', value: `₹${totalIn.toLocaleString()}`, color: '#16A34A', bg: '#DCFCE7' },
              { label: 'Total Stock Out (₹)', value: `₹${totalOut.toLocaleString()}`, color: '#DC2626', bg: '#FEE2E2' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border px-5 py-4 flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                  {i === 0 ? <Package size={16} style={{ color: s.color }} /> : <TrendingUp size={16} style={{ color: s.color }} />}
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color: '#0F172A' }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Movement chart */}
          <div className="bg-white rounded-xl border p-5 mb-4" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Movement by Product</div>
            <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>Units in vs out (July)</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="Stock In" fill="#2563EB" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Stock Out" fill="#DC2626" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search product or Part Number..." className="bg-transparent text-sm outline-none flex-1" />
              </div>
              <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#2563EB' }}>
                <FileDown size={12} /> Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Part Number', 'Product', 'Category', 'Stock In (Qty)', 'Stock In (₹)', 'Stock Out (Qty)', 'Stock Out (₹)', 'Current Stock', 'Status'].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}>
                      <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{p.sku}</td>
                      <td className="px-3 py-3 font-medium" style={{ color: '#0F172A' }}>{p.name}</td>
                      <td className="px-3 py-3"><Badge label={p.category} variant={p.category === 'PM' ? 'info' : 'warning'} /></td>
                      <td className="px-3 py-3 font-semibold" style={{ color: '#16A34A' }}>+{p.stockIn}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>₹{p.inValue.toLocaleString()}</td>
                      <td className="px-3 py-3 font-semibold" style={{ color: '#DC2626' }}>-{p.stockOut}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>₹{p.outValue.toLocaleString()}</td>
                      <td className="px-3 py-3 font-semibold" style={{ color: p.currentStock < p.minStock ? '#DC2626' : '#0F172A' }}>{p.currentStock}</td>
                      <td className="px-3 py-3">
                        {p.currentStock < p.minStock ? <Badge label="Low" variant="danger" /> : <Badge label="OK" variant="success" />}
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

