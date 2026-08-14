import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Department } from '../../types';
import {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Flower2,
  Stethoscope,
  Scissors,
  Sparkles,
  Volume2,
  Smile,
  Scan,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Calendar,
  Building2,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';

// Icon resolver helper
export const renderDepartmentIcon = (iconName: string, className: string = 'w-6 h-6') => {
  switch (iconName?.toLowerCase()) {
    case 'heartpulse':
    case 'cardiology':
      return <HeartPulse className={className} />;
    case 'brain':
    case 'neurology':
      return <Brain className={className} />;
    case 'bone':
    case 'orthopedics':
      return <Bone className={className} />;
    case 'baby':
    case 'pediatrics':
      return <Baby className={className} />;
    case 'flower2':
    case 'gynecology':
      return <Flower2 className={className} />;
    case 'stethoscope':
    case 'general-medicine':
      return <Stethoscope className={className} />;
    case 'scissors':
    case 'general-surgery':
      return <Scissors className={className} />;
    case 'sparkles':
    case 'dermatology':
      return <Sparkles className={className} />;
    case 'volume2':
    case 'ent':
      return <Volume2 className={className} />;
    case 'smile':
    case 'dental':
      return <Smile className={className} />;
    case 'scan':
    case 'radiology':
      return <Scan className={className} />;
    case 'shieldalert':
    case 'emergency':
      return <ShieldAlert className={className} />;
    default:
      return <Building2 className={className} />;
  }
};

export const DepartmentsSection: React.FC = () => {
  const {
    departments,
    doctors,
    setSelectedDeptForBooking,
    setIsBookingModalOpen,
    setSelectedDepartmentForModal,
    setActivePublicView,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'all' | 'featured'>('all');

  const filteredDepts = departments.filter((d) => {
    if (d.status === 'Inactive') return false;
    if (activeTab === 'featured') return d.featured;
    return true;
  });

  const getDoctorCount = (deptName: string) => {
    return doctors.filter(
      (doc) =>
        doc.status === 'Active' &&
        (doc.department.toLowerCase() === deptName.toLowerCase() ||
          doc.department.toLowerCase().includes(deptName.toLowerCase()))
    ).length;
  };

  const handleBookDepartment = (dept: Department) => {
    setSelectedDeptForBooking(dept);
    setIsBookingModalOpen(true);
  };

  const handleViewDoctors = (deptName: string) => {
    setActivePublicView('doctors');
    const docEl = document.getElementById('doctors');
    if (docEl) docEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="departments" className="py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/80 text-cyan-800 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Medical Specializations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
              Centers of Clinical Excellence
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Equipped with international medical technologies and led by renowned specialists across 24 multidisciplinary departments.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Departments ({departments.filter((d) => d.status === 'Active').length})
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'featured'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Key Specialties
            </button>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDepts.map((dept, index) => {
            const docCount = getDoctorCount(dept.name);

            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Department Image & Badge Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dept.imageUrl}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Icon badge floating */}
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md text-cyan-700 flex items-center justify-center shadow-lg border border-white/40 group-hover:bg-cyan-700 group-hover:text-white transition-colors">
                    {renderDepartmentIcon(dept.iconName, 'w-6 h-6')}
                  </div>

                  {/* Doctor Count badge */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                      {docCount} Specialist{docCount !== 1 ? 's' : ''} On-Call
                    </span>
                    {dept.floorLocation && (
                      <span className="text-[11px] text-slate-300 font-medium truncate max-w-[140px]">
                        {dept.floorLocation}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-xl font-bold text-slate-900 font-serif group-hover:text-cyan-800 transition-colors">
                        {dept.name}
                      </h3>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {dept.code}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {dept.description}
                    </p>

                    {dept.headOfDepartment && (
                      <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
                        <span className="font-semibold text-slate-700">Director:</span>
                        <span className="truncate">{dept.headOfDepartment}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleBookDepartment(dept)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-700 hover:text-white text-cyan-800 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book in Dept</span>
                    </button>

                    <button
                      onClick={() => setSelectedDepartmentForModal(dept)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      title="View Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
