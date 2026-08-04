import { useState } from 'react';
import { Search, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { products } from '../data/mockData';

function warrantyStatus(p: any) {
  const w = p.warranty;
  if (!w || (!w.durationMonths && !w.durationYears)) return null;
  const today = new Date().toISOString().slice(0, 10);
  const end = w.extendedUntil && w.isExtended ? w.extendedUntil : w.endDate;
  if (end && end < today) return { active: false, end };
  return { active: true, end };
}

export default function CurrentStock() {
  const [search, setSearch] = useState('');
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Current Stock"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Current Stock' }]}
        secondaryActions={[{ label: 'Export', onClick: () => {} }]}
        badge={{ label: `${products.filter(p => p.currentStock < p.minStock).length} low stock`, color: '#DC2626' }}
      />
      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Total Products', value: products.length, sub: 'Active products', color: '#2563EB', bg: '#EFF6FF' },
              { label: 'In Stock', value: products.filter(p => p.currentStock >= p.minStock).length, sub: 'Above minimum', color: '#16A34A', bg: '#DCFCE7' },
              { label: 'Low / Critical', value: products.filter(p => p.currentStock < p.minStock).length, sub: 'Below minimum threshold', color: '#DC2626', bg: '#FEE2E2' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border px-5 py-4" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-xs mb-2" style={{ color: '#64748B' }}>{s.label}</div>
                <div className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: '#94A3B8' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search product or Part Number..." className="bg-transparent text-sm outline-none flex-1" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Part Number', 'Product', 'Unit', 'Min. Stock', 'Current Stock', 'Stock Health', 'Unit Value', 'Total Value', 'Location'].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const pct = Math.min(100, (p.currentStock / (p.minStock * 3)) * 100);
                    const isLow = p.currentStock < p.minStock;
                    const isCritical = p.currentStock <= 1;
                    return (
<tr key={p.id} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}>
                        <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{p.sku}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="font-medium" style={{ color: '#0F172A' }}>{p.name}</div>
                            {warrantyStatus(p) && (
                              <span title={`Warranty ${warrantyStatus(p)!.active ? 'active' : 'expired'} — ends ${warrantyStatus(p)!.end}`}
                                style={{ color: warrantyStatus(p)!.active ? '#16A34A' : '#DC2626', display: 'inline-flex' }}>
                                <ShieldCheck size={12} />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {isCritical && <AlertTriangle size={10} style={{ color: '#DC2626' }} />}
                            {isCritical && <span className="text-xs" style={{ color: '#DC2626' }}>Critical</span>}
                          </div>
                        </td>
                        <td className="px-3 py-3" style={{ color: '#475569' }}>{p.unit}</td>
                        <td className="px-3 py-3" style={{ color: '#475569' }}>{p.minStock}</td>
                        <td className="px-3 py-3">
                          <span className="font-bold text-sm" style={{ color: isLow ? '#DC2626' : '#16A34A' }}>{p.currentStock}</span>
                        </td>
                        <td className="px-3 py-3" style={{ minWidth: 120 }}>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                              <div className="h-full rounded-full"
                                style={{ width: `${pct}%`, background: isLow ? '#DC2626' : '#16A34A' }} />
                            </div>
                            <span className="text-xs" style={{ color: isLow ? '#DC2626' : '#16A34A' }}>{Math.round(pct)}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3" style={{ color: '#475569' }}>₹{p.unitPrice.toLocaleString()}</td>
                        <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>₹{(p.unitPrice * p.currentStock).toLocaleString()}</td>
                        <td className="px-3 py-3" style={{ color: '#64748B' }}>{p.location}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                    <td colSpan={8} className="px-3 py-3 text-right text-xs font-semibold" style={{ color: '#475569' }}>Total Inventory Value</td>
                    <td className="px-3 py-3 text-sm font-bold" style={{ color: '#2563EB' }}>
                      ₹{products.reduce((sum, p) => sum + p.unitPrice * p.currentStock, 0).toLocaleString()}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
