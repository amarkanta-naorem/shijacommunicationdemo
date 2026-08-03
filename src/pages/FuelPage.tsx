import { useState } from 'react';
import { Search, ArrowDownToLine, ArrowUpFromLine, CheckCircle2, Droplets, TrendingDown } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { fuelTransactions } from '../data/mockData';

type View = 'in' | 'out' | 'history';

interface Props { view: View }

const FuelInForm = ({ onSave }: { onSave: () => void }) => {
  const [form, setForm] = useState({ fuelType: 'Diesel', supplier: '', invoiceNo: '', invoiceQty: '', actualQty: '', tankBefore: '', receivedBy: '', date: '', remarks: '' });
  const lossQty = form.invoiceQty && form.actualQty ? parseFloat(form.invoiceQty) - parseFloat(form.actualQty) : 0;
  const tankAfter = form.actualQty && form.tankBefore ? parseFloat(form.tankBefore) + parseFloat(form.actualQty) : 0;

  const fields = [
    { label: 'Fuel Type', key: 'fuelType', type: 'select', options: ['Diesel', 'S/K'] },
    { label: 'Supplier', key: 'supplier', type: 'text', placeholder: 'e.g. Bharat Petroleum' },
    { label: 'Invoice No.', key: 'invoiceNo', type: 'text', placeholder: 'e.g. BP-INV-8900' },
    { label: 'Date', key: 'date', type: 'date' },
    { label: 'Invoice Quantity (L)', key: 'invoiceQty', type: 'number', placeholder: '0' },
    { label: 'Actual Quantity (L)', key: 'actualQty', type: 'number', placeholder: '0' },
    { label: 'Tank Reading Before (L)', key: 'tankBefore', type: 'number', placeholder: '0' },
    { label: 'Received By', key: 'receivedBy', type: 'text', placeholder: 'Full name' },
  ];

  return (
    <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
      <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Fuel Receipt Entry</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>{f.label}</label>
            {f.type === 'select' ? (
              <select className="w-full text-sm border rounded-lg px-3 py-2 outline-none" style={{ borderColor: '#E2E8F0' }}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(s => ({ ...s, [f.key]: e.target.value }))}>
                {f.options?.map(o => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type} placeholder={f.placeholder}
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none"
                style={{ borderColor: '#E2E8F0' }}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(s => ({ ...s, [f.key]: e.target.value }))} />
            )}
          </div>
        ))}
      </div>

      {/* Auto-calculated */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-lg mb-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <div>
          <div className="text-xs" style={{ color: '#64748B' }}>Loss Quantity</div>
          <div className="text-lg font-bold mt-1" style={{ color: lossQty > 0 ? '#DC2626' : '#0F172A' }}>
            {lossQty > 0 ? `-${lossQty}` : '0'} L
          </div>
          <div className="text-xs" style={{ color: '#94A3B8' }}>Auto calculated</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: '#64748B' }}>Tank Reading After</div>
          <div className="text-lg font-bold mt-1" style={{ color: '#16A34A' }}>{tankAfter} L</div>
          <div className="text-xs" style={{ color: '#94A3B8' }}>Auto calculated</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: '#64748B' }}>Loss %</div>
          <div className="text-lg font-bold mt-1" style={{ color: lossQty > 0 ? '#D97706' : '#0F172A' }}>
            {form.invoiceQty ? ((lossQty / parseFloat(form.invoiceQty)) * 100).toFixed(2) : '0.00'}%
          </div>
          <div className="text-xs" style={{ color: '#94A3B8' }}>Of invoice</div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>Remarks</label>
        <textarea rows={2} placeholder="Optional notes..."
          className="w-full text-sm border rounded-lg px-3 py-2 outline-none resize-none" style={{ borderColor: '#E2E8F0' }} />
      </div>

      <button onClick={onSave} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#2563EB', color: 'white' }}>
        Save Fuel Receipt
      </button>
    </div>
  );
};

