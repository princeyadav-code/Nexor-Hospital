import React, { useState, useMemo } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Department } from '../../types';
import { ImageUploader } from '../common/ImageUploader';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Building2,
  X,
  AlertTriangle,
  Users,
  Eye,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  ShieldAlert,
  Flame,
  Stethoscope,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDepartmentManagement: React.FC = () => {
  const {
    departments,
    doctors,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    setSelectedDepartmentForModal,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteTargetDept, setDeleteTargetDept] = useState<Department | null>(null);

  const defaultDeptForm: Omit<Department, 'id' | 'createdAt'> = {
    name: '',
    code: 'GEN',
    description: '',
    icon: 'Stethoscope',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    headOfDepartment: 'Dr. Specialist MD',
    location: 'West Pavilion, 2nd Floor',
    status: 'Active',
  };

  const [formData, setFormData] = useState<Omit<Department, 'id' | 'createdAt'>>(defaultDeptForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const iconOptions = [
    { name: 'HeartPulse', label: 'Heart / Cardiology' },
    { name: 'Brain', label: 'Brain / Neurology' },
    { name: 'Bone', label: 'Bone / Orthopedics' },
    { name: 'Baby', label: 'Baby / Pediatrics' },
    { name: 'ShieldAlert', label: 'Emergency & Trauma' },
    { name: 'Flame', label: 'Oncology / Cancer' },
    { name: 'Stethoscope', label: 'General Medicine' },
  ];

  const filteredDepartments = useMemo(() => {
    return departments.filter((d) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.headOfDepartment?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [departments, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingDept(null);
    setFormData(defaultDeptForm);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description,
      icon: dept.icon || 'Stethoscope',
      imageUrl: dept.imageUrl,
      headOfDepartment: dept.headOfDepartment || '',
      location: dept.location || 'Main Hospital Block',
      status: dept.status || 'Active',
    });
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Please enter department name.');
      return;
    }
    if (!formData.code.trim()) {
      setFormError('Please enter department code.');
      return;
    }

    setIsSubmitting(true);
    try {
      let success = false;
      if (editingDept) {
        success = await updateDepartment(editingDept.id, formData);
      } else {
        success = await createDepartment(formData);
      }

      if (success) {
        setIsFormModalOpen(false);
        setEditingDept(null);
      } else {
        setFormError('Failed to save department. Please try again.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error saving department');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (dept: Department) => {
    const nextStatus = dept.status === 'Active' ? 'Inactive' : 'Active';
    await updateDepartment(dept.id, { status: nextStatus });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetDept) return;
    await deleteDepartment(deleteTargetDept.id);
    setDeleteTargetDept(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
            <Building2 className="w-4 h-4" />
            <span>Clinical Divisions</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-white mt-1">
            Department Management & Facilities
          </h2>
          <p className="text-xs text-slate-400">
            Add new medical branches, assign department heads, update facilities banner images and descriptions.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Department</span>
        </button>
      </div>

      {/* Filter / Search */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search departments by name, code, or HOD..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 text-slate-200 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Total Divisions: <strong className="text-white">{departments.length}</strong>
        </div>
      </div>

      {/* Department Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((dept) => {
          const docCount = doctors.filter(
            (d) =>
              d.department.toLowerCase() === dept.name.toLowerCase() ||
              d.department.toLowerCase().includes(dept.name.toLowerCase())
          ).length;

          return (
            <div
              key={dept.id}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-700 transition-all group"
            >
              <div>
                {/* Dept Image Banner */}
                <div className="relative h-40 bg-slate-950 overflow-hidden">
                  <img
                    src={dept.imageUrl}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-teal-400 font-mono text-xs font-bold border border-slate-700">
                      {dept.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(dept)}
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                      dept.status === 'Active'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    {dept.status}
                  </button>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold font-serif text-white group-hover:text-teal-300 transition-colors">
                    {dept.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Head of Department:</span>
                      <span className="font-semibold text-slate-200">{dept.headOfDepartment}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Location:</span>
                      <span className="font-semibold text-slate-200">{dept.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Assigned Doctors:</span>
                      <span className="font-bold text-teal-400 font-mono">
                        {docCount} Specialist{docCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedDepartmentForModal(dept)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                  title="Preview Modal"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(dept)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Department"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetDept(dept)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Department Modal */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 my-8 text-slate-200"
            >
              <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-white">
                    {editingDept ? `Edit ${editingDept.name}` : 'Add New Department'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure clinical division profile and facility photo.
                  </p>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-5 max-h-[65vh] overflow-y-auto">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-700/50 text-rose-200 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Cardiology & Heart Institute"
                      className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Code / Abbrev *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. CARD"
                      className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Head of Department (HOD)
                    </label>
                    <input
                      type="text"
                      value={formData.headOfDepartment}
                      onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                      placeholder="e.g. Dr. Arthur Pendelton MD"
                      className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Location / Wing
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. West Wing, 3rd Floor"
                      className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Department Description & Capabilities *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive cardiovascular care, catheterization lab, coronary ICU..."
                    className="w-full p-3 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Image Uploader */}
                <ImageUploader
                  label="Department Facility Photo"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  aspectRatio="landscape"
                  presetImages={[
                    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80',
                  ]}
                />

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
                    className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Department'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteTargetDept && (
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
                  Delete Department?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to delete <strong className="text-white">{deleteTargetDept.name}</strong>?
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteTargetDept(null)}
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
