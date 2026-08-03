import { useState } from 'react';
import { Search, Truck, Phone, Mail, MapPin, Package, IndianRupee, Clock, Plus, MoreHorizontal } from 'lucide-react';
import Header from '../components/Header';
import Badge, { statusBadge } from '../components/Badge';
import { suppliers, products } from '../data/mockData';

export default function Suppliers() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', 'Equipment', 'Fuel'];

  const filtered = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || s.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Suppliers"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Suppliers' }]}
        primaryAction={{ label: 'Add Supplier', onClick: () => {} }}
        secondaryActions={[{ label: 'Export', onClick: () => {} }]}
        badge={{ label: `${suppliers.length} suppliers`, color: '#16A34A' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* Stats strip */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Total Suppliers', value: suppliers.length, color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Equipment Suppliers', value: suppliers.filter(s => s.type === 'Equipment').length, color: '#16A34A', bg: '#DCFCE7' },
              { label: 'Fuel Suppliers', value: suppliers.filter(s => s.type === 'Fuel').length, color: '#D97706', bg: '#FEF3C7' },
              { label: 'Active', value: suppliers.filter(s => s.status === 'Active').length, color: '#7C3AED', bg: '#F3E8FF' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-lg border px-4 py-3 flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
                <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: s.bg }}>
                  <Truck size={15} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: '#0F172A' }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-xl border mb-4" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search supplier or contact..." className="bg-transparent text-sm outline-none flex-1" />
              </div>
              <div className="flex items-center gap-1">
                {types.map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{ background: typeFilter === t ? '#2563EB' : '#F1F5F9', color: typeFilter === t ? 'white' : '#64748B' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Supplier cards */}
          <div className="grid grid-cols-2 gap-4">
            {filtered.map(s => {
              const supplied = products.filter(p => p.supplier === s.name);
              return (
                <div key={s.id} className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ background: s.type === 'Fuel' ? '#ECFEFF' : '#EFF6FF', color: s.type === 'Fuel' ? '#0891B2' : '#2563EB' }}>
                        {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>{s.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge label={s.type} variant={s.type === 'Fuel' ? 'purple' : 'info'} />
                          {statusBadge(s.status)}
                        </div>
                      </div>
                    </div>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <MoreHorizontal size={15} style={{ color: '#94A3B8' }} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="flex items-center gap-2" style={{ color: '#475569' }}>
                      <Phone size={12} style={{ color: '#94A3B8' }} />{s.phone}
                    </div>
                    <div className="flex items-center gap-2" style={{ color: '#475569' }}>
                      <Mail size={12} style={{ color: '#94A3B8' }} />{s.email}
                    </div>
                    <div className="flex items-center gap-2" style={{ color: '#475569' }}>
                      <MapPin size={12} style={{ color: '#94A3B8' }} />{s.location}
                    </div>
                    <div className="flex items-center gap-2" style={{ color: '#475569' }}>
                      <Clock size={12} style={{ color: '#94A3B8' }} />{s.leadTime}
                    </div>
                  </div>

                  <div className="border-t pt-3 grid grid-cols-3 gap-2" style={{ borderColor: '#F1F5F9' }}>
                    <div>
                      <div className="text-[11px] flex items-center gap-1" style={{ color: '#94A3B8' }}>
                        <Package size={11} /> Items
                      </div>
                      <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>{supplied.length}</div>
                    </div>
                    <div>
                      <div className="text-[11px] flex items-center gap-1" style={{ color: '#94A3B8' }}>
                        <IndianRupee size={11} /> Total Value
                      </div>
                      <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>₹{s.totalValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px]" style={{ color: '#94A3B8' }}>Last Order</div>
                      <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>{s.lastOrder}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

