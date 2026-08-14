import React, { useState, useMemo } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Doctor } from '../../types';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Award,
  Stethoscope,
  Star,
  DollarSign,
  ChevronRight,
  Info,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const DoctorsSection: React.FC = () => {
  const {
    doctors,
    departments,
    setSelectedDoctorForModal,
    setSelectedDoctorForBooking,
    setIsBookingModalOpen,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      if (doc.status === 'Inactive') return false;

      // Department filter
      if (
        selectedDept !== 'all' &&
        doc.department.toLowerCase() !== selectedDept.toLowerCase() &&
        !doc.department.toLowerCase().includes(selectedDept.toLowerCase())
      ) {
        return false;
      }

      // Day filter
      if (selectedDay !== 'all') {
        const available = doc.availableDays || [];
        const hasDay = available.some(
          (d) => d.toLowerCase().includes(selectedDay.toLowerCase()) || d === selectedDay
        );
        if (!hasDay) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialization.toLowerCase().includes(q);
        const matchesDept = doc.department.toLowerCase().includes(q);
        const matchesQual = doc.qualification.toLowerCase().includes(q);
        return matchesName || matchesSpec || matchesDept || matchesQual;
      }

      return true;
    });
  }, [doctors, selectedDept, selectedDay, searchQuery]);

  const handleBookDoctor = (doc: Doctor) => {
    setSelectedDoctorForBooking(doc);
    setIsBookingModalOpen(true);
  };

  return (
    <section id="doctors" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-teal-900 text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-teal-700" />
            <span>Clinical Faculty Directory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
            Consult with Renowned Medical Specialists
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Our board-certified physicians, surgeons, and department chairs are dedicated to delivering empathetic, precision-driven healthcare.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, or condition..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Department Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full py-2.5 px-3 bg-white rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
              >
                <option value="all">All Departments ({departments.length})</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Day Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full py-2.5 px-3 bg-white rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
              >
                <option value="all">Any Consultation Day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    Available on {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Active Filters tags */}
          {(selectedDept !== 'all' || selectedDay !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs flex-wrap">
              <span className="text-slate-500 font-medium">Active Filters:</span>
              {selectedDept !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-100 text-cyan-900 font-medium">
                  Dept: {selectedDept}
                  <button onClick={() => setSelectedDept('all')} className="ml-1 hover:font-bold">×</button>
                </span>
              )}
              {selectedDay !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-900 font-medium">
                  Day: {selectedDay}
                  <button onClick={() => setSelectedDay('all')} className="ml-1 hover:font-bold">×</button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-medium">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="ml-1 hover:font-bold">×</button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedDept('all');
                  setSelectedDay('all');
                  setSearchQuery('');
                }}
                className="text-xs text-rose-600 hover:underline font-semibold ml-auto"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Doctor Cards Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-3">
            <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-500">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No doctors match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or clearing the department and day filters.
            </p>
            <button
              onClick={() => {
                setSelectedDept('all');
                setSelectedDay('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-cyan-700 text-white rounded-xl text-xs font-semibold hover:bg-cyan-800 transition-colors"
            >
              Show All Doctors
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Doctor Card Top: Photo & Badges */}
                  <div className="relative p-6 pb-4 bg-gradient-to-b from-slate-50 to-white flex items-start gap-4">
                    <div
                      className="relative cursor-pointer shrink-0"
                      onClick={() => setSelectedDoctorForModal(doctor)}
                    >
                      <img
                        src={doctor.photoUrl}
                        alt={doctor.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top shadow-md border-2 border-white group-hover:scale-103 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Available for booking" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                          {doctor.department}
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedDoctorForModal(doctor)}
                        className="text-lg font-bold text-slate-900 font-serif group-hover:text-cyan-800 transition-colors cursor-pointer leading-tight truncate"
                      >
                        {doctor.name}
                      </h3>

                      <p className="text-xs font-semibold text-cyan-700 mt-0.5 line-clamp-1">
                        {doctor.specialization}
                      </p>

                      <p className="text-[11px] text-slate-500 mt-0.5 truncate font-mono">
                        {doctor.qualification}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-500" />
                          {doctor.experience} Yrs Exp
                        </span>
                        {doctor.rating && (
                          <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {doctor.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Doctor Bio Snippet */}
                  <div className="px-6 py-2">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {doctor.biography}
                    </p>
                  </div>

                  {/* Availability & Fee Summary */}
                  <div className="px-6 py-3 border-y border-slate-100 bg-slate-50/60 my-2 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-cyan-600" /> Timings:
                      </span>
                      <span className="font-semibold text-slate-800 text-[11px]">
                        {doctor.availableTime || '09:00 AM - 02:00 PM'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" /> Days:
                      </span>
                      <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[170px]" title={doctor.availableDays?.join(', ')}>
                        {doctor.availableDays && doctor.availableDays.length > 3
                          ? `${doctor.availableDays.slice(0, 3).map((d) => d.slice(0, 3)).join(', ')}...`
                          : doctor.availableDays?.map((d) => d.slice(0, 3)).join(', ') || 'Mon-Fri'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 pt-1">
                      <span className="text-slate-500 font-medium">Consultation Fee:</span>
                      <span className="font-bold text-teal-700 text-sm">
                        ${doctor.consultationFee || 100}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-2 flex items-center gap-2.5">
                  <button
                    onClick={() => setSelectedDoctorForModal(doctor)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => handleBookDoctor(doctor)}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Consult</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
