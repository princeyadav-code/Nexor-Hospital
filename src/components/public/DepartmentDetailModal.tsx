import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { renderDepartmentIcon } from './DepartmentsSection';
import { X, Calendar, MapPin, UserCheck, ShieldCheck, Stethoscope, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DepartmentDetailModal: React.FC = () => {
  const {
    selectedDepartmentForModal,
    setSelectedDepartmentForModal,
    doctors,
    setSelectedDoctorForModal,
    setSelectedDeptForBooking,
    setIsBookingModalOpen,
  } = useHospital();

  if (!selectedDepartmentForModal) return null;

  const dept = selectedDepartmentForModal;
  const deptDoctors = doctors.filter(
    (d) =>
      d.status === 'Active' &&
      (d.department.toLowerCase() === dept.name.toLowerCase() ||
        d.department.toLowerCase().includes(dept.name.toLowerCase()))
  );

  const handleBookDept = () => {
    setSelectedDeptForBooking(dept);
    setSelectedDepartmentForModal(null);
    setIsBookingModalOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8"
        >
          {/* Header Banner Image */}
          <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
            <img
              src={dept.imageUrl}
              alt={dept.name}
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <button
              onClick={() => setSelectedDepartmentForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white text-cyan-800 flex items-center justify-center shadow-lg">
                  {renderDepartmentIcon(dept.iconName, 'w-7 h-7')}
                </div>
                <div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-cyan-900/80 text-cyan-200 border border-cyan-700/50">
                    CODE: {dept.code}
                  </span>
                  <h2 className="text-2xl font-bold text-white font-serif tracking-tight mt-1">
                    {dept.name}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Overview & Clinical Scope
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">{dept.description}</p>
            </div>

            {/* Department Details Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
                <div>
                  <span className="text-slate-500 block">Facility Location:</span>
                  <span className="font-semibold text-slate-800">
                    {dept.floorLocation || 'Main Clinical Wing'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="text-slate-500 block">Department Head:</span>
                  <span className="font-semibold text-slate-800">
                    {dept.headOfDepartment || 'Lead Medical Consultant'}
                  </span>
                </div>
              </div>
            </div>

            {/* Specialists list in this department */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Specialists In This Department ({deptDoctors.length})
                </h4>
              </div>

              {deptDoctors.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  No specialists currently assigned to this department.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deptDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setSelectedDepartmentForModal(null);
                        setSelectedDoctorForModal(doc);
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-cyan-500/50 hover:bg-cyan-50/30 transition-all flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={doc.photoUrl}
                        alt={doc.name}
                        className="w-12 h-12 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-cyan-800">
                          {doc.name}
                        </h5>
                        <p className="text-[11px] text-slate-500 truncate">{doc.specialization}</p>
                        <span className="text-[10px] font-semibold text-teal-700">
                          {doc.experience} yrs exp • ${doc.consultationFee}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-700" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => setSelectedDepartmentForModal(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleBookDept}
              className="px-6 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment in {dept.name}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
