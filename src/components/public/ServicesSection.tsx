import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  ShieldAlert,
  Cpu,
  HeartPulse,
  Scan,
  Activity,
  Zap,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ServicesSection: React.FC = () => {
  const { services, setIsBookingModalOpen } = useHospital();

  const getServiceIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'shieldalert':
        return <ShieldAlert className="w-6 h-6 text-rose-600" />;
      case 'cpu':
        return <Cpu className="w-6 h-6 text-teal-600" />;
      case 'heartpulse':
        return <HeartPulse className="w-6 h-6 text-cyan-600" />;
      case 'scan':
        return <Scan className="w-6 h-6 text-indigo-600" />;
      case 'activity':
        return <Activity className="w-6 h-6 text-blue-600" />;
      default:
        return <Zap className="w-6 h-6 text-amber-600" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-950/40 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-700/50 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Specialized Clinical Programs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-white">
            Advanced Medical Services & Surgical Innovations
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Integrating robotic precision, ultra-fast diagnostic imaging, and dedicated intensive therapy units.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 6) * 0.07 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/70 hover:border-cyan-500/50 hover:bg-slate-800/90 transition-all duration-300 backdrop-blur-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-700/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getServiceIcon(service.icon)}
                  </div>
                  {service.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-900/80 text-cyan-200 border border-cyan-600/40">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-serif text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {service.description}
                </p>

                {service.details && service.details.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-slate-700/50">
                    {service.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 mt-4">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-700/60 hover:bg-cyan-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Inquire or Book Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
