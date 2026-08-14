import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import {
  Phone,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  Menu,
  X,
  Lock,
  Search,
  Activity,
  HeartPulse,
  ChevronRight,
  AlertTriangle,
  User,
  UserCheck,
  UserPlus,
  LogIn,
} from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const { settings, activePublicView, setActivePublicView, setIsBookingModalOpen, setIsTrackerModalOpen, isAdminLoggedIn } = useHospital();
  const { user, userProfile, openAuthModal, openPatientPortal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'services', label: 'Services' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (viewId: string) => {
    setActivePublicView(viewId);
    setMobileMenuOpen(false);
    const element = document.getElementById(viewId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="hospital-main-navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100 transition-all">
      {/* Top Emergency & Info Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Emergency Hotline Alert */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-rose-600/90 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>24/7 Emergency</span>
            </div>
            <a
              href={`tel:${settings?.emergencyNumber || '+18009114357'}`}
              className="flex items-center gap-1.5 font-semibold text-rose-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              <span>Hotline: {settings?.emergencyNumber || '+1 (800) 911-4357'}</span>
            </a>
            <span className="hidden md:inline text-slate-600">|</span>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>OPD: 08:00 AM – 08:00 PM</span>
            </div>
          </div>

          {/* Right quick tools */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto flex-wrap">
            {/* Patient Auth / Portal Button in Top Bar */}
            {user ? (
              <button
                id="top-patient-portal-btn"
                onClick={openPatientPortal}
                className="flex items-center gap-1.5 text-teal-300 hover:text-teal-200 font-semibold px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border border-teal-800/40"
              >
                <div className="w-4 h-4 rounded-full bg-teal-500 text-slate-900 text-[10px] flex items-center justify-center font-bold">
                  {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <span>Patient Portal ({userProfile?.name || 'My Profile'})</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="top-patient-signin-btn"
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors font-medium px-2 py-1 rounded-md hover:bg-slate-800 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Patient Login</span>
                </button>
                <button
                  id="top-patient-signup-btn"
                  onClick={() => openAuthModal('signup')}
                  className="hidden sm:flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition-colors font-medium px-2 py-1 rounded-md hover:bg-slate-800 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            <span className="text-slate-700 font-light">|</span>

            {/* Track Ticket */}
            <button
              id="nav-track-appointment-btn"
              onClick={() => setIsTrackerModalOpen(true)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-medium px-2.5 py-1 rounded-md hover:bg-slate-800 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Track Ticket</span>
            </button>

            <span className="text-slate-700 font-light">|</span>

            {/* Admin Portal Header Button */}
            <button
              id="nav-admin-portal-btn"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold tracking-wide transition-all shadow-xs transform hover:scale-[1.02] cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-gradient-to-r from-emerald-950 to-teal-900 text-emerald-200 border border-emerald-500/60 hover:border-emerald-400 hover:from-emerald-900 hover:to-teal-800'
                  : 'bg-gradient-to-r from-cyan-950 via-slate-900 to-teal-950 text-cyan-200 hover:text-white border border-cyan-500/50 hover:border-cyan-400 hover:from-cyan-900 hover:to-teal-900'
              }`}
              title="Hospital Administration & OPD Command Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{isAdminLoggedIn ? 'Admin Dashboard (Active)' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Hospital Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-800 via-teal-700 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-900/10 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                  {settings?.hospitalName || 'Nexora'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Hospital
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                {settings?.tagline || 'Excellence in Medical Care'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activePublicView === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'text-cyan-800 bg-cyan-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2.5 lg:gap-3">
            {user ? (
              <button
                type="button"
                onClick={openPatientPortal}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-teal-600/60 bg-teal-50/60 hover:bg-teal-100/60 text-teal-900 font-semibold text-xs transition-all cursor-pointer shadow-xs"
              >
                <UserCheck className="w-4 h-4 text-teal-700" />
                <span>My Appointments</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-cyan-900 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-cyan-700" />
                <span>Patient Sign Up</span>
              </button>
            )}

            <button
              id="main-nav-admin-portal-btn"
              type="button"
              onClick={onOpenAdmin}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-cyan-900 bg-slate-100/90 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-200 transition-all cursor-pointer shadow-2xs"
              title="Hospital Administration Command"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-700" />
              <span>Admin Portal</span>
            </button>

            <button
              id="nav-book-appointment-btn"
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-800 hover:to-teal-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-900/15 hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          {/* Mobile User Profile Status */}
          {user ? (
            <div
              onClick={() => {
                setMobileMenuOpen(false);
                openPatientPortal();
              }}
              className="p-3 mb-2 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                  {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-950 block">
                    {userProfile?.name || user.email}
                  </span>
                  <span className="text-[10px] text-teal-700">View Appointments & Profile</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-teal-600" />
            </div>
          ) : (
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('signup');
                }}
                className="flex-1 py-2 rounded-xl bg-cyan-700 text-white text-xs font-bold text-center"
              >
                Patient Sign Up
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('signin');
                }}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold text-center"
              >
                Sign In
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-left cursor-pointer ${
                  activePublicView === link.id
                    ? 'bg-cyan-50 text-cyan-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsBookingModalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-cyan-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsTrackerModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Existing Appointment</span>
            </button>

            <button
              id="mobile-drawer-admin-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-3 rounded-xl bg-slate-900 border border-cyan-700/60 hover:border-cyan-500 text-cyan-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-98"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Hospital Admin & Command Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
