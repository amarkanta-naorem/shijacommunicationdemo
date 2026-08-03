import { useState } from 'react';
import {
  LayoutDashboard, Package, ChevronDown, ChevronRight,
  ArrowDownToLine, ArrowUpFromLine, History, AlertTriangle,
  Wrench, ClipboardList, Calendar, Zap, Droplets,
  BarChart3, Users, Settings, ShieldCheck, Tag, Truck,
  Layers, BellDot, LogOut, Search, Fuel
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  id: string;
  children?: { label: string; id: string; icon?: React.ReactNode }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={17} />, id: 'dashboard' },
  {
    label: 'Inventory', icon: <Package size={17} />, id: 'inventory',
    children: [
      { label: 'Products', id: 'products', icon: <Layers size={14} /> },
      // { label: 'Categories', id: 'categories', icon: <Tag size={14} /> },
      { label: 'Suppliers', id: 'suppliers', icon: <Truck size={14} /> },
      { label: 'Stock In', id: 'stock-in', icon: <ArrowDownToLine size={14} /> },
      { label: 'Stock Out', id: 'stock-out', icon: <ArrowUpFromLine size={14} /> },
      { label: 'Current Stock', id: 'current-stock', icon: <Package size={14} /> },
      { label: 'Inventory History', id: 'inventory-history', icon: <History size={14} /> },
      { label: 'Low Stock', id: 'low-stock', icon: <AlertTriangle size={14} /> },
    ]
  },
  {
    label: 'Maintenance', icon: <Wrench size={17} />, id: 'maintenance',
    children: [
      { label: 'Preventive (PM)', id: 'preventive-maintenance', icon: <ClipboardList size={14} /> },
      { label: 'Complaint (CM)', id: 'complaint-maintenance', icon: <Zap size={14} /> },
      { label: 'Digital Checklist', id: 'checklist', icon: <ClipboardList size={14} /> },
      { label: 'Work Orders', id: 'work-orders', icon: <Wrench size={14} /> },
      { label: 'Maint. Calendar', id: 'calendar', icon: <Calendar size={14} /> },
    ]
  },
  {
    label: 'Fuel', icon: <Fuel size={17} />, id: 'fuel',
    children: [
      { label: 'Fuel In', id: 'fuel-in', icon: <ArrowDownToLine size={14} /> },
      { label: 'Fuel Out', id: 'fuel-out', icon: <ArrowUpFromLine size={14} /> },
      { label: 'Diesel Stock', id: 'diesel', icon: <Droplets size={14} /> },
      { label: 'S/K Stock', id: 'sk', icon: <Droplets size={14} /> },
      { label: 'Fuel History', id: 'fuel-history', icon: <History size={14} /> },
    ]
  },
  {
    label: 'Reports', icon: <BarChart3 size={17} />, id: 'reports',
    children: [
      { label: 'Overall Report', id: 'report-overall', icon: <BarChart3 size={14} /> },
      { label: 'Date Range', id: 'report-date', icon: <Calendar size={14} /> },
      { label: 'Product Wise', id: 'report-product', icon: <Package size={14} /> },
      { label: 'Supplier Wise', id: 'report-supplier', icon: <Truck size={14} /> },
      { label: 'Maintenance Reports', id: 'report-maintenance', icon: <Wrench size={14} /> },
      { label: 'Fuel Reports', id: 'report-fuel', icon: <Fuel size={14} /> },
    ]
  },
  {
    label: 'Administration', icon: <ShieldCheck size={17} />, id: 'admin',
    children: [
      { label: 'Users', id: 'users', icon: <Users size={14} /> },
      { label: 'Roles & Permissions', id: 'roles', icon: <ShieldCheck size={14} /> },
      { label: 'Settings', id: 'settings', icon: <Settings size={14} /> },
    ]
  },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [expanded, setExpanded] = useState<string[]>(['inventory', 'maintenance']);

  const toggle = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const isChildActive = (item: NavItem) =>
    item.children?.some(c => c.id === activePage);

  return (
    <aside style={{ background: '#0F172A', width: 240, minWidth: 240 }} className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: '#1E293B' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2563EB' }}>
          <Zap size={16} color="white" />
        </div>
        <div>
          <div className="text-white font-semibold text-sm leading-tight">Shija Communication</div>
          <div className="text-xs" style={{ color: '#475569' }}>Operations Suite</div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#1E293B' }}>
          <Search size={16} style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-transparent text-xs outline-none w-full"
            style={{ color: '#94A3B8' }}
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 sidebar-scroll">
        {navItems.map(item => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expanded.includes(item.id);
          const isActive = activePage === item.id || isChildActive(item);

          return (
            <div key={item.id} className="mb-0.5">
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggle(item.id);
                    if (item.children?.[0]) onNavigate(item.children[0].id);
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                style={{
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  background: isActive && !hasChildren ? '#2563EB' : isActive ? '#1E293B' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#1E293B';
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <span style={{ color: isActive ? (hasChildren ? '#60A5FA' : '#FFFFFF') : '#64748B' }}>
                  {item.icon}
                </span>
                <span className="text-xs font-medium flex-1">{item.label}</span>
                {hasChildren && (
                  <span style={{ color: '#475569' }}>
                    {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </span>
                )}
              </button>

              {hasChildren && isExpanded && (
                <div className="ml-3 pl-3 mt-0.5 mb-1" style={{ borderLeft: '1px solid #1E293B' }}>
                  {item.children!.map(child => (
                    <button
                      key={child.id}
                      onClick={() => onNavigate(child.id)}
                      className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left transition-colors"
                      style={{
                        color: activePage === child.id ? '#60A5FA' : '#64748B',
                        background: activePage === child.id ? '#1E3A5F' : 'transparent',
                        fontSize: 12,
                      }}
                      onMouseEnter={e => {
                        if (activePage !== child.id) (e.currentTarget as HTMLButtonElement).style.background = '#1E293B';
                        if (activePage !== child.id) (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8';
                      }}
                      onMouseLeave={e => {
                        if (activePage !== child.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        if (activePage !== child.id) (e.currentTarget as HTMLButtonElement).style.color = '#64748B';
                      }}
                    >
                      {child.icon && <span>{child.icon}</span>}
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t" style={{ borderColor: '#1E293B' }}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: '#2563EB' }}>DA</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">Dhanabir Athokpam</div>
            <div className="text-xs" style={{ color: '#475569' }}>Operations Head</div>
          </div>
          <button style={{ color: '#475569' }}>
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
