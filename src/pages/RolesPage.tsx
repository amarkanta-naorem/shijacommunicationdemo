import { useState } from 'react';
import { ShieldCheck, Users, Plus, Check, Minus, Eye } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { rolePermissions, permissionRoles } from '../data/mockData';

const ACCESS_LABEL: Record<string, string> = {
  full: 'Full Access',
  edit: 'Can Edit',
  view: 'View Only',
  none: 'No Access',
};

const ACCESS_COLOR: Record<string, string> = {
  full: '#16A34A',
  edit: '#2563EB',
  view: '#D97706',
  none: '#CBD5E1',
};

const ACCESS_ICON: Record<string, React.ReactNode> = {
  full: <Check size={12} />,
  edit: <Eye size={12} />,
  view: <Eye size={12} />,
  none: <Minus size={12} />,
};

const userCounts: Record<string, number> = {
  Administrator: 1,
  'Operations Manager': 1,
  'Store Keeper': 2,
  'Maintenance Engineer': 1,
  'Field Technician': 2,
  Viewer: 0,
};

export default function RolesPage() {
  const [matrix, setMatrix] = useState(rolePermissions);

  const cycle = (module: string, role: string) => {
    const order = ['none', 'view', 'edit', 'full'];
    setMatrix(prev => prev.map(m => {
      if (m.module !== module) return m;
      const current = m.roles[role as keyof typeof m.roles] ?? 'none';
      const next = order[(order.indexOf(current) + 1) % order.length];
      return { ...m, roles: { ...m.roles, [role]: next } };
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Roles & Permissions"
        breadcrumbs={[{ label: 'Administration' }, { label: 'Roles' }]}
        primaryAction={{ label: 'Create Role', onClick: () => {} }}
        badge={{ label: `${permissionRoles.length} roles`, color: '#7C3AED' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* Roles summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {permissionRoles.slice(0, 6).map((r, i) => {
              const colors = ['#7C3AED', '#2563EB', '#0891B2', '#D97706', '#16A34A', '#94A3B8'];
              const bgs = ['#F3E8FF', '#EFF6FF', '#ECFEFF', '#FEF3C7', '#DCFCE7', '#F1F5F9'];
              return (
                <div key={r} className="bg-white rounded-xl border p-4 flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: bgs[i] }}>
                    <ShieldCheck size={18} style={{ color: colors[i] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: '#0F172A' }}>{r}</div>
                    <div className="text-xs flex items-center gap-1" style={{ color: '#94A3B8' }}>
                      <Users size={11} /> {userCounts[r] ?? 0} user{(userCounts[r] ?? 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <Badge label={userCounts[r] ?? 0 > 0 ? 'Active' : 'Unassigned'} variant={(userCounts[r] ?? 0) > 0 ? 'success' : 'gray'} />
                </div>
              );
            })}
          </div>

          {/* Permission matrix */}
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Permission Matrix</div>
                <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                  Click a cell to cycle access: No Access → View Only → Can Edit → Full Access
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                {(['full', 'edit', 'view', 'none'] as const).map(k => (
                  <span key={k} className="flex items-center gap-1" style={{ color: ACCESS_COLOR[k] }}>
                    {ACCESS_ICON[k]} {ACCESS_LABEL[k]}
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>Module</th>
                    {permissionRoles.map(r => (
                      <th key={r} className="px-3 py-3 text-center font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map(m => (
                    <tr key={m.module} className="border-t" style={{ borderColor: '#F1F5F9' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: '#0F172A' }}>{m.module}</td>
                      {permissionRoles.map(role => {
                        const level = m.roles[role as keyof typeof m.roles] ?? 'none';
                        return (
                          <td key={role} className="px-2 py-2 text-center">
                            <button
                              onClick={() => cycle(m.module, role)}
                              className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all min-w-[64px]"
                              style={{
                                background: level === 'none' ? '#F1F5F9' : ACCESS_COLOR[level] + '15',
                                color: ACCESS_COLOR[level],
                                border: '1px solid ' + (level === 'none' ? '#E2E8F0' : ACCESS_COLOR[level]),
                              }}
                              title={`${role} — ${ACCESS_LABEL[level]}`}
                            >
                              {ACCESS_ICON[level]}
                              {ACCESS_LABEL[level]}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-4 border-t" style={{ borderColor: '#F1F5F9' }}>
              <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                <Plus size={13} /> Add Custom Module
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

