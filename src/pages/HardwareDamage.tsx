import { useState } from 'react';
import { Search, MoreHorizontal, Wrench, CheckCircle2, Camera } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { products } from '../data/mockData';

const SEVERITY_COLORS: Record<string, string> = {
  Minor: '#16A34A', Moderate: '#D97706', Severe: '#DC2626', Critical: '#DC2626'
};

const REPAIR_STATUS_VARIANT: Record<string, string> = {
  Pending: 'warning', 'In Progress': 'info', Completed: 'success', 'Write-Off': 'danger'
};

export default function HardwareDamage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formState, setFormState] = useState<Record<string, string>>({});

  const allDamages = products
    .filter(p => p.hardwareDamage && p.hardwareDamage.length > 0)
    .flatMap(p => p.hardwareDamage!.map(d => ({
      ...d,
      productName: p.name,
      productSku: p.sku,
    })));

  const filtered = allDamages.filter(d => {
    const matchSearch = d.productName.toLowerCase().includes(search.toLowerCase()) || d.productSku.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === 'All' || d.severity === severityFilter;
    const matchStatus = statusFilter === 'All' || d.repairStatus === statusFilter;
    return matchSearch && matchSeverity && matchStatus;
  });

  if (saved) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
        <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
      </div>
      <div className="text-lg font-semibold" style={{ color: '#0F172A' }}>Damage Report Saved</div>
      <div className="text-sm" style={{ color: '#64748B' }}>Hardware damage record has been created.</div>
    </div>
  );

  if (showForm) return (
    <div className="flex flex-col h-full">
      <Header
        title="Report Hardware Damage"
        breadcrumbs={[{ label: 'Maintenance' }, { label: 'Hardware Damage' }, { label: 'New Report' }]}
        secondaryActions={[{ label: 'Cancel', onClick: () => setShowForm(false) }]}
        primaryAction={{ label: 'Save Report', onClick: () => setSaved(true) }}
      />
      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-6">
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Damage Details</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Product', key: 'productName', type: 'text', placeholder: 'Product name', required: true },
                { label: 'Damage Date', key: 'damageDate', type: 'date', required: true },
                { label: 'Reported By', key: 'reportedBy', type: 'text', placeholder: 'Full name', required: true },
                { label: 'Damage Type', key: 'damageType', type: 'select', options: ['Physical Impact', 'Corrosion', 'Electrical Failure', 'Overheating', 'Wear and Tear', 'Manufacturing Defect', 'Accidental Damage', 'Environmental', 'Unknown'], required: true },
                { label: 'Severity', key: 'severity', type: 'select', options: ['Minor', 'Moderate', 'Severe', 'Critical'], required: true },
                { label: 'Estimated Repair Cost (₹)', key: 'estimatedRepairCost', type: 'number', placeholder: '0.00', required: true },
                { label: 'Actual Repair Cost (₹)', key: 'actualRepairCost', type: 'number', placeholder: '0.00' },
                { label: 'Repair Status', key: 'repairStatus', type: 'select', options: ['Pending', 'In Progress', 'Completed', 'Write-Off'], required: true },
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
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>Description</label>
              <textarea rows={3} placeholder="Describe the damage in detail..."
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none resize-none"
                style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                value={formState.description || ''}
                onChange={e => setFormState(s => ({ ...s, description: e.target.value }))} />
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>Affected Components (comma-separated)</label>
              <input type="text" placeholder="e.g. Terminal casing, Terminal connector"
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none"
                style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                value={formState.affectedComponents || ''}
                onChange={e => setFormState(s => ({ ...s, affectedComponents: e.target.value }))} />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: '#475569' }}>
                <input type="checkbox"
                  checked={formState.warrantyClaimed === 'true'}
                  onChange={e => setFormState(s => ({ ...s, warrantyClaimed: e.target.checked ? 'true' : 'false' }))}
                  className="rounded" /> Warranty Claimed
              </label>
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>Photos (Evidence)</label>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center" style={{ borderColor: '#E2E8F0' }}>
                  <Camera size={18} style={{ color: '#CBD5E1' }} />
                </div>
                <button className="text-xs px-3 py-2 rounded-lg font-medium" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                  Upload Photo
                </button>
                <span className="text-xs" style={{ color: '#94A3B8' }}>Max 5 files, JPEG/PNG/WebP, 5MB each</span>
              </div>
            </div>
            {formState.repairStatus === 'Completed' || formState.repairStatus === 'Write-Off' ? (
              <>
                <div className="mt-4">
                  <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>Resolution</label>
                  <textarea rows={2} placeholder="Describe the resolution..."
                    className="w-full text-sm border rounded-lg px-3 py-2 outline-none resize-none"
                    style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                    value={formState.resolution || ''}
                    onChange={e => setFormState(s => ({ ...s, resolution: e.target.value }))} />
                </div>
                <div className="mt-4">
                  <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>Resolved Date</label>
                  <input type="date"
                    className="w-full text-sm border rounded-lg px-3 py-2 outline-none"
                    style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                    value={formState.resolvedDate || ''}
                    onChange={e => setFormState(s => ({ ...s, resolvedDate: e.target.value }))} />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Hardware Damage"
        breadcrumbs={[{ label: 'Maintenance' }, { label: 'Hardware Damage' }]}
        primaryAction={{ label: 'Report Damage', onClick: () => setShowForm(true) }}
        secondaryActions={[{ label: 'Export CSV', onClick: () => {} }]}
        badge={{ label: `${allDamages.length} records`, color: '#DC2626' }}
      />
      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by product, SKU, or description..." className="bg-transparent text-sm outline-none flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
                  className="text-xs border rounded-lg px-2 py-1.5 outline-none" style={{ borderColor: '#E2E8F0', color: '#0F172A' }}>
                  <option value="All">All Severities</option>
                  <option>Minor</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                  <option>Critical</option>
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="text-xs border rounded-lg px-2 py-1.5 outline-none" style={{ borderColor: '#E2E8F0', color: '#0F172A' }}>
                  <option value="All">All Statuses</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Write-Off</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['ID', 'Product', 'SKU', 'Damage Date', 'Type', 'Severity', 'Repair Status', 'Est. Cost (₹)', 'Warranty', ''].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr key={d.id} className="border-t hover:bg-blue-50/30 transition-colors" style={{ borderColor: '#F1F5F9' }}>
                      <td className="px-3 py-3 font-mono" style={{ color: '#DC2626' }}>{d.id}</td>
                      <td className="px-3 py-3 font-medium" style={{ color: '#0F172A' }}>{d.productName}</td>
                      <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{d.productSku}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{d.damageDate}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{d.damageType}</td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: SEVERITY_COLORS[d.severity] + '18', color: SEVERITY_COLORS[d.severity] }}>
                          {d.severity}
                        </span>
                      </td>
                      <td className="px-3 py-3"><Badge label={d.repairStatus} variant={REPAIR_STATUS_VARIANT[d.repairStatus] as any} /></td>
                      <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>₹{d.estimatedRepairCost.toLocaleString()}</td>
                      <td className="px-3 py-3">
                        {d.warrantyClaimed
                          ? <Badge label={d.warrantyCovered ? 'Covered' : 'Not Covered'} variant={d.warrantyCovered ? 'success' : 'danger'} />
                          : <Badge label="Not Claimed" variant="gray" />}
                      </td>
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
              <span className="text-xs" style={{ color: '#94A3B8' }}>Showing {filtered.length} of {allDamages.length} records</span>
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