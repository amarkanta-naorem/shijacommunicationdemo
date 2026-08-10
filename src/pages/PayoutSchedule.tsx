import { useState } from 'react';
import { Search, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { products } from '../data/mockData';

const STATUS_OPTIONS = ['pending', 'processed', 'overdue', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: '#D97706', processed: '#16A34A', overdue: '#DC2626', cancelled: '#94A3B8'
};

export default function PayoutSchedule({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formState, setFormState] = useState<Record<string, string>>({});

  const payouts = products
    .filter(p => p.payoutSchedule && p.payoutSchedule.amount > 0)
    .map(p => ({
      id: `PY-${p.id}`,
      productName: p.name,
      sku: p.sku,
      payoutDate: p.payoutSchedule.payoutDate,
      payoutType: p.payoutSchedule.payoutType,
      amount: p.payoutSchedule.amount,
      status: p.payoutSchedule.status,
      paymentMethod: p.payoutSchedule.paymentMethod,
      referenceNumber: p.payoutSchedule.referenceNumber,
      notes: p.payoutSchedule.notes,
    }));

  const filtered = payouts.filter(p => {
    const matchSearch = p.productName.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.referenceNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (saved) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
        <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
      </div>
      <div className="text-lg font-semibold" style={{ color: '#0F172A' }}>Payout Record Saved</div>
      <div className="text-sm" style={{ color: '#64748B' }}>Payout schedule has been updated.</div>
    </div>
  );

  if (showForm) return (
    <div className="flex flex-col h-full">
      <Header
        title="New Payout Record"
        breadcrumbs={[{ label: 'Finance' }, { label: 'Payout Schedule' }, { label: 'New Record' }]}
        secondaryActions={[{ label: 'Cancel', onClick: () => setShowForm(false) }]}
        primaryAction={{ label: 'Save Payout', onClick: () => setSaved(true) }}
      />
      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-6">
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Payout Details</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Product', key: 'productName', type: 'text', placeholder: 'Product name', required: true },
                { label: 'Payout Date', key: 'payoutDate', type: 'date', required: true },
                { label: 'Payout Type', key: 'payoutType', type: 'select', options: ['full', 'partial', 'installment'], required: true },
                { label: 'Amount (₹)', key: 'amount', type: 'number', placeholder: '0.00', required: true },
                { label: 'Status', key: 'status', type: 'select', options: STATUS_OPTIONS, required: true },
                { label: 'Payment Method', key: 'paymentMethod', type: 'text', placeholder: 'e.g. Net Banking', required: true },
                { label: 'Reference Number', key: 'referenceNumber', type: 'text', placeholder: 'e.g. PO-2026-001', required: true },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>
                    {f.label} {f.required && <span style={{ color: '#DC2626' }}>*</span>}
                  </label>
                  {f.type === 'select' ? (
                    <select
                      className="w-full text-sm border rounded-lg px-3 py-2 outline-none"
                      style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                      value={formState[f.key] || ''}
                      onChange={e => setFormState(s => ({ ...s, [f.key]: e.target.value }))}>
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
                      onChange={e => setFormState(s => ({ ...s, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>Notes</label>
              <textarea rows={2} placeholder="Optional notes..."
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none resize-none"
                style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                value={formState.notes || ''}
                onChange={e => setFormState(s => ({ ...s, notes: e.target.value }))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Payout Schedule"
        breadcrumbs={[{ label: 'Finance' }, { label: 'Payout Schedule' }]}
        primaryAction={{ label: 'New Payout', onClick: () => setShowForm(true) }}
        secondaryActions={[{ label: 'Export CSV', onClick: () => {} }]}
        badge={{ label: `${payouts.length} records`, color: '#2563EB' }}
      />
      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by product, SKU, or reference..." className="bg-transparent text-sm outline-none flex-1" />
              </div>
              <div className="flex items-center gap-1">
                {(['All', ...STATUS_OPTIONS] as string[]).map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{
                      background: statusFilter === s ? '#0F172A' : '#F1F5F9',
                      color: statusFilter === s ? 'white' : '#64748B'
                    }}>
                    {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['ID', 'Product', 'SKU', 'Payout Date', 'Type', 'Amount (₹)', 'Status', 'Payment Method', 'Reference', ''].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-t hover:bg-blue-50/30 transition-colors" style={{ borderColor: '#F1F5F9' }}>
                      <td className="px-3 py-3 font-mono" style={{ color: '#2563EB' }}>{p.id}</td>
                      <td className="px-3 py-3 font-medium" style={{ color: '#0F172A' }}>{p.productName}</td>
                      <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{p.sku}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{p.payoutDate}</td>
                      <td className="px-3 py-3"><Badge label={p.payoutType} variant="info" /></td>
                      <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>₹{p.amount.toLocaleString()}</td>
                      <td className="px-3 py-3">
                        <Badge label={p.status} variant={p.status === 'processed' ? 'success' : p.status === 'overdue' ? 'danger' : p.status === 'cancelled' ? 'gray' : 'warning'} />
                      </td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{p.paymentMethod}</td>
                      <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{p.referenceNumber}</td>
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
              <span className="text-xs" style={{ color: '#94A3B8' }}>Showing {filtered.length} of {payouts.length} records</span>
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