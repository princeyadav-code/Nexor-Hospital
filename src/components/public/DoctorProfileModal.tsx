import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  X,
  Calendar,
  Clock,
  Award,
  Stethoscope,
  Star,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  DollarSign,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DoctorProfileModal: React.FC = () => {
  const {
    selectedDoctorForModal,
    setSelectedDoctorForModal,
    setSelectedDoctorForBooking,
    setIsBookingModalOpen,
  } = useHospital();

  if (!selectedDoctorForModal) return null;

  const doc = selectedDoctorForModal;

  const handleBookDoctor = () => {
    setSelectedDoctorForBooking(doc);
    setSelectedDoctorForModal(null);
    setIsBookingModalOpen(true);
  };

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white p-6 sm:p-8">
            <button
              onClick={() => setSelectedDoctorForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Doctor Avatar */}
              <div className="relative shrink-0">
                <img
                  src={doc.photoUrl}
                  alt={doc.name}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl object-cover object-top shadow-xl border-4 border-white/20"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-xs">
                  Active
                </span>
              </div>

              {/* Doctor Summary */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold uppercase tracking-wider">
                    {doc.department}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    {doc.experience} Years Experience
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
                  {doc.name}
                </h2>

                <p className="text-sm font-semibold text-cyan-300">{doc.specialization}</p>

                <p className="text-xs text-slate-300 font-mono">{doc.qualification}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-200">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <strong className="font-bold">{doc.rating || 4.9}</strong> ({doc.reviewsCount || 120}+ Patient Reviews)
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-teal-300">
                    Fee: ${doc.consultationFee} / Consult
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
            {/* Biography */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Professional Background & Expertise
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">{doc.biography}</p>
            </div>

            {/* OPD Schedule Matrix */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                OPD Schedule & Weekly Availability
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-700" /> Consultation Hours:
                  </span>
                  <span className="font-bold text-cyan-900 bg-cyan-100/60 px-2.5 py-1 rounded-lg">
                    {doc.availableTime || '09:00 AM - 02:00 PM'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 mb-2 block">
                    Available OPD Days:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {allDays.map((day) => {
                      const isAvailable = doc.availableDays?.includes(day);
                      return (
                        <div
                          key={day}
                          className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border ${
                            isAvailable
                              ? 'bg-white border-teal-300 text-teal-900 font-semibold shadow-xs'
                              : 'bg-slate-100/60 border-slate-200 text-slate-400'
                          }`}
                        >
                          <span>{day.slice(0, 3)}</span>
                          {isAvailable ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                          ) : (
                            <span className="text-[10px] text-slate-400">Off</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Clinic & Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block mb-1">Consultation Room:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                  <Building className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                  {doc.roomNumber || 'OPD Suite 204'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block mb-1">Direct Line / Extension:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  {doc.phone || '+1 (800) 555-6396'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block mb-1">Clinical Email:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                  {doc.email || 'specialist@nexorahospital.com'}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer with Book CTA */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => setSelectedDoctorForModal(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
            >
              Back to Directory
            </button>

            <button
              onClick={handleBookDoctor}
              className="px-6 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment with {doc.name}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
