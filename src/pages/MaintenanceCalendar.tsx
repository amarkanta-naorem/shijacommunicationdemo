import { useState } from 'react';
import { ChevronLeft, ChevronRight, Wrench, Zap, CalendarDays, Plus } from 'lucide-react';
import Header from '../components/Header';
import Badge, { statusBadge } from '../components/Badge';
import { calendarEvents } from '../data/mockData';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function MaintenanceCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthLabel = new Date(viewDate.year, viewDate.month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const cells = buildMonthGrid(viewDate.year, viewDate.month);

  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = (d: number) => `${viewDate.year}-${pad(viewDate.month + 1)}-${pad(d)}`;

  const eventsFor = (d: number) => calendarEvents.filter(e => e.date === dateStr(d));

  const selectedEvents = selectedDate ? calendarEvents.filter(e => e.date === selectedDate) : [];

  const prevMonth = () => {
    setViewDate(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
    setSelectedDate(null);
  };
  const nextMonth = () => {
    setViewDate(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
    setSelectedDate(null);
  };

  const isToday = (d: number) => {
    const t = new Date();
    return t.getFullYear() === viewDate.year && t.getMonth() === viewDate.month && t.getDate() === d;
  };

  const pmCount = calendarEvents.filter(e => e.date.startsWith(`${viewDate.year}-${pad(viewDate.month + 1)}`) && e.type === 'PM').length;
  const cmCount = calendarEvents.filter(e => e.date.startsWith(`${viewDate.year}-${pad(viewDate.month + 1)}`) && e.type === 'CM').length;

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Maintenance Calendar"
        breadcrumbs={[{ label: 'Maintenance' }, { label: 'Calendar' }]}
        primaryAction={{ label: 'Schedule Job', onClick: () => {} }}
        badge={{ label: `${pmCount} PM · ${cmCount} CM`, color: '#2563EB' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Calendar */}
            <div className="col-span-2 bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
              {/* Month header */}
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} style={{ color: '#2563EB' }} />
                  <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>{monthLabel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100" style={{ color: '#64748B' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => { setViewDate({ year: today.getFullYear(), month: today.getMonth() }); setSelectedDate(null); }}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                    Today
                  </button>
                  <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100" style={{ color: '#64748B' }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 border-b" style={{ borderColor: '#F1F5F9', background: '#F8FAFC' }}>
                {WEEKDAYS.map(d => (
                  <div key={d} className="px-2 py-2 text-center text-xs font-semibold" style={{ color: '#64748B' }}>{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7">
                {cells.map((d, i) => {
                  if (d === null) return <div key={i} className="min-h-[92px] border-b" style={{ borderColor: '#F8FAFC', background: '#FAFAFA' }} />;
                  const events = eventsFor(d);
                  const isSel = selectedDate === dateStr(d);
                  const todayFlag = isToday(d);
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDate(dateStr(d))}
                      className="min-h-[92px] border-b cursor-pointer transition-colors hover:bg-blue-50/30 p-2"
                      style={{
                        borderColor: '#F1F5F9',
                        background: isSel ? '#EFF6FF' : 'white',
                        boxShadow: isSel ? 'inset 0 0 0 2px #2563EB' : 'none',
                      }}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1.5 ${todayFlag ? 'text-white' : ''}`}
                        style={{ background: todayFlag ? '#2563EB' : 'transparent', color: todayFlag ? 'white' : '#475569' }}>
                        {d}
                      </div>
                      <div className="flex flex-col gap-1">
                        {events.slice(0, 2).map(e => (
                          <div key={e.id} className="text-[10px] px-1.5 py-0.5 rounded font-medium truncate"
                            style={{
                              background: e.type === 'PM' ? '#EFF6FF' : '#FEF3C7',
                              color: e.type === 'PM' ? '#2563EB' : '#D97706',
                            }}>
                            {e.type === 'PM' ? <Wrench size={9} className="inline mr-1" style={{ verticalAlign: -1 }} /> : <Zap size={9} className="inline mr-1" style={{ verticalAlign: -1 }} />}
                            {e.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: '#F1F5F9', color: '#64748B' }}>
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side panel: selected day details */}
            <div className="bg-white rounded-xl border h-fit" style={{ borderColor: '#E2E8F0' }}>
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select a date'}
                  </div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>
                    {selectedDate ? `${selectedEvents.length} work order(s)` : 'Click a date to view jobs'}
                  </div>
                </div>
                <button className="text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                  <Plus size={12} /> New
                </button>
              </div>

              <div className="p-4">
                {selectedDate === null ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: '#F1F5F9' }}>
                      <CalendarDays size={22} style={{ color: '#CBD5E1' }} />
                    </div>
                    <div className="text-xs" style={{ color: '#94A3B8' }}>
                      Select a date on the calendar to see scheduled maintenance work orders.
                    </div>
                  </div>
                ) : selectedEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: '#DCFCE7' }}>
                      <Wrench size={22} style={{ color: '#16A34A' }} />
                    </div>
                    <div className="text-sm font-medium" style={{ color: '#0F172A' }}>No jobs scheduled</div>
                    <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>This date is free. Schedule a new work order.</div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {selectedEvents.map(e => (
                      <div key={e.id} className="border rounded-xl p-3" style={{ borderColor: '#E2E8F0' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-medium" style={{ color: '#2563EB' }}>{e.id}</span>
                          <Badge label={e.type} variant={e.type === 'PM' ? 'info' : 'warning'} />
                        </div>
                        <div className="text-sm font-medium" style={{ color: '#0F172A' }}>{e.generator}</div>
                        <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>{e.site}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: '#F1F5F9' }}>
                          <span className="text-xs" style={{ color: '#475569' }}>{e.technician}</span>
                          {statusBadge(e.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

