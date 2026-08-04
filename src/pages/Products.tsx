import { useState } from 'react';
import {
  Search, SlidersHorizontal, Download, Plus, MoreHorizontal, AlertTriangle, Package,
  CheckCircle2, ShieldCheck, Percent, Tag, Banknote, Droplets, Wrench, Plus as PlusIcon,
  Trash2, Camera, X, CalendarClock
} from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import CollapsibleSection from '../components/CollapsibleSection';
import { products } from '../data/mockData';

const suppliers = ['All', 'Mahindra', 'TMTL'];

const WASTAGE_REASONS = ['Spillage', 'Evaporation', 'Meter Error', 'Unauthorized Use', 'Leakage', 'Contamination', 'Overfill', 'Other'];
const DAMAGE_TYPES = ['Physical Impact', 'Corrosion', 'Electrical Failure', 'Overheating', 'Wear and Tear', 'Manufacturing Defect', 'Accidental Damage', 'Environmental', 'Unknown'];
const SEVERITIES = ['Minor', 'Moderate', 'Severe', 'Critical'];
const REPAIR_STATUSES = ['Pending', 'In Progress', 'Completed', 'Write-Off'];

// ---------- Helper: warranty status ----------
function warrantyStatus(p: any) {
  const w = p.warranty;
  if (!w || (!w.durationMonths && !w.durationYears)) return null;
  const today = new Date().toISOString().slice(0, 10);
  const end = w.extendedUntil && w.isExtended ? w.extendedUntil : w.endDate;
  if (end && end < today) return { active: false, label: 'Expired', end };
  return { active: true, label: w.durationYears ? `${w.durationYears}y` : `${w.durationMonths}m`, end };
}

// ---------- Field renderer ----------
function Field({ label, required, children, errors }: { label: string; required?: boolean; children: React.ReactNode; errors?: string[] }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>
        {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
      </label>
      {children}
      {errors?.map((e, i) => (
        <div key={i} className="text-[11px] mt-1" style={{ color: '#DC2626' }}>{e}</div>
      ))}
    </div>
  );
}

const inputCls = "w-full text-sm border rounded-lg px-3 py-2 outline-none";
const selCls = "w-full text-sm border rounded-lg px-3 py-2 outline-none appearance-none";

