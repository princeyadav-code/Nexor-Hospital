import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Settings,
  Globe,
  LogOut,
  ChevronRight,
  Menu,
  X,
  HeartPulse,
  Bell,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  onExitAdmin: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onExitAdmin }) => {
  const {
    adminTab,
    setAdminTab,
    adminUser,
    adminLogout,
    settings,
    resetDatabaseDefaults,
    appointments,
  } = useHospital();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;

  const navItems: {
    id: 'overview' | 'doctors' | 'departments' | 'appointments' | 'settings' | 'content';
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'doctors', label: 'Doctor Management', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: pendingCount },
    { id: 'settings', label: 'Hospital Information', icon: Settings },
    { id: 'content', label: 'Homepage Content', icon: Globe },
  ];

  const handleNav = (tab: typeof adminTab) => {
    setAdminTab(tab);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    adminLogout();
    onExitAdmin();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="font-bold font-serif text-white text-sm">Nexora Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExitAdmin}
            className="p-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white"
            title="View Live Website"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-cyan-950">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold font-serif text-white tracking-tight">
                  {settings?.hospitalName || 'Nexora'} Admin
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-emerald-400 font-medium">Hospital Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
              Hospital Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-700 text-white shadow-md shadow-cyan-950/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Public Website Preview</span>
          </button>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-cyan-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                AD
              </div>
              <div className="truncate text-xs">
                <span className="font-bold text-white block truncate">
                  {adminUser?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-400 truncate">Super Admin</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col bg-slate-950 overflow-y-auto">
        {/* Top Navbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400">Admin Control</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-bold text-white capitalize">
              {navItems.find((n) => n.id === adminTab)?.label || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetDatabaseDefaults}
              className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/50 transition-colors flex items-center gap-1.5"
              title="Restore initial database sample"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Sample DB</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-300 text-xs font-semibold border border-cyan-700/40 transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Public Website</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
};
