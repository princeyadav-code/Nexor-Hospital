import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Users,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Plus,
  Activity,
  HeartPulse,
  UserCheck,
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminOverview: React.FC = () => {
  const {
    doctors,
    departments,
    appointments,
    dashboardStats,
    setAdminTab,
    updateAppointmentStatus,
    setSelectedDoctorForModal,
  } = useHospital();

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingAppointments = appointments.filter((a) => a.status === 'Pending');
  const todayAppointments = appointments.filter((a) => a.preferredDate === todayStr);
  const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed');
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');

  const statsCards = [
    {
      id: 'stat-total-docs',
      label: 'Total Doctors',
      value: doctors.length,
      subtext: `${doctors.filter((d) => d.status === 'Active').length} Active on roster`,
      icon: Users,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/80 border-cyan-800/50',
      actionTab: 'doctors' as const,
    },
    {
      id: 'stat-total-depts',
      label: 'Clinical Departments',
      value: departments.length,
      subtext: `${departments.filter((d) => d.status === 'Active').length} Active units`,
      icon: Building2,
      color: 'text-teal-400',
      bgColor: 'bg-teal-950/80 border-teal-800/50',
      actionTab: 'departments' as const,
    },
    {
      id: 'stat-total-apts',
      label: 'Total Appointments',
      value: appointments.length,
      subtext: `${confirmedAppointments.length} confirmed bookings`,
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/80 border-blue-800/50',
      actionTab: 'appointments' as const,
    },
    {
      id: 'stat-pending-apts',
      label: 'Pending Approvals',
      value: pendingAppointments.length,
      subtext: 'Requires administrative action',
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/80 border-amber-800/50',
      actionTab: 'appointments' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Activity className="w-4 h-4" />
            <span>Executive Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Hospital Overview & Live Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor real-time appointment bookings, medical departments, and doctor schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setAdminTab('appointments')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Booking</span>
          </button>
          <button
            onClick={() => setAdminTab('doctors')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
          <button
            onClick={() => setAdminTab('departments')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Department</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => setAdminTab(card.actionTab)}
              className={`p-6 rounded-3xl border ${card.bgColor} cursor-pointer hover:scale-102 transition-all group`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{card.label}</span>
                <div className="p-2 rounded-xl bg-slate-900/80">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold font-serif text-white tracking-tight">
                {card.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                <span>{card.subtext}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Appointments & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Appointment Requests Table */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-serif text-white">
                Recent Appointment Requests
              </h3>
              <p className="text-xs text-slate-400">
                Latest patient consultation requests awaiting verification.
              </p>
            </div>
            <button
              onClick={() => setAdminTab('appointments')}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({appointments.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No appointments registered yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="pb-3 pr-4">Ticket</th>
                    <th className="pb-3 px-4">Patient</th>
                    <th className="pb-3 px-4">Specialist & Dept</th>
                    <th className="pb-3 px-4">Schedule</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {appointments.slice(0, 6).map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-cyan-300">
                        {apt.ticketNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{apt.patientName}</div>
                        <div className="text-[11px] text-slate-400">
                          {apt.age}y / {apt.gender} • {apt.phone}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{apt.doctorName}</div>
                        <div className="text-[11px] text-slate-400">{apt.departmentName}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-200">{apt.preferredDate}</div>
                        <div className="text-[11px] text-teal-400 font-mono">{apt.preferredTime}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            apt.status === 'Confirmed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : apt.status === 'Completed'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : apt.status === 'Cancelled'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        {apt.status === 'Pending' ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] font-bold border border-emerald-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                              className="px-2 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-[11px] font-medium border border-rose-800 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAdminTab('appointments')}
                            className="text-xs text-slate-400 hover:text-cyan-400"
                          >
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Quick Department Stats & Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Department Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold font-serif text-white">
              Clinical Specializations ({departments.length})
            </h3>
            <div className="space-y-3 text-xs">
              {departments.slice(0, 6).map((dept) => {
                const count = doctors.filter(
                  (d) =>
                    d.department.toLowerCase() === dept.name.toLowerCase() ||
                    d.department.toLowerCase().includes(dept.name.toLowerCase())
                ).length;
                return (
                  <div key={dept.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                      <span className="font-semibold text-slate-200 truncate">{dept.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                      {count} Doctor{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setAdminTab('departments')}
              className="w-full py-2 text-center text-xs font-semibold text-cyan-400 hover:underline pt-2 block"
            >
              Manage All Departments →
            </button>
          </div>

          {/* Quick Doctor Management Shortcut */}
          <div className="bg-gradient-to-br from-cyan-950/80 to-slate-900 border border-cyan-800/50 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <UserCheck className="w-4 h-4" />
              <span>Real-Time Doctor Control</span>
            </div>
            <h4 className="text-base font-bold font-serif text-white">
              Doctor Management Center
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Add new specialists, upload new portrait photos, modify consultation availability & fees with instant website reflection.
            </p>
            <button
              onClick={() => setAdminTab('doctors')}
              className="w-full py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs shadow-md transition-colors"
            >
              Open Doctor Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
