import { useState } from 'react';
import { Search, ArrowDownToLine, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { stockInTransactions } from '../data/mockData';

const FIELDS = [
  { label: 'Supplier', type: 'select', options: ['Mahindra', 'TMTL'], required: true },
  { label: 'Invoice No.', type: 'text', placeholder: 'e.g. INV-MH-4530', required: true },
  { label: 'Invoice Date', type: 'date', required: true },
  { label: 'Received By', type: 'text', placeholder: 'Full name', required: true },
  { label: 'Remarks', type: 'textarea', placeholder: 'Optional notes about this receipt' },
];

export default function StockIn() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [items, setItems] = useState([{ product: '', qty: '', unitPrice: '' }]);
  const [saved, setSaved] = useState(false);

  const addItem = () => setItems(prev => [...prev, { product: '', qty: '', unitPrice: '' }]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); }, 1800);
  };

  const filtered = stockInTransactions.filter(t =>
    t.product.toLowerCase().includes(search.toLowerCase()) ||
    t.invoiceNo.toLowerCase().includes(search.toLowerCase())
  );

  if (saved) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
        <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
      </div>
      <div className="text-lg font-semibold" style={{ color: '#0F172A' }}>Stock Receipt Saved</div>
      <div className="text-sm" style={{ color: '#64748B' }}>Inventory has been updated. Stock In record created.</div>
    </div>
  );

  if (showForm) return (
    <div className="flex flex-col h-full">
      <Header
        title="New Stock In"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock In' }, { label: 'New Receipt' }]}
        secondaryActions={[{ label: 'Cancel', onClick: () => setShowForm(false) }]}
        primaryAction={{ label: 'Save Receipt', onClick: handleSave }}
      />
      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-6 max-w-3xl">
          <div className="bg-white rounded-xl border p-6 mb-4" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Receipt Information</div>
            <div className="grid grid-cols-2 gap-4">
              {FIELDS.filter(f => f.type !== 'textarea').map(f => (
                <div key={f.label}>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>
                    {f.label} {f.required && <span style={{ color: '#DC2626' }}>*</span>}
                  </label>
                  {f.type === 'select' ? (
                    <select className="w-full text-sm border rounded-lg px-3 py-2 outline-none"
                      style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                      value={formState[f.label] || ''}
                      onChange={e => setFormState(s => ({ ...s, [f.label]: e.target.value }))}>
                      <option value="">Select {f.label}</option>
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} placeholder={f.placeholder}
                      className="w-full text-sm border rounded-lg px-3 py-2 outline-none"
                      style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                      value={formState[f.label] || ''}
                      onChange={e => setFormState(s => ({ ...s, [f.label]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>Remarks</label>
              <textarea rows={2} placeholder="Optional notes..."
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none resize-none"
                style={{ borderColor: '#E2E8F0', color: '#0F172A' }} />
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Line Items</div>
              <button onClick={addItem} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                + Add Item
              </button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Product', 'Part Number', 'Quantity', 'Unit Price (₹)', 'Total (₹)'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: '#64748B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: '#F1F5F9' }}>
                    <td className="px-3 py-2">
                      <select className="w-full border rounded-md px-2 py-1.5 text-xs outline-none" style={{ borderColor: '#E2E8F0' }}>
                        <option value="">Select product</option>
                        <option>Oil Filter - Mahindra 25kVA</option>
                        <option>Fuel Filter - TMTL 30kVA</option>
                        <option>Engine Oil 15W40 - 5L</option>
                        <option>Battery 12V 150Ah</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input placeholder="Auto" className="w-24 border rounded-md px-2 py-1.5 text-xs outline-none" style={{ borderColor: '#E2E8F0', color: '#94A3B8' }} disabled />
                    </td>
                    <td className="px-3 py-2">
                      <input type="number" placeholder="0" className="w-20 border rounded-md px-2 py-1.5 text-xs outline-none" style={{ borderColor: '#E2E8F0' }}
                        value={item.qty} onChange={e => setItems(prev => prev.map((it, j) => j === i ? { ...it, qty: e.target.value } : it))} />
                    </td>
                    <td className="px-3 py-2">
                      <input type="number" placeholder="0.00" className="w-24 border rounded-md px-2 py-1.5 text-xs outline-none" style={{ borderColor: '#E2E8F0' }}
                        value={item.unitPrice} onChange={e => setItems(prev => prev.map((it, j) => j === i ? { ...it, unitPrice: e.target.value } : it))} />
                    </td>
                    <td className="px-3 py-2 font-semibold" style={{ color: '#0F172A' }}>
                      {item.qty && item.unitPrice ? `₹${(parseFloat(item.qty) * parseFloat(item.unitPrice)).toLocaleString()}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t" style={{ borderColor: '#E2E8F0' }}>
                  <td colSpan={4} className="px-3 py-2 text-right font-semibold text-sm" style={{ color: '#0F172A' }}>Grand Total</td>
                  <td className="px-3 py-2 font-bold text-sm" style={{ color: '#2563EB' }}>
                    ₹{items.reduce((sum, it) => sum + (parseFloat(it.qty || '0') * parseFloat(it.unitPrice || '0')), 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Stock In"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock In' }]}
        primaryAction={{ label: 'New Receipt', onClick: () => setShowForm(true) }}
        secondaryActions={[{ label: 'Export CSV', onClick: () => {} }]}
        badge={{ label: `${stockInTransactions.length} records`, color: '#16A34A' }}
      />
      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by product or invoice..." className="bg-transparent text-sm outline-none flex-1" />
              </div>
              <input type="date" className="text-xs border rounded-lg px-3 py-2 outline-none" style={{ borderColor: '#E2E8F0' }} />
              <input type="date" className="text-xs border rounded-lg px-3 py-2 outline-none" style={{ borderColor: '#E2E8F0' }} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Receipt ID', 'Date', 'Product', 'Part Number', 'Qty', 'Unit Price', 'Total', 'Supplier', 'Invoice No.', 'Received By', 'Status', ''].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id} className="border-t hover:bg-blue-50/30 transition-colors" style={{ borderColor: '#F1F5F9' }}>
                      <td className="px-3 py-3 font-mono font-medium" style={{ color: '#2563EB' }}>{t.id}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.date}</td>
                      <td className="px-3 py-3 font-medium" style={{ color: '#0F172A' }}>{t.product}</td>
                      <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{t.sku}</td>
                      <td className="px-3 py-3 font-semibold" style={{ color: '#16A34A' }}>+{t.qty}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>₹{t.unitPrice}</td>
                      <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>₹{t.total.toLocaleString()}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.supplier}</td>
                      <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{t.invoiceNo}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.receivedBy}</td>
                      <td className="px-3 py-3"><Badge label={t.status} variant="success" /></td>
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
            <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#F1F5F9' }}>
              <span className="text-xs" style={{ color: '#94A3B8' }}>Showing {filtered.length} of {stockInTransactions.length} records</span>
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
