import { useState } from 'react';
import { Droplets, TrendingDown, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { fuelStock, fuelTransactions } from '../data/mockData';

interface Props {
  fuel: 'diesel' | 'sk';
}

export default function FuelStock({ fuel }: Props) {
  const [search, setSearch] = useState('');
  const tank = fuelStock.find(f => f.id === fuel)!;
  const pct = Math.min(100, (tank.currentStock / tank.tankCapacity) * 100);
  const pctOfReorder = (tank.currentStock / tank.reorderLevel) * 100;

  const other = fuelStock.find(f => f.id !== fuel)!;

  const txns = fuelTransactions.filter(t =>
    t.fuelType.toLowerCase() === (fuel === 'diesel' ? 'diesel' : 's/k') &&
    JSON.stringify(t).toLowerCase().includes(search.toLowerCase())
  );

  const capacityLabel = fuel === 'diesel' ? 'Diesel Tank' : 'S/K Tank';

  return (
    <div className="flex flex-col h-full">
      <Header
        title={tank.name + ' Stock'}
        breadcrumbs={[{ label: 'Fuel' }, { label: tank.name + ' Stock' }]}
        secondaryActions={[{ label: 'Record Receipt', onClick: () => {} }]}
        badge={{ label: `${pct.toFixed(0)}% full`, color: pct < pctOfReorder ? '#D97706' : '#16A34A' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* Toggle between tanks */}
          <div className="flex items-center gap-2 mb-4">
            {fuelStock.map(f => (
              <a
                key={f.id}
                href={f.id === 'diesel' ? '#/fuel/diesel' : '#/fuel/sk'}
                onClick={e => e.preventDefault()}
                className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{ background: tank.id === f.id ? '#0F172A' : '#F1F5F9', color: tank.id === f.id ? 'white' : '#64748B' }}
              >
                {f.name} Stock
              </a>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Main tank gauge */}
            <div className="col-span-2 bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: tank.bg }}>
                    <Droplets size={20} style={{ color: tank.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>{capacityLabel}</div>
                    <div className="text-xs" style={{ color: '#94A3B8' }}>Capacity {tank.tankCapacity} {tank.unit}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold font-mono" style={{ color: tank.color }}>{tank.currentStock.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>litres in tank</div>
                </div>
              </div>

              {/* Tank fill bar */}
              <div className="h-6 rounded-full overflow-hidden mb-2" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct < pctOfReorder ? '#F59E0B' : tank.color }} />
              </div>
              <div className="flex justify-between text-[10px] mb-5" style={{ color: '#94A3B8' }}>
                <span>0</span>
                <span>Critical {tank.criticalLevel}</span>
                <span>Reorder {tank.reorderLevel}</span>
                <span>Full {tank.tankCapacity}</span>
              </div>

              {/* Thresholds */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Reorder Level', value: `${tank.reorderLevel} ${tank.unit}`, note: tank.currentStock <= tank.reorderLevel ? 'At / below reorder' : 'Above reorder', color: '#D97706', bg: '#FEF3C7' },
                  { label: 'Critical Level', value: `${tank.criticalLevel} ${tank.unit}`, note: tank.currentStock <= tank.criticalLevel ? 'CRITICAL — order now' : 'Safe', color: '#DC2626', bg: '#FEE2E2' },
                  { label: 'Estimated Days', value: '12 days', note: 'At avg. daily consumption 85L', color: '#2563EB', bg: '#EFF6FF' },
                ].map((s, i) => (
                  <div key={i} className="rounded-lg p-3 border flex items-start gap-2.5" style={{ background: s.bg, borderColor: '#E2E8F0' }}>
                    <div className="mt-0.5">
                      {i === 2 ? <RefreshCw size={14} style={{ color: s.color }} /> :
                        <TrendingDown size={14} style={{ color: s.color }} />}
                    </div>
                    <div>
                      <div className="text-[11px]" style={{ color: s.color }}>{s.label}</div>
                      <div className="text-base font-bold" style={{ color: '#0F172A' }}>{s.value}</div>
                      <div className="text-[10px]" style={{ color: '#94A3B8' }}>{s.note}</div>
                    </div>
                  </div>
                ))}
              </div>

              {tank.currentStock <= tank.reorderLevel && (
                <div className="mt-4 flex items-center gap-2.5 rounded-lg p-3" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
                  <AlertTriangle size={15} style={{ color: '#D97706' }} />
                  <span className="text-xs font-medium" style={{ color: '#92400E' }}>
                    {tank.name} stock is at reorder level. Raise a purchase request to avoid stock-out.
                  </span>
                </div>
              )}
            </div>

            {/* Side summary */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#64748B' }}>Other Tank</div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: other.bg }}>
                    <Droplets size={16} style={{ color: other.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium" style={{ color: '#0F172A' }}>{other.name}</div>
                    <div className="text-xs" style={{ color: '#94A3B8' }}>{other.currentStock.toLocaleString()} / {other.tankCapacity.toLocaleString()} {other.unit}</div>
                  </div>
                  <a href={other.id === 'diesel' ? '#/fuel/diesel' : '#/fuel/sk'} onClick={e => e.preventDefault()}
                    className="text-xs font-medium" style={{ color: '#2563EB' }}>View →</a>
                </div>
              </div>

              <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
                <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#64748B' }}>This Month</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#DCFCE7' }}>
                      <ArrowDownToLine size={14} style={{ color: '#16A34A' }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs" style={{ color: '#94A3B8' }}>Fuel In</div>
                      <div className="text-sm font-bold" style={{ color: '#0F172A' }}>{fuel === 'diesel' ? '1,995' : '198'} L</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F3E8FF' }}>
                      <ArrowUpFromLine size={14} style={{ color: '#7C3AED' }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs" style={{ color: '#94A3B8' }}>Fuel Out</div>
                      <div className="text-sm font-bold" style={{ color: '#0F172A' }}>{fuel === 'diesel' ? '1,380' : '20'} L</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                      <TrendingDown size={14} style={{ color: '#DC2626' }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs" style={{ color: '#94A3B8' }}>Loss</div>
                      <div className="text-sm font-bold" style={{ color: '#0F172A' }}>{fuel === 'diesel' ? '7' : '2'} L</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent transactions for this fuel */}
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
              <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Recent {tank.name} Transactions</div>
              <div className="text-xs" style={{ color: '#94A3B8' }}>Last updated {tank.lastUpdated}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['ID', 'Type', 'Date', 'Quantity', 'Party', 'Machine / Ref', 'Balance After', 'Remarks'].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txns.map(t => (
                    <tr key={t.id} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}>
                      <td className="px-3 py-3 font-mono" style={{ color: '#2563EB' }}>{t.id}</td>
                      <td className="px-3 py-3">
                        <Badge label={t.type === 'in' ? 'Fuel In' : 'Fuel Out'} variant={t.type === 'in' ? 'success' : 'purple'} />
                      </td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.date}</td>
                      <td className="px-3 py-3 font-semibold" style={{ color: t.type === 'in' ? '#16A34A' : '#7C3AED' }}>
                        {t.type === 'in' ? `+${(t as any).actualQty}L` : `-${(t as any).qty}L`}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#475569' }}>{t.type === 'in' ? (t as any).supplier : (t as any).issuedTo}</td>
                      <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{t.type === 'in' ? (t as any).invoiceNo : (t as any).machine || (t as any).department}</td>
                      <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>{t.type === 'in' ? `${(t as any).tankAfter}L` : `${(t as any).stockAfter}L`}</td>
                      <td className="px-3 py-3" style={{ color: '#94A3B8' }}>{(t as any).remarks || '—'}</td>
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