const FuelOutForm = ({ onSave }: { onSave: () => void }) => {
  const fields = [
    { label: 'Fuel Type', type: 'select', options: ['Diesel', 'S/K'] },
    { label: 'Quantity (L)', type: 'number', placeholder: '0' },
    { label: 'Date', type: 'date' },
    { label: 'Time', type: 'time' },
    { label: 'Person Receiving', type: 'text', placeholder: 'Full name' },
    { label: 'Department', type: 'text', placeholder: 'e.g. Maintenance' },
    { label: 'Machine / Vehicle / Generator', type: 'text', placeholder: 'e.g. DG-G12 or Vehicle-04' },
    { label: 'Remarks', type: 'text', placeholder: 'Optional' },
  ];

  return (
    <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
      <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Fuel Issue Entry</div>

      {/* Current stock display */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[{ label: 'Diesel Stock', value: '1,035 L', color: '#7C3AED', bg: '#F3E8FF' }, { label: 'S/K Stock', value: '223 L', color: '#0891B2', bg: '#ECFEFF' }].map(s => (
          <div key={s.label} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: '#E2E8F0', background: s.bg }}>
            <Droplets size={18} style={{ color: s.color }} />
            <div>
              <div className="text-xs" style={{ color: s.color }}>{s.label}</div>
              <div className="text-base font-bold" style={{ color: '#0F172A' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {fields.map(f => (
          <div key={f.label}>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>{f.label}</label>
            {f.type === 'select' ? (
              <select className="w-full text-sm border rounded-lg px-3 py-2 outline-none" style={{ borderColor: '#E2E8F0' }}>
                {f.options?.map(o => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type} placeholder={f.placeholder}
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none" style={{ borderColor: '#E2E8F0' }} />
            )}
          </div>
        ))}
      </div>

      <button onClick={onSave} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#7C3AED', color: 'white' }}>
        Issue Fuel
      </button>
    </div>
  );
};

export default function FuelPage({ view }: Props) {
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');

  const titleMap = { in: 'Fuel In', out: 'Fuel Out', history: 'Fuel History' };
  const breadcrumb = { in: 'Fuel In', out: 'Fuel Out', history: 'Fuel History' };

  const filtered = fuelTransactions.filter(t =>
    (view === 'history' || t.type === view) &&
    JSON.stringify(t).toLowerCase().includes(search.toLowerCase())
  );

  if (saved) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
        <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
      </div>
      <div className="text-lg font-semibold" style={{ color: '#0F172A' }}>
        {view === 'in' ? 'Fuel Receipt Recorded' : 'Fuel Issued'}
      </div>
      <div className="text-sm" style={{ color: '#64748B' }}>Stock has been updated in real time.</div>
      <button onClick={() => setSaved(false)} className="text-sm px-4 py-2 rounded-lg font-medium" style={{ background: '#2563EB', color: 'white' }}>
        Record Another
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        title={titleMap[view]}
        breadcrumbs={[{ label: 'Fuel' }, { label: breadcrumb[view] }]}
        primaryAction={view !== 'history' ? { label: view === 'in' ? 'New Receipt' : 'Issue Fuel', onClick: () => {} } : undefined}
        secondaryActions={[{ label: 'Export', onClick: () => {} }]}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {view === 'in' && <FuelInForm onSave={() => setSaved(true)} />}
          {view === 'out' && <FuelOutForm onSave={() => setSaved(true)} />}
          {view === 'history' && (
            <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
                <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                  <Search size={14} style={{ color: '#94A3B8' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search fuel transactions..."
                    className="bg-transparent text-sm outline-none flex-1" />
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
                    {filtered.map(t => (
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
                          {t.type === 'in' ? `Loss: ${(t as any).lossQty}L · Invoice: ${(t as any).invoiceQty}L` : (t as any).machine || (t as any).department}
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
          )}
        </div>
      </div>
    </div>
  );
}
