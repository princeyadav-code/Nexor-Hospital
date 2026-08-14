import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Calendar,
  Users,
  ShieldCheck,
  Award,
  PhoneCall,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { motion } from 'motion/react';

export const HeroSection: React.FC = () => {
  const { settings, setIsBookingModalOpen, setActivePublicView } = useHospital();

  const handleMeetDoctors = () => {
    setActivePublicView('doctors');
    const docEl = document.getElementById('doctors');
    if (docEl) docEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContact = () => {
    setActivePublicView('contact');
    const contactEl = document.getElementById('contact');
    if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative overflow-hidden bg-slate-900 text-white pt-8 pb-16 lg:py-24">
      {/* Background Graphic & Texture */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src={
            settings?.heroBannerUrl ||
            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=80'
          }
          alt="Hospital Infrastructure"
          className="w-full h-full object-cover object-center filter saturate-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Accreditation Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>JCI Accredited & Gold Seal Clinical Standard</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-[1.15]"
            >
              {settings?.heroHeading || 'World-Class Healthcare with Human Compassion'}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal"
            >
              {settings?.heroDescription ||
                'Experience international standard medical excellence, cutting-edge surgical robotics, and compassionate multidisciplinary care available 24/7.'}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <button
                id="hero-book-appointment-btn"
                onClick={() => setIsBookingModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-900/40 hover:shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{settings?.heroCtaPrimary || 'Book Appointment'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-meet-doctors-btn"
                onClick={handleMeetDoctors}
                className="px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <span>{settings?.heroCtaSecondary || 'Meet Our Doctors'}</span>
              </button>

              <button
                id="hero-contact-hospital-btn"
                onClick={handleContact}
                className="px-4 py-3.5 rounded-xl text-slate-300 hover:text-white font-medium text-sm transition-colors flex items-center gap-1.5"
              >
                <span>Contact Hospital</span>
              </button>
            </motion.div>

            {/* Quick Feature Checklist */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>24/7 Rapid Trauma Unit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Zero Wait-List Diagnostics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>International Patient Desk</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hospital Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl p-6 sm:p-8 bg-slate-800/70 border border-slate-700/80 backdrop-blur-xl shadow-2xl space-y-6"
            >
              {/* Emergency Banner inside card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 to-slate-900 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-rose-400 uppercase">Emergency Dispatch</span>
                  <p className="text-lg font-bold text-white tracking-wide font-mono">
                    {settings?.emergencyNumber || '+1 (800) 911-4357'}
                  </p>
                </div>
                <a
                  href={`tel:${settings?.emergencyNumber || '+18009114357'}`}
                  className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <PhoneCall className="w-5 h-5" />
                </a>
              </div>

              {/* Quick OPD Hours block */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center justify-between py-2 border-b border-slate-700/60">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> General OPD Hours:
                  </span>
                  <span className="font-semibold text-slate-200">08:00 AM - 08:00 PM</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-700/60">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-teal-400" /> Intensive Care & Trauma:
                  </span>
                  <span className="font-bold text-emerald-400">24/7 Continuous</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" /> Inpatient Visiting Hours:
                  </span>
                  <span className="font-semibold text-slate-200">11 AM-1 PM & 4-7 PM</span>
                </div>
              </div>

              {/* Direct Booking Action in card */}
              <div className="pt-2">
                <button
                  id="hero-card-quick-book"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request OPD Appointment</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                  Instant digital confirmation with appointment ticket number.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
