import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { settings, departments, setActivePublicView, setIsBookingModalOpen, setIsTrackerModalOpen } = useHospital();

  const handleNav = (id: string) => {
    setActivePublicView(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Top Banner */}
      <div className="border-b border-slate-900 bg-slate-900/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xl font-bold text-white font-serif">
                {settings?.hospitalName || 'Nexora Hospital'}
              </span>
              <p className="text-xs text-slate-400">
                {settings?.tagline || 'Advancing Medicine. Empowering Life.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-md transition-colors"
            >
              Book OPD Appointment
            </button>
            <button
              onClick={() => setIsTrackerModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              Track Appointment Slip
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: About & Emergency */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              Emergency & Trauma Center
            </h4>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Our trauma ICU and cardiac catheterization units operate 24/7 with zero admission delays and air ambulance transport.
            </p>

            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/40 text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-300">
                <Phone className="w-4 h-4" />
                <span>24/7 Trauma Dispatch</span>
              </div>
              <p className="text-base font-mono font-bold text-white">
                {settings?.emergencyNumber || '+1 (800) 911-4357'}
              </p>
            </div>

            <div className="pt-2 text-slate-400 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{settings?.address || '450 Health Sciences Parkway, Metro Medical District, NY 10016'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{settings?.email || 'care@nexorahospital.com'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              Quick Navigation
            </h4>
            <ul className="space-y-2">
              {['home', 'about', 'departments', 'doctors', 'services', 'facilities', 'contact'].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => handleNav(id)}
                    className="hover:text-cyan-400 transition-colors capitalize flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span>{id === 'home' ? 'Home Page' : id.replace('-', ' ')}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Clinical Departments */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              Key Departments
            </h4>
            <ul className="space-y-2">
              {departments.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => handleNav('departments')}
                    className="hover:text-cyan-400 transition-colors truncate max-w-[180px] block"
                  >
                    {dept.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Operating Hours & Staff portal */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              Operating Hours
            </h4>
            <div className="space-y-2 text-slate-400">
              <div>
                <span className="text-slate-300 block font-medium">Outpatient Clinic (OPD):</span>
                <span>{settings?.workingHours?.opd || '08:00 AM - 08:00 PM'}</span>
              </div>
              <div>
                <span className="text-slate-300 block font-medium">Critical Care / ICU:</span>
                <span className="text-emerald-400 font-semibold">24 Hours / 7 Days</span>
              </div>
              <div>
                <span className="text-slate-300 block font-medium">Visiting Hours:</span>
                <span>11 AM-1 PM & 4-7 PM</span>
              </div>
            </div>

            {/* Admin Management Link */}
            <div className="pt-4 border-t border-slate-900">
              <button
                id="footer-admin-login-btn"
                onClick={onOpenAdmin}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hospital Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4 text-center text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Nexora Hospital System. All rights reserved. JCI & NABH Accredited.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Patient Rights</span>
            <span>Clinical Governance</span>
            <button onClick={onOpenAdmin} className="text-cyan-500 hover:underline">
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
