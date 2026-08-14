import React, { useState, useMemo } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Doctor } from '../../types';
import { ImageUploader } from '../common/ImageUploader';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Stethoscope,
  X,
  AlertTriangle,
  UserCheck,
  Building,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDoctorManagement: React.FC = () => {
  const { doctors, departments, createDoctor, updateDoctor, deleteDoctor, setSelectedDoctorForModal } =
    useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deleteTargetDoctor, setDeleteTargetDoctor] = useState<Doctor | null>(null);

  // Form State
  const defaultDoctorForm: Omit<Doctor, 'id' | 'createdAt'> = {
    name: '',
    qualification: 'MD, FACP',
    specialization: '',
    department: departments[0]?.name || 'Cardiology',
    experience: 8,
    biography: '',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableTime: '09:00 AM - 02:00 PM',
    consultationFee: 120,
    phone: '+1 (800) 555-6396',
    email: 'doctor@nexorahospital.com',
    roomNumber: 'OPD Suite 204',
    status: 'Active',
    rating: 4.9,
    reviewsCount: 45,
  };

  const [formData, setFormData] = useState<Omit<Doctor, 'id' | 'createdAt'>>(defaultDoctorForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      if (selectedDeptFilter !== 'all' && doc.department !== selectedDeptFilter) return false;
      if (selectedStatusFilter !== 'all' && doc.status !== selectedStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialization.toLowerCase().includes(q);
        const matchesDept = doc.department.toLowerCase().includes(q);
        return matchesName || matchesSpec || matchesDept;
      }
      return true;
    });
  }, [doctors, selectedDeptFilter, selectedStatusFilter, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingDoctor(null);
    setFormData({
      ...defaultDoctorForm,
      department: departments[0]?.name || 'Cardiology',
    });
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (doc: Doctor) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      qualification: doc.qualification,
      specialization: doc.specialization,
      department: doc.department,
      experience: doc.experience,
      biography: doc.biography,
      photoUrl: doc.photoUrl,
      availableDays: doc.availableDays || ['Monday', 'Wednesday'],
      availableTime: doc.availableTime || '09:00 AM - 02:00 PM',
      consultationFee: doc.consultationFee || 100,
      phone: doc.phone || '+1 (800) 555-6396',
      email: doc.email || 'doctor@nexorahospital.com',
      roomNumber: doc.roomNumber || 'OPD Suite 101',
      status: doc.status || 'Active',
      rating: doc.rating || 4.9,
      reviewsCount: doc.reviewsCount || 50,
    });
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleToggleDay = (day: string) => {
    const current = formData.availableDays || [];
    if (current.includes(day)) {
      setFormData({ ...formData, availableDays: current.filter((d) => d !== day) });
    } else {
      setFormData({ ...formData, availableDays: [...current, day] });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Please enter doctor name.');
      return;
    }
    if (!formData.specialization.trim()) {
      setFormError('Please enter specialization.');
      return;
    }
    if (!formData.photoUrl.trim()) {
      setFormError('Please provide a doctor portrait image.');
      return;
    }

    setIsSubmitting(true);
    try {
      let result: any;
      if (editingDoctor) {
        result = await updateDoctor(editingDoctor.id, formData);
      } else {
        result = await createDoctor(formData);
      }

      const isSuccess = typeof result === 'object' ? result?.success : Boolean(result);

      if (isSuccess) {
        setIsFormModalOpen(false);
        setEditingDoctor(null);
        setFormError(null);
      } else {
        const errorMsg =
          typeof result === 'object' && result?.error
            ? result.error
            : 'Failed to save doctor to database. Please check your connection and try again.';
        setFormError(errorMsg);
      }
    } catch (err: any) {
      console.error('Error saving doctor to database:', err);
      setFormError(err.message || 'An unexpected error occurred while saving doctor record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleDoctorStatus = async (doc: Doctor) => {
    const nextStatus = doc.status === 'Active' ? 'Inactive' : 'Active';
    await updateDoctor(doc.id, { status: nextStatus });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetDoctor) return;
    await deleteDoctor(deleteTargetDoctor.id);
    setDeleteTargetDoctor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Stethoscope className="w-4 h-4" />
            <span>Clinical Faculty Roster</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-white mt-1">
            Doctor Directory & OPD Scheduling
          </h2>
          <p className="text-xs text-slate-400">
            Add, update profile photos, modify consultation schedules, and manage clinical status. Changes reflect live on the website.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors by name, qualification, specialty..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 text-slate-200 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="py-2 px-3 bg-slate-950 text-slate-300 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-950 text-slate-300 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active only</option>
            <option value="Inactive">Inactive only</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3.5 px-4">Doctor</th>
                <th className="py-3.5 px-4">Department & Exp</th>
                <th className="py-3.5 px-4">Schedule & Timings</th>
                <th className="py-3.5 px-4">Fee / Room</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                    No doctors match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Doctor Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.photoUrl}
                          alt={doc.name}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white text-xs">{doc.name}</div>
                          <div className="text-[11px] text-cyan-400 font-semibold truncate">
                            {doc.specialization}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {doc.qualification}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Exp */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-800/60 text-[11px] font-semibold mb-1">
                        {doc.department}
                      </span>
                      <div className="text-[11px] text-slate-400">
                        {doc.experience} Years Clinical Experience
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] text-slate-200">
                        {doc.availableTime || '09:00 AM - 02:00 PM'}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {doc.availableDays?.join(', ') || 'Mon-Fri'}
                      </div>
                    </td>

                    {/* Fee & Room */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-teal-400 text-xs">${doc.consultationFee}</div>
                      <div className="text-[10px] text-slate-400">
                        {doc.roomNumber || 'OPD Suite'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleDoctorStatus(doc)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          doc.status === 'Active'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            doc.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-500'
                          }`}
                        />
                        {doc.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedDoctorForModal(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                          title="Preview Public Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Doctor Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetDoctor(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Doctor"
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

      {/* Add / Edit Doctor Modal */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 my-8 text-slate-200"
            >
              {/* Modal Header */}
              <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-white">
                    {editingDoctor ? `Edit ${editingDoctor.name}` : 'Add New Clinical Specialist'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure profile, department affiliation, OPD schedule, and biography.
                  </p>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-700/50 text-rose-200 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Section 1: Basic Information */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    1. Professional Identity
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Doctor Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Arthur Pendelton"
                        className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Department *
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      >
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Specialization / Sub-specialty *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        placeholder="e.g. Interventional Cardiology & Structural Heart"
                        className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Qualifications / Degrees *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        placeholder="e.g. MD, DM (Cardiology), FACC, FSCAI"
                        className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Photo Uploader */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    2. Doctor Portrait Photo (Upload or URL)
                  </h4>
                  <ImageUploader
                    label="Doctor Portrait Image"
                    value={formData.photoUrl}
                    onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                    aspectRatio="square"
                    presetImages={[
                      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1594824813533-5c79219b22a0?w=800&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=80',
                    ]}
                  />
                </div>

                {/* Section 3: Consultation Schedule & Fee */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    3. OPD Schedule & Consultation Settings
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Experience (Years) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        required
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Consultation Fee ($) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.consultationFee}
                        onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Active">Active (Available for booking)</option>
                        <option value="Inactive">Inactive (Hidden from public directory)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Consultation Hours / Timing *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.availableTime}
                        onChange={(e) => setFormData({ ...formData, availableTime: e.target.value })}
                        placeholder="e.g. 09:00 AM - 02:00 PM"
                        className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Room / OPD Location
                      </label>
                      <input
                        type="text"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        placeholder="e.g. OPD Suite 204, Tower B"
                        className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Days Multi-Select */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Available OPD Days:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysList.map((day) => {
                        const isSelected = formData.availableDays?.includes(day);
                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => handleToggleDay(day)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              isSelected
                                ? 'bg-cyan-700 border-cyan-500 text-white shadow-xs'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section 4: Biography & Contact */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    4. Biography & Contact
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Doctor Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="doctor@nexorahospital.com"
                        className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Doctor Phone
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (800) 555-6396"
                        className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Professional Biography *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.biography}
                      onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                      placeholder="Detailed background, clinical fellowships, published papers, patient care philosophy..."
                      className="w-full p-3 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <span>Saving to Database...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{editingDoctor ? 'Save Doctor Profile' : 'Add Doctor to Faculty'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTargetDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
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
                  Delete Doctor Record?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to delete <strong className="text-white">{deleteTargetDoctor.name}</strong> from the clinical directory? This doctor will no longer appear on the public website or booking forms.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteTargetDoctor(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
