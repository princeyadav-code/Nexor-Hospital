import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Award, Users, HeartPulse, ShieldAlert, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

export const StatsSection: React.FC = () => {
  const { settings, doctors, departments } = useHospital();

  const statsItems = [
    {
      id: 'stat-doctors',
      label: 'Specialist Doctors',
      value: settings?.stats?.experiencedDoctors || `${doctors.length}+`,
      subtext: 'Internationally Trained',
      icon: Users,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      id: 'stat-depts',
      label: 'Clinical Departments',
      value: settings?.stats?.departments || `${departments.length}+`,
      subtext: 'Centers of Excellence',
      icon: Building2,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      id: 'stat-patients',
      label: 'Patients Cared For',
      value: settings?.stats?.patientsServed || '150,000+',
      subtext: 'Across 40+ Countries',
      icon: HeartPulse,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'stat-satisfaction',
      label: 'Patient Satisfaction',
      value: settings?.stats?.satisfactionRate || '99.2%',
      subtext: 'Verified Clinical Feedback',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      id: 'stat-emergency',
      label: 'Emergency Response',
      value: settings?.stats?.emergencyResponseTime || '< 8 Mins',
      subtext: 'Rapid Trauma Care',
      icon: ShieldAlert,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
  ];

  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 border border-slate-100">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {statsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`flex flex-col items-center text-center ${index > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
                  {item.value}
                </div>
                <div className="text-sm font-bold text-slate-800 mt-1">{item.label}</div>
                <div className="text-xs text-slate-500 font-medium">{item.subtext}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
