import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  AlertTriangle,
  Ambulance,
  Building,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ContactEmergencySection: React.FC = () => {
  const { settings, addToast } = useHospital();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      addToast('Thank you! Your message has been sent to our Patient Care team.', 'success');
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSentSuccess(false), 5000);
    }, 800);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Emergency SOS High-Impact Strip */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 rounded-3xl p-6 sm:p-10 border border-rose-500/30 text-white shadow-xl mb-16 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-rose-600/10 to-transparent pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold uppercase tracking-wider animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>24/7 Rapid Emergency & Ambulance Dispatch</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                Medical Emergency? Our Rapid Trauma Team is On Call 24/7
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light">
                Direct hotline with immediate paramedic routing, Level 1 trauma resuscitation, cardiac catheterization, and acute stroke response.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href={`tel:${settings?.emergencyNumber || '+18009114357'}`}
                className="px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-900/50 flex items-center justify-center gap-3 transition-all hover:scale-102 active:scale-98"
              >
                <Phone className="w-5 h-5 animate-bounce" />
                <div className="text-left">
                  <span className="text-[10px] block opacity-80 uppercase tracking-wider">Emergency Hotline</span>
                  <span className="text-base font-mono font-extrabold">{settings?.emergencyNumber || '+1 (800) 911-4357'}</span>
                </div>
              </a>

              <a
                href={`tel:${settings?.ambulanceNumber || '+18009112628'}`}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2.5 transition-colors"
              >
                <Ambulance className="w-4 h-4 text-teal-400" />
                <span>Request Ambulance Dispatch: {settings?.ambulanceNumber || '+1 (800) 911-AMBU'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info & Inquiries Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
                Hospital Information
              </span>
              <h3 className="text-2xl font-bold font-serif text-slate-900 tracking-tight mt-1">
                Reach Our Patient Concierge
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Have questions about insurance coverage, department locations, or medical records? We're here to assist.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h5 className="font-bold text-slate-900 mb-0.5">Hospital Location</h5>
                  <p className="text-slate-600 leading-relaxed">
                    {settings?.address || '450 Health Sciences Parkway, Metro Medical District, NY 10016'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h5 className="font-bold text-slate-900 mb-0.5">Direct Helpline</h5>
                  <p className="text-slate-600 font-mono font-medium">{settings?.phone || '+1 (800) 555-6396'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Mon - Sat: 08:00 AM - 08:00 PM</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h5 className="font-bold text-slate-900 mb-0.5">Email Inquiries</h5>
                  <p className="text-slate-600 font-medium">{settings?.email || 'care@nexorahospital.com'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1">
                  <h5 className="font-bold text-slate-900">Hospital Operating Hours</h5>
                  <p className="text-slate-600">
                    <strong className="text-slate-800">OPD:</strong> {settings?.workingHours?.opd || '08:00 AM - 08:00 PM'}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-800">Emergency & ICU:</strong> 24 Hours / 7 Days
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-800">Visiting Hours:</strong> {settings?.workingHours?.visitingHours || '11:00 AM - 01:00 PM & 04:00 PM - 07:00 PM'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="text-lg font-bold font-serif text-slate-900 mb-1">
              Send an Inquiry to Patient Services
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Our clinical coordinator will respond to your query within 24 hours.
            </p>

            {sentSuccess && (
              <div className="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Message received! Our team will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Subject / Department
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                  >
                    <option value="General Inquiry">General Hospital Inquiry</option>
                    <option value="Billing & Insurance">Billing & Insurance Desk</option>
                    <option value="Second Medical Opinion">Second Medical Opinion</option>
                    <option value="International Patients">International Patient Concierge</option>
                    <option value="Health Checkup Packages">Preventive Health Checkup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Message / Query *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our clinical team help you today?..."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSending ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
