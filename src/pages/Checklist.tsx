import { useState } from 'react';
import { CheckCircle2, Package, Camera, PenLine, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { checklistItems, products } from '../data/mockData';

const STATUS_OPTIONS = ['OK', 'Checked', 'Cleaned', 'Replaced', 'Corrected', 'Tightened', 'Not Required'];
const STATUS_COLORS: Record<string, string> = {
  'OK': '#16A34A', 'Checked': '#2563EB', 'Cleaned': '#0891B2',
  'Replaced': '#DC2626', 'Corrected': '#D97706', 'Tightened': '#7C3AED', 'Not Required': '#94A3B8'
};

export default function Checklist({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [spareParts, setSpareParts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState<'info' | 'checklist' | 'parts' | 'sign'>('info');
  const [genInfo, setGenInfo] = useState({ generator: 'DG-G12', site: 'Site A - Block 3', technician: 'Amit Verma', runHours: '2400', date: '2025-07-30' });

  const setStatus = (id: string, val: string) => {
    setStatuses(prev => ({ ...prev, [id]: val }));
    if (val === 'Replaced') {
      const item = checklistItems.find(c => c.id === id);
      const match = products.find(p => p.name.toLowerCase().includes(item?.component.toLowerCase().split(' ')[0] ?? ''));
      if (match) setSpareParts(prev => ({ ...prev, [id]: match.id }));
    }
  };

  const replacedItems = checklistItems.filter(c => statuses[c.id] === 'Replaced');
  const completed = Object.keys(statuses).length;

  const categories = [...new Set(checklistItems.map(c => c.category))];

  if (saved) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
        <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
      </div>
      <div className="text-lg font-semibold" style={{ color: '#0F172A' }}>Maintenance Completed</div>
      <div className="text-sm text-center max-w-sm" style={{ color: '#64748B' }}>
        Work order WO-2025-089 has been closed. {replacedItems.length} parts deducted from inventory automatically.
      </div>
      <button onClick={() => onNavigate('preventive-maintenance')}
        className="text-sm px-4 py-2 rounded-lg font-medium"
        style={{ background: '#2563EB', color: 'white' }}>
        Return to Work Orders
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Digital Maintenance Checklist"
        breadcrumbs={[{ label: 'Maintenance' }, { label: 'Checklist' }, { label: 'WO-2025-089' }]}
        badge={{ label: 'Preventive Maintenance', color: '#2563EB' }}
        secondaryActions={[{ label: 'Save Draft', onClick: () => {} }]}
        primaryAction={{ label: 'Complete & Close', onClick: () => setSaved(true) }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4 max-w-4xl">

          {/* Steps */}
          <div className="flex items-center gap-2 mb-6">
            {['info', 'checklist', 'parts', 'sign'].map((s, i) => {
              const labels = ['Generator Info', 'Inspection', 'Parts Used', 'Sign & Close'];
              const active = s === step;
              const done = ['info', 'checklist', 'parts', 'sign'].indexOf(step) > i;
              return (
                <div key={s} className="flex items-center gap-2">
                  <button onClick={() => setStep(s as any)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{
                      background: active ? '#2563EB' : done ? '#DCFCE7' : '#F1F5F9',
                      color: active ? 'white' : done ? '#16A34A' : '#64748B'
                    }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ background: active ? 'rgba(255,255,255,0.2)' : done ? '#16A34A' : '#CBD5E1', color: active ? 'white' : done ? 'white' : '#475569' }}>
                      {done ? '✓' : i + 1}
                    </span>
                    {labels[i]}
                  </button>
                  {i < 3 && <ChevronRight size={14} style={{ color: '#CBD5E1' }} />}
                </div>
              );
            })}
          </div>

          {step === 'info' && (
            <div className="bg-white rounded-xl border p-6 mb-4" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Generator & Site Information</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Generator', key: 'generator' },
                  { label: 'Site', key: 'site' },
                  { label: 'Technician', key: 'technician' },
                  { label: 'Running Hours', key: 'runHours' },
                  { label: 'Date', key: 'date' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>{f.label}</label>
                    <input
                      value={genInfo[f.key as keyof typeof genInfo]}
                      onChange={e => setGenInfo(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full text-sm border rounded-lg px-3 py-2 outline-none"
                      style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                    />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('checklist')}
                className="mt-5 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: '#2563EB', color: 'white' }}>
                Continue to Checklist →
              </button>
            </div>
          )}

          {step === 'checklist' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm" style={{ color: '#64748B' }}>
                  <span className="font-semibold" style={{ color: '#0F172A' }}>{completed}</span> / {checklistItems.length} items completed
                </div>
                <div className="h-2 w-48 rounded-full overflow-hidden" style={{ background: '#E2E8F0' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(completed / checklistItems.length) * 100}%`, background: '#16A34A' }} />
                </div>
              </div>

              {categories.map(cat => (
                <div key={cat} className="bg-white rounded-xl border mb-3" style={{ borderColor: '#E2E8F0' }}>
                  <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: '#F1F5F9' }}>
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>{cat}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F1F5F9', color: '#94A3B8' }}>
                      {checklistItems.filter(c => c.category === cat && statuses[c.id]).length}/{checklistItems.filter(c => c.category === cat).length}
                    </span>
                  </div>
                  <div className="divide-y" style={{ borderColor: '#F8FAFC' }}>
                    {checklistItems.filter(c => c.category === cat).map(item => {
                      const status = statuses[item.id];
                      return (
                        <div key={item.id} className="px-5 py-4 flex items-start gap-4">
                          <div className="flex-1">
                            <div className="text-sm font-medium" style={{ color: '#0F172A' }}>{item.component}</div>
                            <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{item.action}</div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {STATUS_OPTIONS.map(opt => (
                              <button
                                key={opt}
                                onClick={() => setStatus(item.id, opt)}
                                className="text-xs px-2.5 py-1 rounded-md font-medium border transition-all"
                                style={{
                                  background: status === opt ? STATUS_COLORS[opt] + '18' : 'transparent',
                                  borderColor: status === opt ? STATUS_COLORS[opt] : '#E2E8F0',
                                  color: status === opt ? STATUS_COLORS[opt] : '#94A3B8',
                                  fontWeight: status === opt ? 600 : 400,
                                }}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button onClick={() => setStep('parts')} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#2563EB', color: 'white' }}>
                Continue to Parts →
              </button>
            </div>
          )}

          {step === 'parts' && (
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Parts Used & Inventory Deduction</div>
              <div className="text-xs mb-5" style={{ color: '#94A3B8' }}>
                {replacedItems.length > 0
                  ? `${replacedItems.length} item(s) marked as Replaced. Inventory will be deducted on save.`
                  : 'No items marked as Replaced. Add manual parts if needed.'}
              </div>

              {replacedItems.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#64748B' }}>Auto-detected from Checklist</div>
                  {replacedItems.map(item => {
                    const part = products.find(p => p.id === spareParts[item.id]);
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg mb-2" style={{ background: '#F0FDF4' }}>
                        <Package size={15} style={{ color: '#16A34A' }} />
                        <div className="flex-1">
                          <div className="text-xs font-medium" style={{ color: '#0F172A' }}>{item.component}</div>
                          <div className="text-xs" style={{ color: '#64748B' }}>{part ? `${part.name} — Stock: ${part.currentStock} → ${part.currentStock - 1}` : 'No matching part found'}</div>
                        </div>
                        <Badge label="Will Deduct × 1" variant="success" />
                      </div>
                    );
                  })}
                </div>
              )}

              <div>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#64748B' }}>Additional Parts</div>
                <div className="flex gap-3">
                  <select className="text-xs border rounded-lg px-3 py-2 outline-none flex-1" style={{ borderColor: '#E2E8F0' }}>
                    <option>Select product...</option>
                    {products.map(p => <option key={p.id}>{p.name} (Stock: {p.currentStock})</option>)}
                  </select>
                  <input type="number" placeholder="Qty" className="text-xs border rounded-lg px-3 py-2 outline-none w-20" style={{ borderColor: '#E2E8F0' }} />
                  <button className="text-xs px-3 py-2 rounded-lg" style={{ background: '#EFF6FF', color: '#2563EB' }}>Add</button>
                </div>
              </div>

              <button onClick={() => setStep('sign')} className="mt-5 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#2563EB', color: 'white' }}>
                Continue to Sign Off →
              </button>
            </div>
          )}

          {step === 'sign' && (
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-5" style={{ color: '#0F172A' }}>Sign Off & Close Work Order</div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>Technician Signature</div>
                  <div className="h-28 rounded-lg border-2 border-dashed flex items-center justify-center" style={{ borderColor: '#E2E8F0' }}>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#94A3B8' }}>
                      <PenLine size={14} />Sign here
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>Customer / Supervisor Signature</div>
                  <div className="h-28 rounded-lg border-2 border-dashed flex items-center justify-center" style={{ borderColor: '#E2E8F0' }}>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#94A3B8' }}>
                      <PenLine size={14} />Sign here
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>Remarks</label>
                <textarea rows={3} placeholder="Any final notes or observations..."
                  className="w-full text-sm border rounded-lg px-3 py-2 outline-none resize-none"
                  style={{ borderColor: '#E2E8F0', color: '#0F172A' }} />
              </div>
              <div className="mt-4">
                <div className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>Photos</div>
                <div className="flex gap-2">
                  <div className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center" style={{ borderColor: '#E2E8F0' }}>
                    <Camera size={18} style={{ color: '#CBD5E1' }} />
                  </div>
                  <button className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center text-xs" style={{ borderColor: '#E2E8F0', color: '#94A3B8' }}>
                    + Add
                  </button>
                </div>
              </div>
              <button onClick={() => setSaved(true)}
                className="mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: '#16A34A', color: 'white' }}>
                ✓ Complete & Close Work Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
