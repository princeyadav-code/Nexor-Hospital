import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { Department, Doctor } from '../../types';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Building2,
  ShieldCheck,
  Sparkles,
  Lock,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { motion } from 'motion/react';

interface AppointmentBookingSectionProps {
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const AppointmentBookingSection: React.FC<AppointmentBookingSectionProps> = ({
  isModal = false,
  onCloseModal,
}) => {
  const {
    departments,
    doctors,
    selectedDoctorForBooking,
    setSelectedDoctorForBooking,
    selectedDeptForBooking,
    setSelectedDeptForBooking,
    bookAppointment,
  } = useHospital();

  const { user, userProfile, openAuthModal, addUserAppointmentLocal } = useAuth();

  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number | ''>(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  
  // Set default preferred date to tomorrow's date
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-fill from logged-in user profile
  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setPatientName(userProfile.name);
      if (userProfile.phone) setPhone(userProfile.phone);
      if (userProfile.email) setEmail(userProfile.email);
      if (userProfile.age) setAge(userProfile.age);
      if (userProfile.gender) setGender(userProfile.gender);
    } else if (user) {
      if (user.displayName) setPatientName(user.displayName);
      if (user.email) setEmail(user.email);
      if (user.phoneNumber) setPhone(user.phoneNumber);
    }
  }, [user, userProfile]);

  // Sync pre-selected doctor or department from props/context
  useEffect(() => {
    if (selectedDoctorForBooking) {
      setSelectedDocId(selectedDoctorForBooking.id);
      const matchDept = departments.find(
        (d) =>
          d.name.toLowerCase() === selectedDoctorForBooking.department.toLowerCase() ||
          selectedDoctorForBooking.department.toLowerCase().includes(d.name.toLowerCase())
      );
      if (matchDept) {
        setSelectedDeptId(matchDept.id);
      }
    } else if (selectedDeptForBooking) {
      setSelectedDeptId(selectedDeptForBooking.id);
    } else if (departments.length > 0 && !selectedDeptId) {
      setSelectedDeptId(departments[0].id);
    }
  }, [selectedDoctorForBooking, selectedDeptForBooking, departments]);

  // Filter available doctors for the chosen department
  const availableDoctors = doctors.filter((doc) => {
    if (doc.status === 'Inactive') return false;
    if (!selectedDeptId) return true;
    const currentDept = departments.find((d) => d.id === selectedDeptId);
    if (!currentDept) return true;
    return (
      doc.department.toLowerCase() === currentDept.name.toLowerCase() ||
      doc.department.toLowerCase().includes(currentDept.name.toLowerCase()) ||
      currentDept.name.toLowerCase().includes(doc.department.toLowerCase())
    );
  });

  // Whenever department changes, if current selected doc is not in that department, auto-pick first available doctor
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const chosenDept = departments.find((d) => d.id === deptId);
    if (chosenDept) {
      const docsInDept = doctors.filter(
        (doc) =>
          doc.status === 'Active' &&
          (doc.department.toLowerCase() === chosenDept.name.toLowerCase() ||
            doc.department.toLowerCase().includes(chosenDept.name.toLowerCase()))
      );
      if (docsInDept.length > 0) {
        setSelectedDocId(docsInDept[0].id);
      } else {
        setSelectedDocId('');
      }
    }
  };

  const selectedDoctorObj = doctors.find((d) => d.id === selectedDocId);
  const selectedDepartmentObj = departments.find((d) => d.id === selectedDeptId);

  const timeSlots = [
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // If user is not authenticated, prompt sign up / sign in modal first
    if (!user) {
      openAuthModal('signup', () => {
        // Auto-resume after auth
      });
      return;
    }

    if (!patientName.trim()) {
      setValidationError('Please enter patient full name.');
      return;
    }
    if (!phone.trim() || phone.length < 7) {
      setValidationError('Please enter a valid phone number for SMS ticket confirmation.');
      return;
    }
    if (!selectedDeptId || !selectedDepartmentObj) {
      setValidationError('Please select a clinical department.');
      return;
    }
    if (!selectedDocId || !selectedDoctorObj) {
      setValidationError('Please select an available doctor.');
      return;
    }
    if (!preferredDate) {
      setValidationError('Please select your preferred date.');
      return;
    }

    setIsSubmitting(true);
    const result = await bookAppointment({
      userId: user.uid,
      patientName: patientName.trim(),
      age: Number(age) || 30,
      gender,
      phone: phone.trim(),
      email: email.trim() || user.email || '',
      departmentId: selectedDeptId,
      departmentName: selectedDepartmentObj.name,
      doctorId: selectedDocId,
      doctorName: selectedDoctorObj.name,
      doctorSpecialization: selectedDoctorObj.specialization,
      preferredDate,
      preferredTime,
      reason: reason.trim() || 'General health consultation',
    });

    setIsSubmitting(false);

    if (result.success && result.appointment) {
      addUserAppointmentLocal(result.appointment);
      // Clear form
      setReason('');
      setSelectedDoctorForBooking(null);
      setSelectedDeptForBooking(null);
      if (onCloseModal) onCloseModal();
    }
  };

  return (
    <div
      id="appointments"
      className={`${
        isModal
          ? 'p-0'
          : 'py-20 bg-gradient-to-b from-white via-slate-50 to-white border-t border-slate-200'
      }`}
    >
      <div className={`${isModal ? 'max-w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {!isModal && (
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-cyan-700" />
              <span>Digital Appointment Scheduling</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
              Book a Consultation with Our Medical Specialists
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Skip waiting rooms. Create a patient account, choose your preferred doctor, date, and time slot for seamless OPD care.
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Info Panel (Clinical Guidelines) */}
            <div className="lg:col-span-4 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified OPD Booking</span>
                </div>
                <h3 className="text-2xl font-bold font-serif text-white leading-tight">
                  Seamless Healthcare at Nexora Hospital
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  Appointments are synced with Firebase in real-time. You will receive an instant digital reference ticket linked to your patient portal.
                </p>

                {/* Patient Auth Status Indicator */}
                {user ? (
                  <div className="p-3.5 rounded-2xl bg-teal-950/70 border border-teal-600/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-teal-300 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Authenticated Patient</span>
                    </div>
                    <p className="text-xs text-white font-medium truncate">
                      {userProfile?.name || user.displayName || user.email}
                    </p>
                    <span className="text-[10px] text-teal-200/80 block">
                      Consultation will be linked to your patient medical records.
                    </span>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      <span>Patient Sign Up Required</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Sign in or create an account to store and track your consultation tickets.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => openAuthModal('signup')}
                        className="flex-1 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold text-center cursor-pointer transition-all"
                      >
                        Sign Up
                      </button>
                      <button
                        type="button"
                        onClick={() => openAuthModal('signin')}
                        className="flex-1 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold text-center cursor-pointer transition-all"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                )}

                {/* Selected Doctor Live Card */}
                {selectedDoctorObj && (
                  <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3 mt-4">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                      Selected Specialist
                    </span>
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedDoctorObj.photoUrl}
                        alt={selectedDoctorObj.name}
                        className="w-12 h-12 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white truncate">
                          {selectedDoctorObj.name}
                        </h5>
                        <p className="text-[11px] text-cyan-300 truncate">
                          {selectedDoctorObj.specialization}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Fee: ${selectedDoctorObj.consultationFee} • Room: {selectedDoctorObj.roomNumber || 'OPD'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guidelines Checklist */}
                <div className="space-y-2.5 pt-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Please arrive 15 minutes prior to appointment time for vitals check.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Carry past medical records, prescriptions, and insurance IDs.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>Emergency cases are prioritized immediately at our 24/7 Trauma Center.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-700/40 text-xs">
                <span className="text-cyan-300 font-semibold block mb-1">Need Urgent Help?</span>
                <p className="text-slate-300 text-[11px]">
                  Call our Emergency Hotline at <strong className="text-white">+1 (800) 911-4357</strong>.
                </p>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="lg:col-span-8 p-6 sm:p-8">
              {!user && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-50 via-teal-50 to-cyan-50 border border-cyan-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-cyan-900 font-bold text-xs sm:text-sm">
                      <UserPlus className="w-4 h-4 text-cyan-700" />
                      <span>Sign up required before booking</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600">
                      Create your free patient profile to store and manage your consultation records securely.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openAuthModal('signup')}
                      className="px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Sign Up Free</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {validationError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Patient Personal Details */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      1. Patient Details
                    </h4>
                    {user && (
                      <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Auto-filled from patient profile
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Patient Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          required
                          value={age}
                          onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Gender *
                        </label>
                        <select
                          value={gender}
                          onChange={(e: any) => setGender(e.target.value)}
                          className="w-full px-2 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Phone Number (SMS Ticket Alert) *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="patient@example.com"
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department & Doctor Selection */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    2. Select Department & Doctor
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Department *
                      </label>
                      <select
                        required
                        value={selectedDeptId}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 font-medium"
                      >
                        {departments
                          .filter((d) => d.status === 'Active')
                          .map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name} ({dept.code})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Doctor / Specialist *
                      </label>
                      <select
                        required
                        value={selectedDocId}
                        onChange={(e) => setSelectedDocId(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 font-medium"
                      >
                        {availableDoctors.length === 0 ? (
                          <option value="">No active doctors in this department</option>
                        ) : (
                          availableDoctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.name} – {doc.specialization} (${doc.consultationFee})
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preferred Date & Time */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    3. Schedule Appointment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Preferred Time Slot *
                      </label>
                      <select
                        required
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Consultation Reason */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Reason for Consultation / Current Symptoms
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe your symptoms, previous treatments, or reason for visit..."
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-700 via-teal-700 to-cyan-800 hover:from-cyan-800 hover:to-teal-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Scheduling & Syncing Appointment...</span>
                    ) : !user ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Sign Up / Sign In to Confirm Appointment</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Schedule Appointment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
