import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { HospitalSettings } from '../../types';
import { ImageUploader } from '../common/ImageUploader';
import {
  Settings,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminHospitalSettings: React.FC = () => {
  const { settings, updateHospitalSettings, resetDatabaseDefaults, addToast } = useHospital();

  const [formData, setFormData] = useState<HospitalSettings>(
    settings || {
      hospitalName: 'Nexora Hospital',
      tagline: 'Advancing Medicine. Empowering Life.',
      phone: '+1 (800) 555-6396',
      emergencyNumber: '+1 (800) 911-4357',
      ambulanceNumber: '+1 (800) 911-2628',
      email: 'care@nexorahospital.com',
      address: '450 Health Sciences Parkway, Metro Medical District, NY 10016',
      logoUrl: '',
      heroTitle: 'World-Class Healthcare, Centered on You',
      heroSubtitle: 'Delivering pioneering clinical care, advanced robotic surgery, and compassionate healing across 24 multidisciplinary specialties.',
      heroImageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1600&auto=format&fit=crop&q=80',
      aboutTitle: 'Leading the Future of Precision Healthcare',
      aboutDescription: 'Founded on medical innovation and patient empathy, Nexora Hospital is a JCI & NABH accredited medical complex.',
      aboutImageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1000&auto=format&fit=crop&q=80',
      workingHours: {
        opd: '08:00 AM - 08:00 PM',
        emergency: '24 Hours / 7 Days',
        visitingHours: '11:00 AM - 01:00 PM & 04:00 PM - 07:00 PM',
      },
      stats: {
        doctorsCount: 150,
        departmentsCount: 24,
        patientsServed: 85000,
        satisfactionRate: 99.4,
        emergencyResponseTime: '< 8 Min',
      },
      socialLinks: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
      },
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await updateHospitalSettings(formData);
    setIsSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);

    if (!newPassword || newPassword.length < 5) {
      setPwMsg({ type: 'error', text: 'Password must be at least 5 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      const token = localStorage.getItem('nexora_admin_token');
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (res.ok) {
        setPwMsg({ type: 'success', text: 'Admin password updated successfully!' });
        setNewPassword('');
        setConfirmPassword('');
        addToast('Admin password updated successfully', 'success');
      } else {
        const d = await res.json();
        setPwMsg({ type: 'error', text: d.error || 'Failed to update password' });
      }
    } catch (err) {
      setPwMsg({ type: 'error', text: 'Network error updating password' });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <Settings className="w-4 h-4" />
          <span>Global Hospital Configuration</span>
        </div>
        <h2 className="text-2xl font-bold font-serif text-white mt-1">
          Hospital Information & System Settings
        </h2>
        <p className="text-xs text-slate-400">
          Update public hospital name, contact numbers, address, emergency hotline, and administrative credentials.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Section 1: General Branding */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-cyan-400" />
            <span>Hospital Identity & Public Tagline</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Hospital System Name *
              </label>
              <input
                type="text"
                required
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Brand Motto / Tagline *
              </label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Hotlines */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-400" />
            <span>Emergency Hotlines & Contact Numbers</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Emergency 24/7 Hotline *
              </label>
              <input
                type="text"
                required
                value={formData.emergencyNumber}
                onChange={(e) => setFormData({ ...formData, emergencyNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-rose-300 text-xs sm:text-sm rounded-xl border border-rose-900/60 focus:outline-none focus:border-rose-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Ambulance Dispatch Line *
              </label>
              <input
                type="text"
                required
                value={formData.ambulanceNumber}
                onChange={(e) => setFormData({ ...formData, ambulanceNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Main General Hospital Line *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Official Inquiries Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Hospital Physical Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Operating Hours */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Hospital Timings & Visiting Regulations</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                OPD Clinic Hours
              </label>
              <input
                type="text"
                value={formData.workingHours?.opd}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workingHours: { ...formData.workingHours, opd: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Emergency Trauma Hours
              </label>
              <input
                type="text"
                value={formData.workingHours?.emergency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workingHours: { ...formData.workingHours, emergency: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Patient Visiting Hours
              </label>
              <input
                type="text"
                value={formData.workingHours?.visitingHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workingHours: { ...formData.workingHours, visitingHours: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <span>Updating Hospital Info...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Hospital Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Admin Security Section (Password Change) */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Update Admin Password</span>
          </h3>
          <span className="text-[10px] text-slate-400">Security Credentials</span>
        </div>

        {pwMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              pwMsg.type === 'success'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}
          >
            {pwMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{pwMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              New Admin Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};
