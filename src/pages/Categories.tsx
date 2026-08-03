import { useState } from 'react';
import { Search, Tag, Package, AlertTriangle, Plus, MoreHorizontal } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { categories, products } from '../data/mockData';

export default function Categories() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  const filteredCats = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const catProducts = (catId: string) =>
    products.filter(p => p.category === catId);

  const countFor = (catId: string) => products.filter(p => p.category === catId).length;
  const lowFor = (catId: string) => products.filter(p => p.category === catId && p.currentStock < p.minStock).length;
  const valueFor = (catId: string) => products.filter(p => p.category === catId).reduce((s, p) => s + p.unitPrice * p.currentStock, 0);

  const activeProducts = activeCat === 'All'
    ? products
    : products.filter(p => p.category === activeCat);

  const filteredProducts = activeProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Categories"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Categories' }]}
        primaryAction={{ label: 'Add Category', onClick: () => {} }}
        badge={{ label: `${categories.length} categories`, color: '#2563EB' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* Stats strip */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Total Categories', value: categories.length, color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Total Products', value: products.length, color: '#16A34A', bg: '#DCFCE7' },
              { label: 'Low Stock Items', value: products.filter(p => p.currentStock < p.minStock).length, color: '#DC2626', bg: '#FEE2E2' },
              { label: 'Category Value', value: `₹${categories.reduce((s, c) => s + valueFor(c.id), 0).toLocaleString()}`, color: '#D97706', bg: '#FEF3C7' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-lg border px-4 py-3 flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
                <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: s.bg }}>
                  <Tag size={15} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: '#0F172A' }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {filteredCats.map(cat => {
              const count = countFor(cat.id);
              const low = lowFor(cat.id);
              const value = valueFor(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className="bg-white rounded-xl border p-5 text-left transition-all"
                  style={{
                    borderColor: activeCat === cat.id ? cat.color : '#E2E8F0',
                    boxShadow: activeCat === cat.id ? '0 0 0 1px ' + cat.color : '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: cat.bg }}>
                      <Package size={18} style={{ color: cat.color }} />
                    </div>
                    <Badge label={`${count} products`} variant={activeCat === cat.id ? 'blue' : 'gray'} />
                  </div>
                  <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>{cat.name}</div>
                  <div className="text-xs mt-1 mb-3" style={{ color: '#94A3B8' }}>{cat.description}</div>
                  <div className="flex items-center justify-between text-xs border-t pt-3" style={{ borderColor: '#F1F5F9' }}>
                    <span style={{ color: '#64748B' }}>Stock Value</span>
                    <span className="font-semibold" style={{ color: '#0F172A' }}>₹{value.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2">
                    <span style={{ color: '#64748B' }}>Low / Critical</span>
                    <span className="font-semibold flex items-center gap-1" style={{ color: low > 0 ? '#DC2626' : '#16A34A' }}>
                      {low > 0 && <AlertTriangle size={11} />}
                      {low}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Products by category */}
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search category or product..." className="bg-transparent text-sm outline-none flex-1" />
              </div>
              <div className="flex items-center gap-1">
                {['All', ...categories.map(c => c.id)].map(c => (
                  <button key={c} onClick={() => setActiveCat(c)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{ background: activeCat === c ? '#2563EB' : '#F1F5F9', color: activeCat === c ? 'white' : '#64748B' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['SKU', 'Product Name', 'Category', 'Supplier', 'Current Stock', 'Min Stock', 'Unit Price', 'Stock Value', 'Status', ''].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => {
                    const isLow = p.currentStock < p.minStock;
                    const cat = categories.find(c => c.id === p.category);
                    return (
                      <tr key={p.id} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}>
                        <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{p.sku}</td>
                        <td className="px-3 py-3 font-medium" style={{ color: '#0F172A' }}>{p.name}</td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: cat?.color }} />
                            <span style={{ color: '#475569' }}>{p.category}</span>
                          </span>
                        </td>
                        <td className="px-3 py-3" style={{ color: '#475569' }}>{p.supplier}</td>
                        <td className="px-3 py-3 font-semibold" style={{ color: isLow ? '#DC2626' : '#16A34A' }}>{p.currentStock}</td>
                        <td className="px-3 py-3" style={{ color: '#475569' }}>{p.minStock}</td>
                        <td className="px-3 py-3" style={{ color: '#475569' }}>₹{p.unitPrice.toLocaleString()}</td>
                        <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>₹{(p.unitPrice * p.currentStock).toLocaleString()}</td>
                        <td className="px-3 py-3">
                          {isLow ? <Badge label="Low Stock" variant="danger" /> : <Badge label="In Stock" variant="success" />}
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
          </div>
        </div>
      </div>
    </div>
  );
}

