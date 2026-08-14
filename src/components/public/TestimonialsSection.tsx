import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Star, Quote, HeartPulse, User, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useHospital();

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <HeartPulse className="w-4 h-4 text-amber-700" />
            <span>Patient Recovery Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 tracking-tight">
            Trusted by Thousands of Families
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Real stories from individuals whose lives were transformed by the compassionate care of Nexora Hospital doctors and nurses.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(test.rating || 5)].map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-teal-800">
                    {test.treatment}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{test.comment}"
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-200/60 flex items-center gap-3.5">
                {test.avatarUrl ? (
                  <img
                    src={test.avatarUrl}
                    alt={test.patientName}
                    className="w-11 h-11 rounded-full object-cover shadow-xs border border-white"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-cyan-700 text-white font-bold flex items-center justify-center text-xs">
                    {test.patientName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{test.patientName}</h4>
                  <p className="text-[11px] text-slate-500">
                    {test.doctorName ? `Treated by ${test.doctorName}` : 'Nexora Patient'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
