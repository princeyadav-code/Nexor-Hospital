import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { Appointment, UserProfile } from '../../types';
import {
  X,
  User,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Heart,
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  LogOut,
  Sparkles,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PatientPortalModal: React.FC = () => {
  const {
    user,
    userProfile,
    isPatientPortalOpen,
    closePatientPortal,
    logout,
    updateProfileData,
    userAppointments,
    refreshUserAppointments,
  } = useAuth();

  const { setBookingSuccessTicket, setIsBookingModalOpen, appointments: hospitalAllAppointments } = useHospital();

  const [activeTab, setActiveTab] = useState<'appointments' | 'profile'>('appointments');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Edit form state
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [age, setAge] = useState<number | ''>(userProfile?.age || 30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(userProfile?.gender || 'Male');
  const [bloodGroup, setBloodGroup] = useState(userProfile?.bloodGroup || 'O+');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [emergencyContact, setEmergencyContact] = useState(userProfile?.emergencyContact || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setPhone(userProfile.phone || '');
      setAge(userProfile.age || 30);
      setGender(userProfile.gender || 'Male');
      setBloodGroup(userProfile.bloodGroup || 'O+');
      setAddress(userProfile.address || '');
      setEmergencyContact(userProfile.emergencyContact || '');
    }
  }, [userProfile]);

  useEffect(() => {
    if (isPatientPortalOpen && user) {
      refreshUserAppointments();
    }
  }, [isPatientPortalOpen, user]);

  if (!isPatientPortalOpen || !user) return null;

  // Combine user appointments from Auth state with any matching appointments from hospital backend
  const allUserAppointments = [
    ...userAppointments,
    ...hospitalAllAppointments.filter(
      (a) =>
        (a.userId && a.userId === user.uid) ||
        (a.email && user.email && a.email.toLowerCase() === user.email.toLowerCase())
    ),
  ].reduce<Appointment[]>((acc, curr) => {
    if (!acc.some((x) => x.id === curr.id || x.ticketNumber === curr.ticketNumber)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  // Sort latest first
  allUserAppointments.sort(
    (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await updateProfileData({
      phone,
      age: Number(age) || 30,
      gender,
      bloodGroup,
      address,
      emergencyContact,
    });
    setIsSaving(false);
    if (success) {
      setIsEditingProfile(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleViewTicket = (apt: Appointment) => {
    setBookingSuccessTicket(apt);
    closePatientPortal();
  };

  const handleBookNew = () => {
    closePatientPortal();
    setIsBookingModalOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white p-6 sm:p-7 relative shrink-0">
            <button
              onClick={closePatientPortal}
              className="absolute right-5 top-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Close portal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white text-xl font-bold font-serif shadow-lg border border-cyan-400/40">
                  {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                      {userProfile?.name || user.displayName || 'Patient'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                      Verified Patient
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBookNew}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Book Consultation</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closePatientPortal();
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mt-6 border-b border-slate-700/60 pb-px text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('appointments')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'appointments'
                    ? 'border-cyan-400 text-cyan-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>My Appointments ({allUserAppointments.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'border-cyan-400 text-cyan-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Medical Profile & Info</span>
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-7 overflow-y-auto flex-1 bg-slate-50/50">
            {saveSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Your medical profile has been updated successfully!</span>
              </div>
            )}

            {/* APPOINTMENTS TAB */}
            {activeTab === 'appointments' && (
              <div className="space-y-4">
                {allUserAppointments.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-slate-800 font-serif">
                      No Scheduled Appointments Found
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      You have not booked any OPD doctor consultations yet. Choose your preferred doctor and date to schedule your visit.
                    </p>
                    <button
                      type="button"
                      onClick={handleBookNew}
                      className="mt-5 px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Schedule Consultation Now</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allUserAppointments.map((apt) => (
                      <div
                        key={apt.id || apt.ticketNumber}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-md bg-cyan-100 text-cyan-900 font-mono text-xs font-bold">
                              {apt.ticketNumber}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                apt.status === 'Confirmed'
                                  ? 'bg-teal-100 text-teal-800'
                                  : apt.status === 'Completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : apt.status === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {apt.status}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {apt.departmentName}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                              <Stethoscope className="w-4 h-4 text-teal-600" />
                              <span>{apt.doctorName}</span>
                            </h4>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              Patient: <strong>{apt.patientName}</strong> ({apt.age}y, {apt.gender})
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {apt.preferredDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {apt.preferredTime}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleViewTicket(apt)}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-600" />
                            <span>View Ticket</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold font-serif text-slate-900">
                      Personal Health Information
                    </h4>
                    <p className="text-xs text-slate-500">
                      These details are used to pre-fill your doctor consultation booking forms.
                    </p>
                  </div>
                  {!isEditingProfile ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="px-3.5 py-1.5 rounded-xl border border-cyan-600 text-cyan-700 hover:bg-cyan-50 text-xs font-bold transition-all cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Full Name
                      </span>
                      <p className="font-bold text-slate-800 text-sm">
                        {userProfile?.name || user.displayName || 'Not specified'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Email Address
                      </span>
                      <p className="font-bold text-slate-800 text-sm">{user.email}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Mobile Number
                      </span>
                      <p className="font-bold text-slate-800 text-sm">
                        {userProfile?.phone || 'Not provided'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Age & Gender
                      </span>
                      <p className="font-bold text-slate-800 text-sm">
                        {userProfile?.age ? `${userProfile.age} years old` : '30 years old'} •{' '}
                        {userProfile?.gender || 'Male'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Blood Group
                      </span>
                      <p className="font-bold text-teal-700 text-sm">
                        {userProfile?.bloodGroup || 'O+'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Emergency Contact
                      </span>
                      <p className="font-bold text-slate-800 text-sm">
                        {userProfile?.emergencyContact || 'Not specified'}
                      </p>
                    </div>

                    <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Residential Address
                      </span>
                      <p className="font-medium text-slate-800">
                        {userProfile?.address || 'No residential address on file'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Mobile / Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                        />
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Blood Group
                        </label>
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Emergency Contact Number
                        </label>
                        <input
                          type="tel"
                          value={emergencyContact}
                          onChange={(e) => setEmergencyContact(e.target.value)}
                          placeholder="+1 (555) 999-0000"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Residential Address
                      </label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, City, State, ZIP"
                        className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSaving ? (
                        <span>Saving Changes...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Save Updated Profile</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