export default function Products({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [supplier, setSupplier] = useState('All');
  const [selected, setSelected] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [exclusions, setExclusions] = useState<string[]>(['']);
  const [components, setComponents] = useState<string[]>(['']);
  const [quantityBreaks, setQuantityBreaks] = useState<{ min: string; max: string; price: string; disc: string }[]>([]);
  const [coverage, setCoverage] = useState({ parts: true, labour: false, consumables: false, onSiteService: false });
  const [gstType, setGstType] = useState('CGST+SGST');
  const [pricingModel, setPricingModel] = useState('immediate');
  const [requiresAdvance, setRequiresAdvance] = useState(false);
  const [isExtended, setIsExtended] = useState(false);
  const [warrantyClaimed, setWarrantyClaimed] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [damageRepairStatus, setDamageRepairStatus] = useState('Pending');

  const set = (k: string, v: string) => setFormState(s => ({ ...s, [k]: v }));

  // ---------- Derived calculations ----------
  const basePrice = parseFloat(formState.unitPrice || '0') || 0;
  const discount = parseFloat(formState.discount || '0') || 0;
  const discountedPrice = basePrice * (1 - discount / 100);
  const sgst = gstType === 'CGST+SGST' ? parseFloat(formState.sgst || '0') || 0 : 0;
  const cgst = gstType === 'CGST+SGST' ? parseFloat(formState.cgst || '0') || 0 : 0;
  const igst = gstType === 'IGST' ? parseFloat(formState.igst || '0') || 0 : 0;
  const totalGstRate = gstType === 'CGST+SGST' ? sgst + cgst : gstType === 'IGST' ? igst : 0;
  const gstAmount = discountedPrice * (totalGstRate / 100);
  const totalWithGst = discountedPrice + gstAmount;

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    const matchSup = supplier === 'All' || p.supplier === supplier;
    return matchSearch && matchCat && matchSup;
  });

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formState.name) e.name = 'Product name is required.';
    if (!formState.partNumber) e.partNumber = 'Part number is required.';
    if (!formState.unitPrice) e.unitPrice = 'Unit price is required.';
    if (discount < 0 || discount > 100) e.discount = 'Discount must be between 0 and 100%.';
    if (formState.warrantyStart && formState.warrantyEnd && formState.warrantyEnd < formState.warrantyStart) {
      e.warrantyEnd = 'End date must be on or after the start date.';
    }
    if (isExtended && formState.extendedUntil && formState.warrantyStart && formState.extendedUntil <= formState.warrantyStart) {
      e.extendedUntil = 'Extended until must be after the start date.';
    }
    if (formState.hsn && !/^[0-9A-Z]{4,8}$/.test(formState.hsn)) {
      e.hsn = 'HSN code must be 4–8 alphanumeric characters.';
    }
    if (sgst + cgst > 28) e.cgst = 'Combined CGST + SGST must not exceed 28%.';
    if (pricingModel === 'credit' || pricingModel === 'hybrid') {
      const cp = parseInt(formState.creditPeriod || '0');
      if (cp < 1 || cp > 365) e.creditPeriod = 'Credit period must be between 1 and 365 days.';
    }
    if (requiresAdvance) {
      const ap = parseFloat(formState.advancePercentage || '0');
      if (ap < 0 || ap > 100) e.advancePercentage = 'Advance percentage must be between 0 and 100%.';
    }
    if (formState.payoutDate && formState.payoutDate < new Date().toISOString().slice(0, 10)) {
      e.payoutDate = 'Payout date cannot be in the past.';
    }
    if (formState.lossQuantity && formState.quantity) {
      const loss = parseFloat(formState.lossQuantity);
      const qty = parseFloat(formState.quantity);
      if (loss > qty) e.lossQuantity = 'Loss quantity cannot exceed quantity.';
    }
    if (damageRepairStatus === 'Completed' || damageRepairStatus === 'Write-Off') {
      if (!formState.resolution) e.resolution = 'Resolution is required when repair is completed or written off.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
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
        <div className="px-6 py-6 flex flex-col gap-4">
          {/* Core info */}
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Product Information</div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Product Name" required errors={errors.name ? [errors.name] : undefined}>
                <input className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="e.g. Oil Filter"
                  value={formState.name || ''} onChange={e => set('name', e.target.value)} />
              </Field>
              <Field label="Part Number" required errors={errors.partNumber ? [errors.partNumber] : undefined}>
                <input className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="e.g. OFL-M25"
                  value={formState.partNumber || ''} onChange={e => set('partNumber', e.target.value)} />
              </Field>
              <Field label="Supplier" required>
                <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={formState.supplier || ''}
                  onChange={e => set('supplier', e.target.value)}>
                  <option value="">Select</option>
                  <option>Mahindra</option><option>TMTL</option>
                </select>
              </Field>
              <Field label="Unit" required>
                <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={formState.unit || ''}
                  onChange={e => set('unit', e.target.value)}>
                  <option value="">Select</option>
                  <option>Pcs</option><option>Litre</option><option>Set</option><option>Kg</option><option>Meter</option>
                </select>
              </Field>
              <Field label="Min Stock" required>
                <input type="number" className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0"
                  value={formState.minStock || ''} onChange={e => set('minStock', e.target.value)} />
              </Field>
              <Field label="Initial Stock" required>
                <input type="number" className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0"
                  value={formState.currentStock || ''} onChange={e => set('currentStock', e.target.value)} />
              </Field>
              <Field label="Unit Price (₹)" required errors={errors.unitPrice ? [errors.unitPrice] : undefined}>
                <input type="number" className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0.00"
                  value={formState.unitPrice || ''} onChange={e => set('unitPrice', e.target.value)} />
              </Field>
              <Field label="Category">
                <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={formState.category || ''}
                  onChange={e => set('category', e.target.value)}>
                  <option value="">Select</option>
                  <option>PM</option><option>CM</option><option>General</option><option>Fuel</option><option>Asset</option>
                </select>
              </Field>
              <Field label="Location">
                <input className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="Rack A-1"
                  value={formState.location || ''} onChange={e => set('location', e.target.value)} />
              </Field>
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

          {/* 1. WARRANTY */}
          <CollapsibleSection title="Product Warranty" subtitle="Capture warranty terms, duration, dates and coverage" icon={<ShieldCheck size={16} />}>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Duration (Months)">
                <input type="number" min={0} max={120} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0"
                  value={formState.warrantyMonths || ''} onChange={e => set('warrantyMonths', e.target.value)} />
              </Field>
              <Field label="Duration (Years)">
                <input type="number" min={0} max={10} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0"
                  value={formState.warrantyYears || ''} onChange={e => set('warrantyYears', e.target.value)} />
              </Field>
              <Field label="Warranty Provider">
                <input className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="e.g. Mahindra Ltd."
                  value={formState.provider || ''} onChange={e => set('provider', e.target.value)} />
              </Field>
              <Field label="Start Date">
                <input type="date" className={inputCls} style={{ borderColor: '#E2E8F0' }}
                  value={formState.warrantyStart || ''} onChange={e => set('warrantyStart', e.target.value)} />
              </Field>
              <Field label="End Date" errors={errors.warrantyEnd ? [errors.warrantyEnd] : undefined}>
                <input type="date" className={inputCls} style={{ borderColor: '#E2E8F0' }}
                  value={formState.warrantyEnd || ''} onChange={e => set('warrantyEnd', e.target.value)} />
              </Field>
              <Field label="Replacement Within (Days)">
                <input type="number" min={0} max={90} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0"
                  value={formState.replacementDays || ''} onChange={e => set('replacementDays', e.target.value)} />
              </Field>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium mb-2" style={{ color: '#475569' }}>Coverage</div>
              <div className="flex flex-wrap gap-4">
                {(['parts', 'labour', 'consumables', 'onSiteService'] as const).map(k => (
                  <label key={k} className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: '#475569' }}>
                    <input type="checkbox" checked={coverage[k]} onChange={() => setCoverage(c => ({ ...c, [k]: !c[k] }))} className="rounded" />
                    {k === 'parts' ? 'Parts' : k === 'labour' ? 'Labour' : k === 'consumables' ? 'Consumables' : 'On-Site Service'}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium mb-2" style={{ color: '#475569' }}>Exclusions</div>
              {exclusions.map((ex, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="Exclusion reason"
                    value={ex} onChange={e => { const arr = [...exclusions]; arr[i] = e.target.value; setExclusions(arr); }} />
                  {exclusions.length > 1 && (
                    <button type="button" onClick={() => setExclusions(exclusions.filter((_, idx) => idx !== i))} className="p-1.5 rounded hover:bg-gray-100">
                      <Trash2 size={14} style={{ color: '#DC2626' }} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setExclusions([...exclusions, ''])} className="text-xs font-medium flex items-center gap-1" style={{ color: '#2563EB' }}>
                <PlusIcon size={13} /> Add Exclusion
              </button>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: '#475569' }}>
                <input type="checkbox" checked={isExtended} onChange={() => setIsExtended(!isExtended)} className="rounded" /> Extended Warranty
              </label>
              {isExtended && (
                <Field label="Extended Until" errors={errors.extendedUntil ? [errors.extendedUntil] : undefined}>
                  <input type="date" className={inputCls} style={{ borderColor: '#E2E8F0' }}
                    value={formState.extendedUntil || ''} onChange={e => set('extendedUntil', e.target.value)} />
                </Field>
              )}
            </div>
            <div className="mt-4">
              <Field label="Claim Process">
                <textarea rows={2} className={inputCls + " resize-none"} style={{ borderColor: '#E2E8F0' }} placeholder="Steps to file a claim"
                  value={formState.claimProcess || ''} onChange={e => set('claimProcess', e.target.value)} />
              </Field>
            </div>
          </CollapsibleSection>

          {/* 2. GST */}
          <CollapsibleSection title="Tax Information (GST)" subtitle="Input tax rates and view the live GST calculation" icon={<Percent size={16} />}>
            <div className="grid grid-cols-3 gap-4">
              <Field label="HSN Code" errors={errors.hsn ? [errors.hsn] : undefined}>
                <input className={inputCls} style={{ borderColor: '#E2E8F0' }} maxLength={8} placeholder="e.g. 8413"
                  value={formState.hsn || ''} onChange={e => set('hsn', e.target.value)} />
              </Field>
              <Field label="Applicable GST Type" required>
                <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={gstType} onChange={e => setGstType(e.target.value)}>
                  <option>CGST+SGST</option><option>IGST</option><option>Exempt</option><option>Nil</option>
                </select>
              </Field>
              {gstType === 'CGST+SGST' && (
                <>
                  <Field label="SGST Rate (%)">
                    <input type="number" min={0} max={100} step={0.1} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="9"
                      value={formState.sgst || ''} onChange={e => set('sgst', e.target.value)} />
                  </Field>
                  <Field label="CGST Rate (%)" errors={errors.cgst ? [errors.cgst] : undefined}>
                    <input type="number" min={0} max={100} step={0.1} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="9"
                      value={formState.cgst || ''} onChange={e => set('cgst', e.target.value)} />
                  </Field>
                </>
              )}
              {gstType === 'IGST' && (
                <Field label="IGST Rate (%)">
                  <input type="number" min={0} max={100} step={0.1} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="18"
                    value={formState.igst || ''} onChange={e => set('igst', e.target.value)} />
                </Field>
              )}
              {gstType === 'Exempt' && (
                <div className="col-span-2 flex items-center text-xs" style={{ color: '#16A34A' }}>No GST applicable — product is exempt.</div>
              )}
              {gstType === 'Nil' && (
                <div className="col-span-2 flex items-center text-xs" style={{ color: '#16A34A' }}>Nil-rated — HSN applicable but 0% GST.</div>
              )}
            </div>

            {/* GST Calculation Breakdown */}
            <div className="mt-4 p-4 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div className="text-xs font-semibold mb-3" style={{ color: '#0F172A' }}>GST Calculation Breakdown</div>
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between"><span style={{ color: '#64748B' }}>Taxable Amount (Base Price × Discount)</span><span className="font-semibold" style={{ color: '#0F172A' }}>₹ {discountedPrice.toFixed(2)}</span></div>
                <div className="border-t" style={{ borderColor: '#E2E8F0' }} />
                <div style={{ color: '#64748B' }}>Applicable GST Type: <span className="font-medium" style={{ color: '#0F172A' }}>{gstType}</span></div>
                {gstType === 'CGST+SGST' && (
                  <>
                    <div className="flex justify-between pl-3"><span style={{ color: '#64748B' }}>CGST @ {cgst}%</span><span className="font-medium" style={{ color: '#0F172A' }}>₹ {(discountedPrice * cgst / 100).toFixed(2)}</span></div>
                    <div className="flex justify-between pl-3"><span style={{ color: '#64748B' }}>SGST @ {sgst}%</span><span className="font-medium" style={{ color: '#0F172A' }}>₹ {(discountedPrice * sgst / 100).toFixed(2)}</span></div>
                  </>
                )}
                {gstType === 'IGST' && (
                  <div className="flex justify-between pl-3"><span style={{ color: '#64748B' }}>IGST @ {igst}%</span><span className="font-medium" style={{ color: '#0F172A' }}>₹ {(discountedPrice * igst / 100).toFixed(2)}</span></div>
                )}
                <div className="flex justify-between"><span style={{ color: '#64748B' }}>Total GST</span><span className="font-semibold" style={{ color: '#0F172A' }}>₹ {gstAmount.toFixed(2)}</span></div>
                <div className="border-t" style={{ borderColor: '#E2E8F0' }} />
                <div className="flex justify-between items-center"><span style={{ color: '#64748B' }}>Total Amount with GST</span><span className="text-sm font-bold" style={{ color: '#2563EB' }}>₹ {totalWithGst.toFixed(2)}</span></div>
              </div>
            </div>
          </CollapsibleSection>

          {/* 3. PRICING */}
          <CollapsibleSection title="Pricing & Payment" subtitle="Distinguish credit terms vs immediate payment" icon={<Tag size={16} />}>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Discount (%)" errors={errors.discount ? [errors.discount] : undefined}>
                <input type="number" min={0} max={100} step={0.1} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0"
                  value={formState.discount || ''} onChange={e => set('discount', e.target.value)} />
              </Field>
              <Field label="Discounted Price (₹)">
                <input className={inputCls} style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }} value={`₹ ${discountedPrice.toFixed(2)}`} readOnly />
              </Field>
              <Field label="Pricing Model" required>
                <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={pricingModel} onChange={e => setPricingModel(e.target.value)}>
                  <option value="credit">Credit</option><option value="immediate">Immediate</option><option value="hybrid">Hybrid</option>
                </select>
              </Field>
            </div>

            {(pricingModel === 'credit' || pricingModel === 'hybrid') && (
              <div className="mt-4 p-4 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#64748B' }}>Credit Terms</div>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Credit Period (Days)" errors={errors.creditPeriod ? [errors.creditPeriod] : undefined}>
                    <input type="number" min={1} max={365} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="30"
                      value={formState.creditPeriod || ''} onChange={e => set('creditPeriod', e.target.value)} />
                  </Field>
                  <Field label="Credit Limit (₹)">
                    <input type="number" min={0} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0"
                      value={formState.creditLimit || ''} onChange={e => set('creditLimit', e.target.value)} />
                  </Field>
                  <Field label="Interest Rate (%/month)">
                    <input type="number" min={0} max={100} step={0.1} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="1.5"
                      value={formState.interestRate || ''} onChange={e => set('interestRate', e.target.value)} />
                  </Field>
                  <Field label="Late Payment Penalty (%)">
                    <input type="number" min={0} max={100} step={0.1} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="2"
                      value={formState.penalty || ''} onChange={e => set('penalty', e.target.value)} />
                  </Field>
                  <Field label="Payment Method">
                    <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={formState.creditMethod || ''} onChange={e => set('creditMethod', e.target.value)}>
                      <option value="">Select</option>
                      <option>Net Banking</option><option>Cheque</option><option>UPI</option><option>Credit Card</option><option>Other</option>
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {(pricingModel === 'immediate' || pricingModel === 'hybrid') && (
              <div className="mt-4 p-4 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#64748B' }}>Immediate Payment</div>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Payment Method">
                    <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={formState.immediateMethod || ''} onChange={e => set('immediateMethod', e.target.value)}>
                      <option value="">Select</option>
                      <option>Cash</option><option>Bank Transfer</option><option>UPI</option><option>Credit Card</option><option>Debit Card</option>
                    </select>
                  </Field>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: '#475569' }}>
                      <input type="checkbox" checked={requiresAdvance} onChange={() => setRequiresAdvance(!requiresAdvance)} className="rounded" /> Requires Advance
                    </label>
                  </div>
                  {requiresAdvance && (
                    <Field label="Advance Percentage (%)" errors={errors.advancePercentage ? [errors.advancePercentage] : undefined}>
                      <input type="number" min={0} max={100} step={0.1} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="50"
                        value={formState.advancePercentage || ''} onChange={e => set('advancePercentage', e.target.value)} />
                    </Field>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#64748B' }}>Quantity Breaks</div>
              {quantityBreaks.map((qb, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input type="number" placeholder="Min Qty" className={inputCls} style={{ borderColor: '#E2E8F0' }} value={qb.min}
                    onChange={e => { const arr = [...quantityBreaks]; arr[i] = { ...arr[i], min: e.target.value }; setQuantityBreaks(arr); }} />
                  <span className="text-xs" style={{ color: '#94A3B8' }}>–</span>
                  <input type="number" placeholder="Max Qty" className={inputCls} style={{ borderColor: '#E2E8F0' }} value={qb.max}
                    onChange={e => { const arr = [...quantityBreaks]; arr[i] = { ...arr[i], max: e.target.value }; setQuantityBreaks(arr); }} />
                  <input type="number" placeholder="Price" className={inputCls} style={{ borderColor: '#E2E8F0' }} value={qb.price}
                    onChange={e => { const arr = [...quantityBreaks]; arr[i] = { ...arr[i], price: e.target.value }; setQuantityBreaks(arr); }} />
                  <input type="number" placeholder="Disc %" className={inputCls} style={{ borderColor: '#E2E8F0' }} value={qb.disc}
                    onChange={e => { const arr = [...quantityBreaks]; arr[i] = { ...arr[i], disc: e.target.value }; setQuantityBreaks(arr); }} />
                  {quantityBreaks.length > 0 && (
                    <button type="button" onClick={() => setQuantityBreaks(quantityBreaks.filter((_, idx) => idx !== i))} className="p-1.5 rounded hover:bg-gray-100">
                      <Trash2 size={14} style={{ color: '#DC2626' }} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setQuantityBreaks([...quantityBreaks, { min: '', max: '', price: '', disc: '' }])} className="text-xs font-medium flex items-center gap-1" style={{ color: '#2563EB' }}>
                <PlusIcon size={13} /> Add Quantity Break
              </button>
            </div>
          </CollapsibleSection>

          {/* 4. PAYOUT DATE */}
          <CollapsibleSection title="Payout Schedule" subtitle="Select the scheduled financial settlement date" icon={<Banknote size={16} />}>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Payout Date" required errors={errors.payoutDate ? [errors.payoutDate] : undefined}>
                <div className="relative">
                  <input type="date" className={inputCls + " pr-9"} style={{ borderColor: '#E2E8F0' }}
                    value={formState.payoutDate || ''} onChange={e => set('payoutDate', e.target.value)} />
                  <CalendarClock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#94A3B8' }} />
                </div>
              </Field>
              <Field label="Payout Type">
                <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={formState.payoutType || ''} onChange={e => set('payoutType', e.target.value)}>
                  <option value="">Select</option>
                  <option value="full">Full</option><option value="partial">Partial</option><option value="installment">Installment</option>
                </select>
              </Field>
              <Field label="Amount (₹)">
                <input type="number" min={0} step={0.01} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0.00"
                  value={formState.payoutAmount || ''} onChange={e => set('payoutAmount', e.target.value)} />
              </Field>
              <Field label="Status">
                <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={formState.payoutStatus || ''} onChange={e => set('payoutStatus', e.target.value)}>
                  <option value="">Select</option>
                  <option value="pending">Pending</option><option value="processed">Processed</option><option value="overdue">Overdue</option><option value="cancelled">Cancelled</option>
                </select>
              </Field>
              <Field label="Payment Method">
                <input className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="e.g. Net Banking"
                  value={formState.payoutMethod || ''} onChange={e => set('payoutMethod', e.target.value)} />
              </Field>
              <Field label="Reference Number">
                <input className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="e.g. PO-2025-001"
                  value={formState.payoutRef || ''} onChange={e => set('payoutRef', e.target.value)} />
              </Field>
            </div>
            {(formState.payoutType === 'partial' || formState.payoutType === 'installment') && (
              <div className="mt-3 p-3 rounded-lg text-xs" style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' }}>
                This is a partial payout. Remaining balance will be settled on the next scheduled payout.
              </div>
            )}
            <div className="mt-4">
              <Field label="Notes">
                <textarea rows={2} className={inputCls + " resize-none"} style={{ borderColor: '#E2E8F0' }} placeholder="Optional notes"
                  value={formState.payoutNotes || ''} onChange={e => set('payoutNotes', e.target.value)} />
              </Field>
            </div>
          </CollapsibleSection>

          {/* 5. FUEL WASTAGE */}
          {formState.category === 'Fuel' && (
            <CollapsibleSection title="Fuel Wastage" subtitle="Record loss quantity as inventory deductions" icon={<Droplets size={16} />}>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Total Fuel Received', value: `${formState.totalReceived || 0} L`, color: '#16A34A', bg: '#DCFCE7' },
                  { label: 'Total Loss Quantity', value: `${formState.lossQuantity || 0} L`, color: '#DC2626', bg: '#FEE2E2' },
                  { label: 'Loss Value (₹)', value: `₹ ${(parseFloat(formState.lossQuantity || '0') * basePrice).toFixed(2)}`, color: '#D97706', bg: '#FEF3C7' },
                ].map((s, i) => (
                  <div key={i} className="rounded-lg p-3 border" style={{ background: s.bg, borderColor: '#E2E8F0' }}>
                    <div className="text-xs" style={{ color: s.color }}>{s.label}</div>
                    <div className="text-lg font-bold mt-1" style={{ color: '#0F172A' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Quantity (Litres)">
                  <input type="number" min={0} step={0.1} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0"
                    value={formState.quantity || ''} onChange={e => set('quantity', e.target.value)} />
                </Field>
                <Field label="Loss Quantity (Litres)" required errors={errors.lossQuantity ? [errors.lossQuantity] : undefined}>
                  <input type="number" min={0} step={0.1} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0"
                    value={formState.lossQuantity || ''} onChange={e => set('lossQuantity', e.target.value)} />
                </Field>
                <Field label="Wastage Reason">
                  <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={formState.wastageReason || ''} onChange={e => set('wastageReason', e.target.value)}>
                    <option value="">Select</option>
                    {WASTAGE_REASONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Reported By">
                  <input className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="Full name"
                    value={formState.reportedBy || ''} onChange={e => set('reportedBy', e.target.value)} />
                </Field>
                <Field label="Approved By">
                  <input className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="Full name"
                    value={formState.approvedBy || ''} onChange={e => set('approvedBy', e.target.value)} />
                </Field>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: '#475569' }}>
                    <input type="checkbox" checked={isApproved} onChange={() => setIsApproved(!isApproved)} className="rounded" /> Approved
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <Field label="Remarks">
                  <textarea rows={2} className={inputCls + " resize-none"} style={{ borderColor: '#E2E8F0' }} placeholder="Remarks"
                    value={formState.wastageRemarks || ''} onChange={e => set('wastageRemarks', e.target.value)} />
                </Field>
              </div>
            </CollapsibleSection>
          )}

          {/* 6. HARDWARE DAMAGE */}
          {(formState.category === 'Asset' || formState.category === 'CM' || formState.category === 'PM') && (
            <CollapsibleSection title="Hardware Damage Records" subtitle="Track, report and attach evidence of physical damage" icon={<Wrench size={16} />}>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Damage Date">
                  <input type="date" className={inputCls} style={{ borderColor: '#E2E8F0' }}
                    value={formState.damageDate || ''} onChange={e => set('damageDate', e.target.value)} />
                </Field>
                <Field label="Reported By">
                  <input className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="Full name"
                    value={formState.damageReportedBy || ''} onChange={e => set('damageReportedBy', e.target.value)} />
                </Field>
                <Field label="Damage Type">
                  <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={formState.damageType || ''} onChange={e => set('damageType', e.target.value)}>
                    <option value="">Select</option>
                    {DAMAGE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Severity">
                  <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={formState.severity || ''} onChange={e => set('severity', e.target.value)}>
                    <option value="">Select</option>
                    {SEVERITIES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Repair Status">
                  <select className={selCls} style={{ borderColor: '#E2E8F0' }} value={damageRepairStatus} onChange={e => setDamageRepairStatus(e.target.value)}>
                    {REPAIR_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Estimated Repair Cost (₹)">
                  <input type="number" min={0} step={0.01} className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="0.00"
                    value={formState.estCost || ''} onChange={e => set('estCost', e.target.value)} />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Description">
                  <textarea rows={2} className={inputCls + " resize-none"} style={{ borderColor: '#E2E8F0' }} placeholder="Describe the damage"
                    value={formState.description || ''} onChange={e => set('description', e.target.value)} />
                </Field>
              </div>
              <div className="mt-4">
                <div className="text-xs font-medium mb-2" style={{ color: '#475569' }}>Affected Components</div>
                {components.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input className={inputCls} style={{ borderColor: '#E2E8F0' }} placeholder="Component"
                      value={c} onChange={e => { const arr = [...components]; arr[i] = e.target.value; setComponents(arr); }} />
                    {components.length > 1 && (
                      <button type="button" onClick={() => setComponents(components.filter((_, idx) => idx !== i))} className="p-1.5 rounded hover:bg-gray-100">
                        <Trash2 size={14} style={{ color: '#DC2626' }} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setComponents([...components, ''])} className="text-xs font-medium flex items-center gap-1" style={{ color: '#2563EB' }}>
                  <PlusIcon size={13} /> Add Component
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: '#475569' }}>
                  <input type="checkbox" checked={warrantyClaimed} onChange={() => setWarrantyClaimed(!warrantyClaimed)} className="rounded" /> Warranty Claimed
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center" style={{ borderColor: '#E2E8F0' }}>
                    <Camera size={18} style={{ color: '#CBD5E1' }} />
                  </div>
                  <button type="button" className="text-xs px-3 py-2 rounded-lg font-medium" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                    Upload Photo
                  </button>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>Max 5 files, JPEG/PNG/WebP, 5MB each</span>
                </div>
              </div>
              {(damageRepairStatus === 'Completed' || damageRepairStatus === 'Write-Off') && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Field label="Resolution" errors={errors.resolution ? [errors.resolution] : undefined}>
                    <textarea rows={2} className={inputCls + " resize-none"} style={{ borderColor: '#E2E8F0' }} placeholder="Resolution"
                      value={formState.resolution || ''} onChange={e => set('resolution', e.target.value)} />
                  </Field>
                  <Field label="Resolved Date">
                    <input type="date" className={inputCls} style={{ borderColor: '#E2E8F0' }}
                      value={formState.resolvedDate || ''} onChange={e => set('resolvedDate', e.target.value)} />
                  </Field>
                </div>
              )}
            </CollapsibleSection>
          )}
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
                    {['Part Number', 'Product Name', 'Supplier', 'Unit', 'Min Stock', 'Current Stock', 'Unit Price', 'Warranty', 'GST', 'Pricing', 'Payout', 'Status', ''].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const isLow = p.currentStock < p.minStock;
                    const ws = warrantyStatus(p);
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
                        <td className="px-3 py-3">
                          {ws ? <Badge label={ws.label} variant={ws.active ? 'success' : 'danger'} /> : <Badge label="No Warranty" variant="gray" />}
                        </td>
                        <td className="px-3 py-3">
                          <Badge label={`${p.gst.totalGstRate}%`} variant="info" />
                        </td>
                        <td className="px-3 py-3">
                          <Badge label={p.pricing.pricingModel.charAt(0).toUpperCase() + p.pricing.pricingModel.slice(1)}
                            variant={p.pricing.pricingModel === 'immediate' ? 'success' : p.pricing.pricingModel === 'hybrid' ? 'warning' : 'info'} />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-col gap-0.5">
                            <span style={{ color: '#475569' }}>{p.payoutSchedule.payoutDate}</span>
                            <Badge label={p.payoutSchedule.status} variant={p.payoutSchedule.status === 'processed' ? 'success' : p.payoutSchedule.status === 'overdue' ? 'danger' : p.payoutSchedule.status === 'cancelled' ? 'gray' : 'warning'} />
                          </div>
                        </td>
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
