import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  ShieldCheck,
  Award,
  Heart,
  Users,
  Target,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  const { settings } = useHospital();

  const values = [
    {
      title: 'Clinical Excellence',
      description: 'Zero compromise on safety protocols, peer-reviewed practices, and surgical robotics.',
      icon: Award,
    },
    {
      title: 'Patient-First Compassion',
      description: 'Listening with empathy and transparently involving families in care plans.',
      icon: Heart,
    },
    {
      title: 'Multidisciplinary Collaboration',
      description: 'Integrated tumor boards and cardiac review committees for holistic treatment.',
      icon: Users,
    },
    {
      title: 'Research & Innovation',
      description: 'Continuous medical breakthroughs, clinical trials, and robotic surgery techniques.',
      icon: Target,
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={
                  settings?.aboutImageUrl ||
                  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1000&auto=format&fit=crop&q=80'
                }
                alt="Nexora Medical Complex"
                className="w-full h-96 sm:h-[460px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">JCI & NABH Gold Standard</h4>
                    <p className="text-[11px] text-slate-500">Highest Tier Quality Accreditation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold uppercase tracking-wider">
              <Stethoscope className="w-4 h-4 text-cyan-700" />
              <span>About Nexora Hospital</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight leading-tight">
              {settings?.aboutTitle || 'Leading the Future of Precision Healthcare'}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {settings?.aboutDescription ||
                'Founded on the bedrock of medical innovation and patient-centered empathy, Nexora Hospital has grown into a state-of-the-art tertiary care center. With over 24 specialized medical departments, internationally trained clinicians, robotic surgery suites, and round-the-clock emergency trauma response, we stand dedicated to preserving health and restoring hope.'}
            </p>

            {/* Core Values 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-1">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{v.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-normal">{v.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
