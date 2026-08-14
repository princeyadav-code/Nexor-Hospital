import React from 'react';
import {
  Building,
  Activity,
  Cpu,
  ShieldCheck,
  Zap,
  Bed,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const FacilitiesSection: React.FC = () => {
  const facilities = [
    {
      id: 'fac-1',
      title: 'Robotic Surgery Complex',
      description: 'Ultra-sterile laminar air flow suites with Da Vinci Xi robotic surgery systems.',
      imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80',
      badge: 'Advanced OT',
    },
    {
      id: 'fac-2',
      title: '3T MRI & 128-Slice CT Lab',
      description: 'Sub-millimeter imaging precision with low radiation protocols and quiet scan tunnels.',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
      badge: 'Diagnostics',
    },
    {
      id: 'fac-3',
      title: 'Level 1 Trauma & Resuscitation',
      description: 'Immediate response ambulance fleet, dedicated CT in trauma bay, and blood bank.',
      imageUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&auto=format&fit=crop&q=80',
      badge: '24/7 Trauma',
    },
    {
      id: 'fac-4',
      title: 'Level III Neonatal & Pediatric ICU',
      description: 'Specialized intensive life support pods for premature infants and critical pediatrics.',
      imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80',
      badge: 'NICU / PICU',
    },
    {
      id: 'fac-5',
      title: 'Executive Inpatient Suites',
      description: 'Private healing environment with patient monitoring, lounge spaces, and dietary chef care.',
      imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
      badge: 'Comfort Care',
    },
    {
      id: 'fac-6',
      title: 'Automated 24/7 Pharmacy & Labs',
      description: 'Robotic medication dispensing and NABL accredited pathology testing within 45 minutes.',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
      badge: 'Rapid Lab',
    },
  ];

  return (
    <section id="facilities" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-900 text-xs font-bold uppercase tracking-wider">
            <Building className="w-4 h-4 text-teal-700" />
            <span>Infrastructure & Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight">
            Designed for Superior Clinical Outcomes
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every square foot of Nexora Hospital is built around infection control, patient dignity, and swift medical workflows.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {facilities.map((fac, idx) => (
            <motion.div
              key={fac.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={fac.imageUrl}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold shadow-xs">
                  {fac.badge}
                </span>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-slate-900 font-serif group-hover:text-cyan-800 transition-colors">
                  {fac.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
