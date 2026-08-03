import { useState } from 'react';
import { Building2, Package, Fuel, Bell, Save, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';

const TABS = [
  { id: 'general', label: 'General', icon: <Building2 size={14} /> },
  { id: 'inventory', label: 'Inventory', icon: <Package size={14} /> },
  { id: 'fuel', label: 'Fuel', icon: <Fuel size={14} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
];

export default function Settings() {
  const [tab, setTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputs = (fields: { label: string; value: string; type?: string; hint?: string }[]) => (
    <div className="grid grid-cols-2 gap-4">
      {fields.map(f => (
        <div key={f.label}>
          <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>{f.label}</label>
          <input type={f.type || 'text'} defaultValue={f.value}
            className="w-full text-sm border rounded-lg px-3 py-2 outline-none"
            style={{ borderColor: '#E2E8F0', color: '#0F172A' }} />
          {f.hint && <div className="text-[11px] mt-1" style={{ color: '#94A3B8' }}>{f.hint}</div>}
        </div>
      ))}
    </div>
  );

  const toggles = (items: { label: string; desc: string; on: boolean }[]) => (
    <div className="flex flex-col gap-3">
      {items.map((t, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: '#E2E8F0' }}>
          <div>
            <div className="text-sm font-medium" style={{ color: '#0F172A' }}>{t.label}</div>
            <div className="text-xs" style={{ color: '#94A3B8' }}>{t.desc}</div>
          </div>
          <button
            onClick={() => {}}
            className="w-10 h-5.5 rounded-full relative transition-colors"
            style={{ background: t.on ? '#16A34A' : '#CBD5E1', height: 22 }}
          >
            <span className="absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-all"
              style={{ left: t.on ? 20 : 2 }} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Settings"
        breadcrumbs={[{ label: 'Administration' }, { label: 'Settings' }]}
        primaryAction={{ label: saved ? 'Saved ✓' : 'Save Changes', onClick: save }}
        badge={{ label: 'Workspace', color: '#2563EB' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4 max-w-4xl">
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-4 bg-white rounded-xl border p-1.5 w-fit" style={{ borderColor: '#E2E8F0' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium transition-colors"
                style={{ background: tab === t.id ? '#0F172A' : 'transparent', color: tab === t.id ? 'white' : '#64748B' }}>
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {saved && (
            <div className="mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm" style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' }}>
              <ShieldCheck size={15} /> Settings saved successfully.
            </div>
          )}

          {tab === 'general' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Company Information</div>
                {inputs([
                  { label: 'Company Name', value: 'Shija Communication' },
                  { label: 'Workspace Name', value: 'Operations Suite' },
                  { label: 'Contact Email', value: 'ops@shijacommunication.com', type: 'email' },
                  { label: 'Contact Phone', value: '+91 98625 44550', type: 'tel' },
                  { label: 'Address', value: 'Imphal, Manipur', hint: 'HQ / billing address' },
                  { label: 'Currency', value: 'INR (₹)', hint: 'Used across all modules' },
                ])}
              </div>
            </div>
          )}

          {tab === 'inventory' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Stock Thresholds</div>
                {inputs([
                  { label: 'Low Stock Alert %', value: 'Below min stock', hint: 'Trigger when current stock falls below minimum' },
                  { label: 'Default Reorder Qty', value: '2× min stock', hint: 'Multiplier used for reorder suggestions' },
                  { label: 'Critical Stock Level', value: '≤ 1 unit', hint: 'Flag as critical at this level' },
                  { label: 'Auto-deduct on checklist', value: 'Enabled', hint: 'Deduct replaced parts when WO closes' },
                ])}
              </div>
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Inventory Features</div>
                {toggles([
                  { label: 'Low stock email alerts', desc: 'Notify store keepers when items cross threshold', on: true },
                  { label: 'Require approval for stock out', desc: 'Manager approval before issuing materials', on: false },
                  { label: 'Batch / serial number tracking', desc: 'Track individual units for critical spares', on: true },
                ])}
              </div>
            </div>
          )}

          {tab === 'fuel' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Tank Configuration</div>
                {inputs([
                  { label: 'Diesel Tank Capacity (L)', value: '2000', type: 'number' },
                  { label: 'Diesel Reorder Level (L)', value: '800', type: 'number' },
                  { label: 'S/K Tank Capacity (L)', value: '500', type: 'number' },
                  { label: 'S/K Reorder Level (L)', value: '100', type: 'number' },
                  { label: 'Acceptable Loss %', value: '1.0', type: 'number', hint: 'Flag receipts above this loss %' },
                  { label: 'Fuel Rate (₹/L)', value: '86.50', type: 'number', hint: 'Used for fuel loss valuation' },
                ])}
              </div>
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Fuel Controls</div>
                {toggles([
                  { label: 'Fuel loss alerts', desc: 'Notify when a receipt exceeds acceptable loss %', on: true },
                  { label: 'Require machine/vehicle for issue', desc: 'Fuel Out requires a destination asset', on: true },
                  { label: 'Night issue approval', desc: 'Require supervisor approval 10PM – 6AM', on: false },
                ])}
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Notification Preferences</div>
                {toggles([
                  { label: 'Maintenance due reminders', desc: 'Email/notification 24h before scheduled PM', on: true },
                  { label: 'Work order assignment', desc: 'Notify technicians when assigned a job', on: true },
                  { label: 'Low stock alerts', desc: 'Store keeper notified on low stock items', on: true },
                  { label: 'Fuel threshold alerts', desc: 'Notify when tank hits reorder/critical', on: true },
                  { label: 'Weekly digest report', desc: 'Summary of all modules every Monday', on: false },
                ])}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

