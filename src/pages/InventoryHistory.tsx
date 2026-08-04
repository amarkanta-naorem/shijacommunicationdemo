import { useState } from 'react';
import { Search, ArrowDownToLine, ArrowUpFromLine, MoreHorizontal, Droplets, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { inventoryHistory, products } from '../data/mockData';

type TxnType = 'all' | 'in' | 'out' | 'wastage';

function warrantyForSku(sku: string) {
  const p = products.find(x => x.sku === sku);
  if (!p) return null;
  const w = p.warranty;
  if (!w || (!w.durationMonths && !w.durationYears)) return null;
  const today = new Date().toISOString().slice(0, 10);
  const end = w.extendedUntil && w.isExtended ? w.extendedUntil : w.endDate;
  if (end && end < today) return { active: false, end };
  return { active: true, end };
}

export default function InventoryHistory() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<TxnType>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = inventoryHistory.filter(t => {
    const matchSearch =
      t.product.toLowerCase().includes(search.toLowerCase()) ||
      t.sku.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.person.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'all' || t.type === type;
    const matchDate = (!dateFrom || t.date >= dateFrom) && (!dateTo || t.date <= dateTo);
    return matchSearch && matchType && matchDate;
  });

  const totalIn = inventoryHistory.filter(t => t.type === 'in').reduce((s, t) => s + t.total, 0);
  const totalOut = inventoryHistory.filter(t => t.type === 'out').reduce((s, t) => s + t.total, 0);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Inventory History"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'History' }]}
        secondaryActions={[{ label: 'Export CSV', onClick: () => {} }]}
        badge={{ label: `${inventoryHistory.length} records`, color: '#2563EB' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Total In Value', value: `₹${totalIn.toLocaleString()}`, color: '#16A34A', bg: '#DCFCE7' },
              { label: 'Total Out Value', value: `₹${totalOut.toLocaleString()}`, color: '#DC2626', bg: '#FEE2E2' },
              { label: 'Net Movement', value: `₹${(totalIn - totalOut).toLocaleString()}`, color: totalIn - totalOut >= 0 ? '#2563EB' : '#D97706', bg: '#EFF6FF' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-lg border px-4 py-3 flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
                <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: s.bg }}>
                  {i === 0 ? <ArrowDownToLine size={15} style={{ color: s.color }} /> :
                    i === 1 ? <ArrowUpFromLine size={15} style={{ color: s.color }} /> :
                      <MoreHorizontal size={15} style={{ color: s.color }} />}
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: '#0F172A' }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 min-w-50 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search product, Part Number, ID or person..." className="bg-transparent text-sm outline-none flex-1" />
              </div>
              <div className="flex items-center gap-1">
                {([['all', 'All'], ['in', 'In'], ['out', 'Out'], ['wastage', 'Wastage']] as [TxnType, string][]).map(([v, label]) => (
                  <button key={v} onClick={() => setType(v)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{ background: type === v ? '#2563EB' : '#F1F5F9', color: type === v ? 'white' : '#64748B' }}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="text-xs border rounded-lg px-2.5 py-1.5 outline-none" style={{ borderColor: '#E2E8F0' }} />
                <span className="text-xs" style={{ color: '#94A3B8' }}>→</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="text-xs border rounded-lg px-2.5 py-1.5 outline-none" style={{ borderColor: '#E2E8F0' }} />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Transaction ID', 'Date', 'Type', 'Product', 'Part Number', 'Qty', 'Unit Price', 'Total', 'Party', 'Reference', 'By', ''].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id + t.type} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}>
                      <td className="px-3 py-3 font-mono font-medium" style={{ color: t.type === 'in' ? '#2563EB' : '#DC2626' }}>{t.id}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.date}</td>
                      <td className="px-3 py-3">
                        {t.type === 'in'
                          ? <Badge label="Stock In" variant="success" />
                          : t.type === 'out'
                            ? <Badge label="Stock Out" variant="danger" />
                            : <Badge label="Wastage" variant="warning" />}
</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium" style={{ color: '#0F172A' }}>{t.product}</span>
                          {warrantyForSku(t.sku) && (
                            <span title={`Warranty ${warrantyForSku(t.sku)!.active ? 'active' : 'expired'} — ends ${warrantyForSku(t.sku)!.end}`}
                              style={{ color: warrantyForSku(t.sku)!.active ? '#16A34A' : '#DC2626', display: 'inline-flex' }}>
                              <ShieldCheck size={12} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{t.sku}</td>
                      <td className="px-3 py-3 font-semibold" style={{ color: t.type === 'in' ? '#16A34A' : '#DC2626' }}>
                        {t.type === 'in' ? `+${t.qty}` : `-${t.qty}`}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>₹{t.unitPrice}</td>
                      <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>₹{t.total.toLocaleString()}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.party}</td>
                      <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{t.ref}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.person}</td>
                      <td className="px-3 py-3">
                        <button className="p-1 rounded hover:bg-gray-100">
                          <MoreHorizontal size={15} style={{ color: '#94A3B8' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#F1F5F9' }}>
              <span className="text-xs" style={{ color: '#94A3B8' }}>Showing {filtered.length} of {inventoryHistory.length} records</span>
              <div className="flex items-center gap-1">
                {[1, 2].map(p => (
                  <button key={p} className="w-7 h-7 rounded text-xs font-medium"
                    style={{ background: p === 1 ? '#2563EB' : '#F1F5F9', color: p === 1 ? 'white' : '#475569' }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

