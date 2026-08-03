import { useState } from 'react';
import { Search, Wrench, ClipboardList, Plus, MoreHorizontal } from 'lucide-react';
import Header from '../components/Header';
import Badge, { statusBadge } from '../components/Badge';
import { maintenanceJobs } from '../data/mockData';

interface Props {
  type: 'PM' | 'CM';
  onNavigate: (p: string) => void;
}

export default function MaintenanceList({ type, onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const jobs = maintenanceJobs.filter(j => j.type === type);
  const filtered = jobs.filter(j => {
    const matchSearch = j.generator.toLowerCase().includes(search.toLowerCase()) || j.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ['All', 'Scheduled', 'In Progress', 'Completed'];
  const title = type === 'PM' ? 'Preventive Maintenance' : 'Complaint Maintenance';

  return (
    <div className="flex flex-col h-full">
      <Header
        title={title}
        breadcrumbs={[{ label: 'Maintenance' }, { label: type === 'PM' ? 'Preventive' : 'Complaint' }]}
        primaryAction={{ label: type === 'PM' ? 'Schedule PM' : 'Log Complaint', onClick: () => onNavigate('checklist') }}
        badge={{ label: `${jobs.length} work orders`, color: '#2563EB' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Scheduled', value: jobs.filter(j => j.status === 'Scheduled').length, color: '#D97706', bg: '#FEF3C7' },
              { label: 'In Progress', value: jobs.filter(j => j.status === 'In Progress').length, color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Completed', value: jobs.filter(j => j.status === 'Completed').length, color: '#16A34A', bg: '#DCFCE7' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-lg border px-4 py-3 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                <div>
                  <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>{s.label}</div>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                  <Wrench size={16} style={{ color: s.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by generator or work order ID..."
                  className="bg-transparent text-sm outline-none flex-1" />
              </div>
              <div className="flex items-center gap-1">
                {statuses.map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{ background: statusFilter === s ? '#2563EB' : '#F1F5F9', color: statusFilter === s ? 'white' : '#64748B' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Work Order', 'Generator', 'Site', 'Technician', 'Scheduled Date', 'Run Hours', 'Priority', 'Status', type === 'CM' ? 'Complaint' : 'Action', ''].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(job => (
                    <tr key={job.id} className="border-t hover:bg-blue-50/30 transition-colors cursor-pointer" style={{ borderColor: '#F1F5F9' }}
                      onClick={() => onNavigate('checklist')}>
                      <td className="px-3 py-3">
                        <span className="font-mono font-medium" style={{ color: '#2563EB' }}>{job.id}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium" style={{ color: '#0F172A' }}>{job.generator}</div>
                      </td>
                      <td className="px-3 py-3" style={{ color: '#64748B' }}>{job.site}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{job.technician}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{job.scheduledDate}</td>
                      <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{job.runningHours.toLocaleString()} h</td>
                      <td className="px-3 py-3">{statusBadge(job.priority)}</td>
                      <td className="px-3 py-3">{statusBadge(job.status)}</td>
                      <td className="px-3 py-3">
                        {type === 'CM' && job.complaint
                          ? <span style={{ color: '#DC2626' }} className="font-medium">{job.complaint}</span>
                          : <button onClick={e => { e.stopPropagation(); onNavigate('checklist'); }}
                            className="text-xs px-2.5 py-1 rounded-md font-medium"
                            style={{ background: '#EFF6FF', color: '#2563EB' }}>
                            Open Checklist
                          </button>
                        }
                      </td>
                      <td className="px-3 py-3">
                        <button className="p-1 rounded hover:bg-gray-100" onClick={e => e.stopPropagation()}>
                          <MoreHorizontal size={15} style={{ color: '#94A3B8' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
