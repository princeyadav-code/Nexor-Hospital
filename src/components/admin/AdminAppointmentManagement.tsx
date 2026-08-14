import React, { useState, useMemo } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Trash2,
  Eye,
  Filter,
  Printer,
  Download,
  AlertCircle,
  X,
  Stethoscope,
  Building,
  Plus,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  DollarSign,
  MapPin,
  CalendarDays,
  UserCheck,
  ShieldCheck,
  Copy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminAppointmentManagement: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    adminCreateAppointment,
    adminUpdateAppointment,
    deleteAppointment,
    doctors,
    departments,
    settings,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('all');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'custom'>('all');
  const [customDate, setCustomDate] = useState('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingNotesApt, setEditingNotesApt] = useState<Appointment | null>(null);
  const [adminNotesText, setAdminNotesText] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);

  // New Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const initialNewBooking = {
    patientName: '',
    age: '32',
    gender: 'Male',
    phone: '',
    email: '',
    departmentId: departments[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    preferredDate: todayStr,
    preferredTime: '10:00 AM - 10:30 AM',
    reason: 'Routine outpatient consultation and clinical evaluation.',
    status: 'Confirmed' as AppointmentStatus,
    adminNotes: 'Registered directly via Admin OPD Command Desk.',
  };

  const [newBookingData, setNewBookingData] = useState(initialNewBooking);
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Edit Booking Form State
  const [editFormData, setEditFormData] = useState<Partial<Appointment>>({});

  // Filtered Doctors for New Booking
  const availableDoctorsForNew = useMemo(() => {
    if (!newBookingData.departmentId) return doctors;
    const selectedDept = departments.find((d) => d.id === newBookingData.departmentId);
    if (!selectedDept) return doctors;
    return doctors.filter(
      (doc) =>
        doc.department.toLowerCase() === selectedDept.name.toLowerCase() ||
        doc.department.toLowerCase().includes(selectedDept.name.toLowerCase())
    );
  }, [doctors, departments, newBookingData.departmentId]);

  // Sync doctor when department changes in new booking
  const handleNewDeptChange = (deptId: string) => {
    const selectedDept = departments.find((d) => d.id === deptId);
    const matchingDocs = doctors.filter(
      (doc) =>
        selectedDept &&
        (doc.department.toLowerCase() === selectedDept.name.toLowerCase() ||
          doc.department.toLowerCase().includes(selectedDept.name.toLowerCase()))
    );
    setNewBookingData((prev) => ({
      ...prev,
      departmentId: deptId,
      doctorId: matchingDocs[0]?.id || doctors[0]?.id || '',
    }));
  };

  // Stats calculation
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;
  const todayCount = appointments.filter((a) => a.preferredDate === todayStr).length;

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Status
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
      // Doctor
      if (selectedDoctorFilter !== 'all' && apt.doctorId !== selectedDoctorFilter) return false;
      // Department
      if (selectedDeptFilter !== 'all' && apt.departmentId !== selectedDeptFilter) return false;
      // Date filter
      if (dateFilter === 'today' && apt.preferredDate !== todayStr) return false;
      if (dateFilter === 'upcoming' && apt.preferredDate < todayStr) return false;
      if (dateFilter === 'custom' && customDate && apt.preferredDate !== customDate) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (apt.patientName || '').toLowerCase().includes(q);
        const matchesTicket = (apt.ticketNumber || '').toLowerCase().includes(q);
        const matchesPhone = (apt.phone || '').includes(q);
        const matchesDoc = (apt.doctorName || '').toLowerCase().includes(q);
        const matchesDept = (apt.departmentName || '').toLowerCase().includes(q);
        const matchesReason = (apt.reason || '').toLowerCase().includes(q);
        return matchesName || matchesTicket || matchesPhone || matchesDoc || matchesDept || matchesReason;
      }
      return true;
    });
  }, [
    appointments,
    statusFilter,
    selectedDoctorFilter,
    selectedDeptFilter,
    dateFilter,
    customDate,
    searchQuery,
    todayStr,
  ]);

  // Handle Create New Booking Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingData.patientName.trim() || !newBookingData.phone.trim()) {
      return;
    }
    setIsSubmittingNew(true);
    const res = await adminCreateAppointment(newBookingData);
    setIsSubmittingNew(false);
    if (res.success) {
      setIsCreateModalOpen(false);
      setNewBookingData({
        ...initialNewBooking,
        departmentId: departments[0]?.id || '',
        doctorId: doctors[0]?.id || '',
      });
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (apt: Appointment) => {
    setEditingAppointment(apt);
    setEditFormData({
      patientName: apt.patientName,
      age: apt.age,
      gender: apt.gender,
      phone: apt.phone,
      email: apt.email || '',
      departmentId: apt.departmentId,
      departmentName: apt.departmentName,
      doctorId: apt.doctorId,
      doctorName: apt.doctorName,
      preferredDate: apt.preferredDate,
      preferredTime: apt.preferredTime,
      reason: apt.reason,
      status: apt.status,
      adminNotes: apt.adminNotes || '',
    });
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    // Resolve doctor and department names if changed
    const docObj = doctors.find((d) => d.id === editFormData.doctorId);
    const deptObj = departments.find((d) => d.id === editFormData.departmentId);

    const payload = {
      ...editFormData,
      doctorName: docObj ? docObj.name : editFormData.doctorName,
      departmentName: deptObj ? deptObj.name : editFormData.departmentName,
    };

    const success = await adminUpdateAppointment(editingAppointment.id, payload);
    if (success) {
      setEditingAppointment(null);
    }
  };

  const handleOpenNotes = (apt: Appointment) => {
    setEditingNotesApt(apt);
    setAdminNotesText(apt.adminNotes || '');
  };

  const handleSaveNotes = async () => {
    if (!editingNotesApt) return;
    await updateAppointmentStatus(editingNotesApt.id, editingNotesApt.status, adminNotesText);
    setEditingNotesApt(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Ticket Number',
      'Patient Name',
      'Age',
      'Gender',
      'Phone',
      'Email',
      'Consultant Doctor',
      'Department',
      'Appointment Date',
      'Time Slot',
      'Status',
      'Reason / Symptoms',
      'Admin Notes',
    ];
    const rows = filteredAppointments.map((a) => [
      a.ticketNumber,
      `"${a.patientName}"`,
      a.age,
      a.gender,
      `"${a.phone}"`,
      `"${a.email || ''}"`,
      `"${a.doctorName}"`,
      `"${a.departmentName}"`,
      a.preferredDate,
      `"${a.preferredTime}"`,
      a.status,
      `"${(a.reason || '').replace(/"/g, '""')}"`,
      `"${(a.adminNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexora_appointments_ledger_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const timeSlots = [
    '09:00 AM - 09:30 AM',
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM',
    '11:30 AM - 12:00 PM',
    '02:00 PM - 02:30 PM',
    '02:30 PM - 03:00 PM',
    '03:00 PM - 03:30 PM',
    '03:30 PM - 04:00 PM',
    '04:00 PM - 04:30 PM',
    '05:00 PM - 05:30 PM',
  ];

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-md shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Hospital Administration & OPD Command</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Appointment Bookings Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage all clinical consultations, approve pending requests, register walk-in patients, and adjust schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="admin-add-booking-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/60 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Booking (Walk-In)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <button
          onClick={() => { setStatusFilter('all'); setDateFilter('all'); }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'all' && dateFilter === 'all'
              ? 'bg-cyan-950/80 border-cyan-700 shadow-md ring-1 ring-cyan-500/40'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] text-slate-400 font-medium block">Total Bookings</span>
          <div className="text-2xl font-bold font-serif text-white mt-1">{appointments.length}</div>
          <span className="text-[10px] text-cyan-400 font-mono mt-0.5 block">All records</span>
        </button>

        <button
          onClick={() => { setStatusFilter('Pending'); setDateFilter('all'); }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'Pending'
              ? 'bg-amber-950/80 border-amber-600 shadow-md ring-1 ring-amber-500/40'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] text-slate-400 font-medium block">Pending Approval</span>
          <div className="text-2xl font-bold font-serif text-amber-400 mt-1">{pendingCount}</div>
          <span className="text-[10px] text-amber-400/80 font-mono mt-0.5 block">Action required</span>
        </button>

        <button
          onClick={() => { setStatusFilter('Confirmed'); setDateFilter('all'); }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'Confirmed'
              ? 'bg-emerald-950/80 border-emerald-600 shadow-md ring-1 ring-emerald-500/40'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] text-slate-400 font-medium block">Confirmed OPD</span>
          <div className="text-2xl font-bold font-serif text-emerald-400 mt-1">{confirmedCount}</div>
          <span className="text-[10px] text-emerald-400/80 font-mono mt-0.5 block">Scheduled slots</span>
        </button>

        <button
          onClick={() => { setDateFilter('today'); setStatusFilter('all'); }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            dateFilter === 'today'
              ? 'bg-teal-950/80 border-teal-600 shadow-md ring-1 ring-teal-500/40'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] text-slate-400 font-medium block">Today's Schedule</span>
          <div className="text-2xl font-bold font-serif text-teal-300 mt-1">{todayCount}</div>
          <span className="text-[10px] text-teal-400/80 font-mono mt-0.5 block">{todayStr}</span>
        </button>

        <button
          onClick={() => { setStatusFilter('Completed'); setDateFilter('all'); }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'Completed'
              ? 'bg-blue-950/80 border-blue-600 shadow-md ring-1 ring-blue-500/40'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] text-slate-400 font-medium block">Completed</span>
          <div className="text-2xl font-bold font-serif text-blue-400 mt-1">{completedCount}</div>
          <span className="text-[10px] text-blue-400/80 font-mono mt-0.5 block">Attended & cleared</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket # (NX-XXXXX), patient name, phone, doctor, or symptom..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-slate-200 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2.5 px-3 bg-slate-950 text-slate-300 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">All Statuses ({appointments.length})</option>
              <option value="Pending">Pending Review ({pendingCount})</option>
              <option value="Confirmed">Confirmed ({confirmedCount})</option>
              <option value="Completed">Completed ({completedCount})</option>
              <option value="Cancelled">Cancelled ({cancelledCount})</option>
            </select>

            {/* Department Select */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="py-2.5 px-3 bg-slate-950 text-slate-300 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[180px] truncate"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Doctor Select */}
            <select
              value={selectedDoctorFilter}
              onChange={(e) => setSelectedDoctorFilter(e.target.value)}
              className="py-2.5 px-3 bg-slate-950 text-slate-300 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[180px] truncate"
            >
              <option value="all">All Doctors</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>

            {/* Date Preset */}
            <select
              value={dateFilter}
              onChange={(e: any) => setDateFilter(e.target.value)}
              className="py-2.5 px-3 bg-slate-950 text-slate-300 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="today">Today's Appointments</option>
              <option value="upcoming">Upcoming Dates</option>
              <option value="custom">Custom Date...</option>
            </select>

            {dateFilter === 'custom' && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="py-2 px-3 bg-slate-950 text-slate-300 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
          <span>Showing: <strong className="text-white">{filteredAppointments.length}</strong> records</span>
          {(statusFilter !== 'all' || selectedDeptFilter !== 'all' || selectedDoctorFilter !== 'all' || dateFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setSelectedDeptFilter('all');
                setSelectedDoctorFilter('all');
                setDateFilter('all');
                setSearchQuery('');
                setCustomDate('');
              }}
              className="text-cyan-400 hover:underline flex items-center gap-1 ml-2 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-4 px-4">Ticket</th>
                <th className="py-4 px-4">Patient Information</th>
                <th className="py-4 px-4">Consultant & Department</th>
                <th className="py-4 px-4">Schedule Slot</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions & Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Calendar className="w-8 h-8 text-slate-600" />
                      <span className="text-sm font-semibold text-slate-400">No appointments found</span>
                      <p className="text-xs text-slate-500 max-w-sm">
                        No appointment records match your active query. Click "+ Add New Booking" to register a walk-in patient.
                      </p>
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-2 px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold"
                      >
                        + Create Booking
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Ticket */}
                    <td className="py-4 px-4 align-middle">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/60 text-xs">
                          {apt.ticketNumber}
                        </span>
                      </div>
                      {apt.userId && (
                        <div className="text-[10px] text-teal-400 font-medium mt-1">Online Patient App</div>
                      )}
                    </td>

                    {/* Patient */}
                    <td className="py-4 px-4 align-middle">
                      <div className="font-bold text-white text-sm">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{apt.age} yrs</span>
                        <span>•</span>
                        <span>{apt.gender}</span>
                        <span>•</span>
                        <span className="text-slate-300 font-mono font-medium">{apt.phone}</span>
                      </div>
                      {apt.email && (
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                          {apt.email}
                        </div>
                      )}
                    </td>

                    {/* Doctor & Dept */}
                    <td className="py-4 px-4 align-middle">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{apt.doctorName}</span>
                      </div>
                      <div className="text-[11px] text-teal-400 font-medium mt-0.5">
                        {apt.departmentName}
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      <div className="font-medium text-slate-200 flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.preferredDate}</span>
                        {apt.preferredDate === todayStr && (
                          <span className="px-1.5 py-0.2 rounded-md bg-teal-950 text-teal-300 border border-teal-700 text-[10px] font-bold">
                            TODAY
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-cyan-300 font-mono mt-0.5">
                        {apt.preferredTime}
                      </div>
                    </td>

                    {/* Status Dropdown / Badge */}
                    <td className="py-4 px-4 align-middle">
                      <select
                        value={apt.status}
                        onChange={(e: any) => updateAppointmentStatus(apt.id, e.target.value)}
                        className={`py-1.5 px-3 rounded-xl text-[11px] font-bold border focus:outline-none cursor-pointer transition-colors ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : apt.status === 'Completed'
                            ? 'bg-blue-950 text-blue-300 border-blue-800'
                            : apt.status === 'Cancelled'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}
                      >
                        <option value="Pending">⏳ Pending Review</option>
                        <option value="Confirmed">✓ Confirmed</option>
                        <option value="Completed">★ Completed</option>
                        <option value="Cancelled">✕ Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right align-middle">
                      <div className="inline-flex items-center gap-1">
                        {apt.status === 'Pending' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] font-bold border border-emerald-700 transition-colors mr-1 cursor-pointer"
                            title="Quick Approve"
                          >
                            Approve
                          </button>
                        )}

                        <button
                          onClick={() => setViewingAppointment(apt)}
                          className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="View Consultation Dossier / Print Slip"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(apt)}
                          className="p-2 rounded-xl text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Booking Information"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenNotes(apt)}
                          className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Clinical / Administrative Notes"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(apt)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CREATE NEW BOOKING (ADMIN END) MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-200 my-8"
            >
              {/* Header */}
              <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white">
                      Create New Appointment Booking
                    </h3>
                    <p className="text-xs text-slate-400">
                      Register walk-in patient or schedule direct consultation from admin portal.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-5 text-xs">
                {/* Patient Information Section */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>1. Patient Demographics</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-slate-300 font-semibold block mb-1">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newBookingData.patientName}
                        onChange={(e) =>
                          setNewBookingData({ ...newBookingData, patientName: e.target.value })
                        }
                        placeholder="e.g. John Doe"
                        className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-xs sm:text-sm font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Age *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="120"
                          value={newBookingData.age}
                          onChange={(e) =>
                            setNewBookingData({ ...newBookingData, age: e.target.value })
                          }
                          className="w-full px-3 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Gender *</label>
                        <select
                          value={newBookingData.gender}
                          onChange={(e) =>
                            setNewBookingData({ ...newBookingData, gender: e.target.value })
                          }
                          className="w-full px-2 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Contact Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={newBookingData.phone}
                          onChange={(e) =>
                            setNewBookingData({ ...newBookingData, phone: e.target.value })
                          }
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Email Address (Optional)
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={newBookingData.email}
                          onChange={(e) =>
                            setNewBookingData({ ...newBookingData, email: e.target.value })
                          }
                          placeholder="patient@example.com"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor & Department Selection */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>2. Department & Doctor Assignment</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Department Unit *
                      </label>
                      <select
                        required
                        value={newBookingData.departmentId}
                        onChange={(e) => handleNewDeptChange(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs"
                      >
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Consultant Doctor *
                      </label>
                      <select
                        required
                        value={newBookingData.doctorId}
                        onChange={(e) =>
                          setNewBookingData({ ...newBookingData, doctorId: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs"
                      >
                        {availableDoctorsForNew.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} — {doc.specialization} (${doc.consultationFee})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Date, Time & Initial Status */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>3. Schedule & Status</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Appointment Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={newBookingData.preferredDate}
                        onChange={(e) =>
                          setNewBookingData({ ...newBookingData, preferredDate: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs"
                      />
                      <div className="flex gap-2 mt-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setNewBookingData({ ...newBookingData, preferredDate: todayStr })
                          }
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 hover:bg-slate-700"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setNewBookingData({ ...newBookingData, preferredDate: tomorrowStr })
                          }
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700"
                        >
                          Tomorrow
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Time Slot *
                      </label>
                      <select
                        value={newBookingData.preferredTime}
                        onChange={(e) =>
                          setNewBookingData({ ...newBookingData, preferredTime: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs font-mono"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Initial Booking Status *
                      </label>
                      <select
                        value={newBookingData.status}
                        onChange={(e: any) =>
                          setNewBookingData({ ...newBookingData, status: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs font-bold"
                      >
                        <option value="Confirmed">✓ Confirmed (Default)</option>
                        <option value="Pending">⏳ Pending Review</option>
                        <option value="Completed">★ Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Symptoms & Notes */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Chief Complaint / Symptoms
                    </label>
                    <textarea
                      rows={2}
                      value={newBookingData.reason}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, reason: e.target.value })
                      }
                      placeholder="e.g. Chest discomfort, annual executive health screening..."
                      className="w-full p-3 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Administrative & OPD Notes
                    </label>
                    <input
                      type="text"
                      value={newBookingData.adminNotes}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, adminNotes: e.target.value })
                      }
                      placeholder="e.g. Assigned to Room 302, Fasting advised..."
                      className="w-full px-3 py-2 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 -mx-6 -mb-6 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3 rounded-b-3xl">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingNew}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmittingNew ? (
                      <span>Registering Appointment...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Confirm & Generate Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* EDIT BOOKING MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-200 my-8"
            >
              <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-800">
                    {editingAppointment.ticketNumber}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-white mt-1">
                    Edit Appointment Details
                  </h3>
                </div>
                <button
                  onClick={() => setEditingAppointment(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.patientName || ''}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, patientName: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Age</label>
                      <input
                        type="number"
                        value={editFormData.age || ''}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, age: Number(e.target.value) })
                        }
                        className="w-full p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Gender</label>
                      <select
                        value={editFormData.gender || 'Male'}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, gender: e.target.value })
                        }
                        className="w-full p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.phone || ''}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, phone: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Email</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, email: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Consultant Doctor
                    </label>
                    <select
                      value={editFormData.doctorId || ''}
                      onChange={(e) => {
                        const d = doctors.find((doc) => doc.id === e.target.value);
                        setEditFormData({
                          ...editFormData,
                          doctorId: e.target.value,
                          doctorName: d?.name,
                        });
                      }}
                      className="w-full p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                    >
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} ({doc.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Status
                    </label>
                    <select
                      value={editFormData.status || 'Pending'}
                      onChange={(e: any) =>
                        setEditFormData({ ...editFormData, status: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-bold"
                    >
                      <option value="Pending">Pending Review</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Date</label>
                    <input
                      type="date"
                      value={editFormData.preferredDate || ''}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, preferredDate: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Time Slot</label>
                    <select
                      value={editFormData.preferredTime || ''}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, preferredTime: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      {timeSlots.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Symptoms / Chief Complaint
                  </label>
                  <textarea
                    rows={2}
                    value={editFormData.reason || ''}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, reason: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Admin / Doctor Notes
                  </label>
                  <input
                    type="text"
                    value={editFormData.adminNotes || ''}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, adminNotes: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="p-4 -mx-6 -mb-6 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3 rounded-b-3xl">
                  <button
                    type="button"
                    onClick={() => setEditingAppointment(null)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* PATIENT RECORD & CONSULTATION SLIP MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {viewingAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-200 my-8"
            >
              <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-800">
                    {viewingAppointment.ticketNumber}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-white mt-1">
                    Clinical Consultation Slip
                  </h3>
                </div>
                <button
                  onClick={() => setViewingAppointment(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                {/* Status Alert Banner */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-semibold">Appointment Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      viewingAppointment.status === 'Confirmed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : viewingAppointment.status === 'Completed'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : viewingAppointment.status === 'Cancelled'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {viewingAppointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Patient Name</span>
                    <strong className="text-white text-sm">{viewingAppointment.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Age & Gender</span>
                    <span className="text-slate-200 font-semibold">
                      {viewingAppointment.age} Yrs / {viewingAppointment.gender}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Phone Number</span>
                    <span className="text-slate-200 font-mono">{viewingAppointment.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Email</span>
                    <span className="text-slate-200 truncate block">
                      {viewingAppointment.email || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Consultant Doctor</span>
                    <strong className="text-cyan-300">{viewingAppointment.doctorName}</strong>
                    <span className="text-[11px] text-slate-400 block">
                      {viewingAppointment.departmentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Date & Time Slot</span>
                    <strong className="text-white">{viewingAppointment.preferredDate}</strong>
                    <span className="text-[11px] text-teal-400 block font-mono">
                      {viewingAppointment.preferredTime}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-500 block mb-1 font-semibold">
                    Chief Complaint / Consultation Symptoms:
                  </span>
                  <p className="text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    "{viewingAppointment.reason || 'General medical consultation'}"
                  </p>
                </div>

                {viewingAppointment.adminNotes && (
                  <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-200">
                    <span className="font-bold block mb-0.5">Hospital Admin Note:</span>
                    <p>{viewingAppointment.adminNotes}</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setViewingAppointment(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* ADMIN NOTES MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingNotesApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">
                  Add Clinical / Admin Note
                </h3>
                <button onClick={() => setEditingNotesApt(null)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Attaching internal notes for ticket{' '}
                <strong className="text-cyan-300 font-mono">{editingNotesApt.ticketNumber}</strong> ({editingNotesApt.patientName}).
              </p>

              <textarea
                rows={4}
                value={adminNotesText}
                onChange={(e) => setAdminNotesText(e.target.value)}
                placeholder="e.g. Patient instructed to bring fasting blood glucose report. Room 402 assigned..."
                className="w-full p-3 bg-slate-950 text-slate-100 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditingNotesApt(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-200 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800/80 flex items-center justify-center text-rose-400">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-serif">
                  Delete Appointment Record?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to permanently remove ticket{' '}
                  <strong className="text-white font-mono">{deleteTarget.ticketNumber}</strong> for {deleteTarget.patientName}?
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await deleteAppointment(deleteTarget.id);
                    setDeleteTarget(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Delete Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
