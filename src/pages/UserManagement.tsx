import { Search, ShieldCheck, Plus } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';

const users = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@company.com', role: 'Store Keeper', dept: 'Stores', status: 'Active', lastLogin: '2025-07-30 09:14' },
  { id: 2, name: 'Amit Verma', email: 'amit@company.com', role: 'Field Technician', dept: 'Maintenance', status: 'Active', lastLogin: '2025-07-30 10:32' },
  { id: 3, name: 'Vikram Singh', email: 'vikram@company.com', role: 'Maintenance Engineer', dept: 'Maintenance', status: 'Active', lastLogin: '2025-07-29 16:45' },
  { id: 4, name: 'Manoj P.', email: 'manoj@company.com', role: 'Field Technician', dept: 'Operations', status: 'Active', lastLogin: '2025-07-29 11:20' },
  { id: 5, name: 'Suresh M.', email: 'suresh@company.com', role: 'Store Keeper', dept: 'Stores', status: 'Active', lastLogin: '2025-07-28 14:00' },
  { id: 6, name: 'Priya R.', email: 'priya@company.com', role: 'Operations Manager', dept: 'Management', status: 'Active', lastLogin: '2025-07-30 08:00' },
  { id: 7, name: 'Arun K.', email: 'arun@company.com', role: 'Administrator', dept: 'IT', status: 'Active', lastLogin: '2025-07-30 07:55' },
];

const roles = [
  { role: 'Administrator', users: 1, access: 'Complete access to all modules', color: '#7C3AED' },
  { role: 'Operations Manager', users: 1, access: 'Dashboard, Reports, read-only all modules', color: '#2563EB' },
  { role: 'Store Keeper', users: 2, access: 'Inventory module full access', color: '#0891B2' },
  { role: 'Maintenance Engineer', users: 1, access: 'Maintenance module full access', color: '#D97706' },
  { role: 'Field Technician', users: 2, access: 'Checklists, Work Orders', color: '#16A34A' },
  { role: 'Viewer', users: 0, access: 'Read-only across all modules', color: '#94A3B8' },
];

export default function UserManagement() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="User Management"
        breadcrumbs={[{ label: 'Administration' }, { label: 'Users' }]}
        primaryAction={{ label: 'Invite User', onClick: () => {} }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Users Table */}
            <div className="col-span-1 bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
                <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Users ({users.length})</div>
                <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                  <Search size={12} style={{ color: '#94A3B8' }} />
                  <input placeholder="Search users..." className="bg-transparent text-xs outline-none w-28" />
                </div>
              </div>
              <div className="divide-y" style={{ borderColor: '#F8FAFC' }}>
                {users.map(u => (
                  <div key={u.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                      style={{ background: '#2563EB' }}>
                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium" style={{ color: '#0F172A' }}>{u.name}</div>
                      <div className="text-xs" style={{ color: '#94A3B8' }}>{u.email}</div>
                    </div>
                    <div className="text-right">
                      <Badge label={u.role} variant="info" />
                      <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>{u.dept}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Roles */}
            <div className="col-span-1 bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Roles & Permissions</div>
                <button className="text-xs px-2.5 py-1 rounded-lg" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                  + New Role
                </button>
              </div>
              <div className="divide-y" style={{ borderColor: '#F8FAFC' }}>
                {roles.map(r => (
                  <div key={r.role} className="px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} style={{ color: r.color }} />
                        <span className="text-sm font-medium" style={{ color: '#0F172A' }}>{r.role}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F1F5F9', color: '#64748B' }}>
                        {r.users} user{r.users !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: '#94A3B8' }}>{r.access}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
