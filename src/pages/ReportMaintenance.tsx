import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wrench, Zap, CheckCircle2, Clock, FileDown } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { maintenanceJobs, maintenanceStats, generators } from '../data/mockData';

const STATUS_COLORS = ['#2563EB', '#F59E0B', '#16A34A'];

export default function ReportMaintenance() {
  const [type, setType] = useState('All');

  const filtered = maintenanceJobs.filter(j => type === 'All' || j.type === type);

  const statusData = ['Scheduled', 'In Progress', 'Completed'].map(s => ({
    name: s,
    value: maintenanceJobs.filter(j => j.type !== 'All' && j.status === s).length || maintenanceJobs.filter(j => j.status === s).length,
  }));

  const typeData = ['PM', 'CM'].map(t => ({
    name: t,
    value: filtered.filter(j => j.type === t).length,
  }));

  const pmCount = maintenanceJobs.filter(j => j.type === 'PM').length;
  const cmCount = maintenanceJobs.filter(j => j.type === 'CM').length;
  const completed = maintenanceJobs.filter(j => j.status === 'Completed').length;
  const pending = maintenanceJobs.filter(j => j.status !== 'Completed').length;

  const avgRunHours = Math.round(maintenanceJobs.reduce((s, j) => s + j.runningHours, 0) / maintenanceJobs.length);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Maintenance Report"
        breadcrumbs={[{ label: 'Reports' }, { label: 'Maintenance' }]}
        secondaryActions={[{ label: 'Export PDF', onClick: () => {} }]}
        badge={{ label: `${maintenanceJobs.length} work orders`, color: '#D97706' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'PM Jobs', value: pmCount, color: '#2563EB', bg: '#EFF6FF', icon: <Wrench size={15} /> },
              { label: 'CM Jobs', value: cmCount, color: '#D97706', bg: '#FEF3C7', icon: <Zap size={15} /> },
              { label: 'Completed', value: completed, color: '#16A34A', bg: '#DCFCE7', icon: <CheckCircle2 size={15} /> },
              { label: 'Pending', value: pending, color: '#DC2626', bg: '#FEE2E2', icon: <Clock size={15} /> },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border px-5 py-4 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                <div>
                  <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>{s.label}</div>
                </div>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>{s.icon}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Monthly trend */}
            <div className="col-span-2 bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Monthly Completion</div>
              <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>PM vs CM over 6 months</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={maintenanceStats} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="pm" name="Preventive" fill="#2563EB" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="cm" name="Complaint" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status donut */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Job Status</div>
              <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>All work orders</div>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" paddingAngle={3}>
                    {statusData.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 mt-2">
                {statusData.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5" style={{ color: '#475569' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[i] }} />{s.name}
                    </span>
                    <span className="font-semibold" style={{ color: '#0F172A' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work orders table */}
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Work Order Log</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {['All', 'PM', 'CM'].map(t => (
                    <button key={t} onClick={() => setType(t)}
                      className="text-xs px-2.5 py-1.5 rounded-lg font-medium"
                      style={{ background: type === t ? '#2563EB' : '#F1F5F9', color: type === t ? 'white' : '#64748B' }}>
                      {t}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#2563EB' }}>
                  <FileDown size={12} /> Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['WO #', 'Type', 'Generator', 'Site', 'Technician', 'Run Hrs', 'Date', 'Priority', 'Status'].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(j => (
                    <tr key={j.id} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}>
                      <td className="px-3 py-3 font-mono font-medium" style={{ color: '#2563EB' }}>{j.id}</td>
                      <td className="px-3 py-3"><Badge label={j.type} variant={j.type === 'PM' ? 'info' : 'warning'} /></td>
                      <td className="px-3 py-3 font-medium" style={{ color: '#0F172A' }}>{j.generator}</td>
                      <td className="px-3 py-3" style={{ color: '#64748B' }}>{j.site}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{j.technician}</td>
                      <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{j.runningHours.toLocaleString()}</td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{j.scheduledDate}</td>
                      <td className="px-3 py-3">
                        <Badge label={j.priority} variant={j.priority === 'High' ? 'warning' : j.priority === 'Critical' ? 'danger' : 'gray'} />
                      </td>
                      <td className="px-3 py-3">
                        <Badge label={j.status} variant={j.status === 'Completed' ? 'success' : j.status === 'In Progress' ? 'info' : 'warning'} />
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

