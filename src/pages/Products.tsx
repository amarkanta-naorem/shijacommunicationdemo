import { useState } from 'react';
import { Search, SlidersHorizontal, Download, Plus, MoreHorizontal, AlertTriangle, Package, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Badge, { statusBadge } from '../components/Badge';
import { products } from '../data/mockData';

const suppliers = ['All', 'Mahindra', 'TMTL'];

const FORM_FIELDS = [
  { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Oil Filter - Mahindra 25kVA', required: true },
  { label: 'Part Number', key: 'partNumber', type: 'text', placeholder: 'e.g. OFL-M25', required: true },
  { label: 'Supplier', key: 'supplier', type: 'select', options: ['Mahindra', 'TMTL'], required: true },
  { label: 'Unit', key: 'unit', type: 'select', options: ['Pcs', 'Litre', 'Set'], required: true },
  { label: 'Min Stock', key: 'minStock', type: 'number', placeholder: '0', required: true },
  { label: 'Initial Stock', key: 'currentStock', type: 'number', placeholder: '0', required: true },
  { label: 'Unit Price (₹)', key: 'unitPrice', type: 'number', placeholder: '0.00', required: true },
];

export default function Products({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [supplier, setSupplier] = useState('All');
  const [selected, setSelected] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formState, setFormState] = useState<Record<string, string>>({});

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    const matchSup = supplier === 'All' || p.supplier === supplier;
    return matchSearch && matchCat && matchSup;
  });

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); }, 1800);
  };

  if (saved) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
        <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
      </div>
      <div className="text-lg font-semibold" style={{ color: '#0F172A' }}>Product Added</div>
      <div className="text-sm" style={{ color: '#64748B' }}>New product has been added to the inventory catalog.</div>
    </div>
  );

  if (showForm) return (
    <div className="flex flex-col h-full">
      <Header
        title="New Product"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Products' }, { label: 'Add Product' }]}
        secondaryActions={[{ label: 'Cancel', onClick: () => setShowForm(false) }]}
        primaryAction={{ label: 'Save Product', onClick: handleSave }}
      />
      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-6">
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Product Information</div>
            <div className="grid grid-cols-2 gap-4">
              {FORM_FIELDS.map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>
                    {f.label} {f.required && <span style={{ color: '#DC2626' }}>*</span>}
                  </label>
                  {f.type === 'select' ? (
                    <select
                      className="w-full text-sm border rounded-lg px-3 py-2 outline-none"
                      style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                      value={formState[f.key] || ''}
                      onChange={e => setFormState(s => ({ ...s, [f.key]: e.target.value }))}
                    >
                      <option value="">Select {f.label}</option>
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      className="w-full text-sm border rounded-lg px-3 py-2 outline-none"
                      style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                      value={formState[f.key] || ''}
                      onChange={e => setFormState(s => ({ ...s, [f.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
            {formState.minStock && formState.currentStock && (
              <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ background: parseFloat(formState.currentStock) < parseFloat(formState.minStock) ? '#FEF3C7' : '#F0FDF4', border: '1px solid #E2E8F0' }}>
                <AlertTriangle size={14} style={{ color: parseFloat(formState.currentStock) < parseFloat(formState.minStock) ? '#D97706' : '#16A34A' }} />
                <span className="text-xs" style={{ color: '#475569' }}>
                  {parseFloat(formState.currentStock) < parseFloat(formState.minStock)
                    ? 'This product will be flagged as Low Stock once saved.'
                    : 'Stock level is above the minimum threshold.'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Products"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Products' }]}
        primaryAction={{ label: 'Add Product', onClick: () => setShowForm(true) }}
        secondaryActions={[{ label: 'Import', onClick: () => {} }, { label: 'Export', onClick: () => {} }]}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* Filters */}
          <div className="bg-white rounded-xl border mb-0" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-lg px-3 py-2 border max-w-[20rem]" style={{ borderColor: '#E2E8F0' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by product name or Part Number..."
                  className="bg-transparent text-sm outline-none flex-1"
                  style={{ color: '#0F172A' }}
                />
              </div>
              <div className="flex items-center gap-2">
                {suppliers.map(s => (
                  <button key={s} onClick={() => setSupplier(s)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{
                      background: supplier === s ? '#0F172A' : '#F1F5F9',
                      color: supplier === s ? 'white' : '#64748B'
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {selected.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-2 text-xs" style={{ background: '#EFF6FF', borderBottom: '1px solid #DBEAFE' }}>
                <span style={{ color: '#1D4ED8' }}>{selected.length} selected</span>
                <button className="px-2 py-1 rounded" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>Export Selected</button>
                <button className="px-2 py-1 rounded" style={{ background: '#FEE2E2', color: '#DC2626' }}>Delete</button>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" className="rounded" />
                    </th>
                    {['Part Number', 'Product Name', 'Supplier', 'Unit', 'Min Stock', 'Current Stock', 'Unit Price', 'Location', 'Status', ''].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const isLow = p.currentStock < p.minStock;
                    return (
                      <tr key={p.id} className="border-t hover:bg-blue-50/30 transition-colors"
                        style={{ borderColor: '#F1F5F9' }}>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selected.includes(p.id)}
                            onChange={() => toggleSelect(p.id)} className="rounded" />
                        </td>
                        <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{p.sku}</td>
                        <td className="px-3 py-3">
                          <div className="font-medium" style={{ color: '#0F172A' }}>{p.name}</div>
                        </td>
                        <td className="px-3 py-3" style={{ color: '#475569' }}>{p.supplier}</td>
                        <td className="px-3 py-3" style={{ color: '#475569' }}>{p.unit}</td>
                        <td className="px-3 py-3" style={{ color: '#475569' }}>{p.minStock}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            {isLow && <AlertTriangle size={12} style={{ color: '#DC2626' }} />}
                            <span className="font-semibold" style={{ color: isLow ? '#DC2626' : '#16A34A' }}>
                              {p.currentStock}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>₹{p.unitPrice.toLocaleString()}</td>
                        <td className="px-3 py-3" style={{ color: '#64748B' }}>{p.location}</td>
                        <td className="px-3 py-3">
                          {isLow
                            ? <Badge label="Low Stock" variant="danger" />
                            : <Badge label="In Stock" variant="success" />}
                        </td>
                        <td className="px-3 py-3">
                          <button className="p-1 rounded hover:bg-gray-100">
                            <MoreHorizontal size={15} style={{ color: '#94A3B8' }} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#F1F5F9' }}>
              <span className="text-xs" style={{ color: '#94A3B8' }}>Showing {filtered.length} of {products.length} products</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(p => (
                  <button key={p} className="w-7 h-7 rounded text-xs font-medium"
                    style={{ background: p === 1 ? '#2563EB' : '#F1F5F9', color: p === 1 ? 'white' : '#475569' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
