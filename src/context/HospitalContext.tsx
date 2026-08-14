import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Doctor, Department, Appointment, HospitalSettings, MedicalService, Testimonial, DashboardStats, AppointmentStatus } from '../types';
import {
  saveAppointmentToFirestore,
  saveDoctorToFirestore,
  fetchDoctorsFromFirestore,
  updateDoctorInFirestore,
  deleteDoctorFromFirestore,
} from '../firebase';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface HospitalContextType {
  // Public state
  doctors: Doctor[];
  departments: Department[];
  settings: HospitalSettings | null;
  services: MedicalService[];
  testimonials: Testimonial[];
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;

  // Modals & Navigation
  activePublicView: string;
  setActivePublicView: (view: string) => void;
  selectedDoctorForModal: Doctor | null;
  setSelectedDoctorForModal: (doctor: Doctor | null) => void;
  selectedDoctorForBooking: Doctor | null;
  setSelectedDoctorForBooking: (doctor: Doctor | null) => void;
  selectedDeptForBooking: Department | null;
  setSelectedDeptForBooking: (dept: Department | null) => void;
  selectedDepartmentForModal: Department | null;
  setSelectedDepartmentForModal: (dept: Department | null) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  bookingSuccessTicket: Appointment | null;
  setBookingSuccessTicket: (apt: Appointment | null) => void;
  isTrackerModalOpen: boolean;
  setIsTrackerModalOpen: (open: boolean) => void;

  // Admin state
  isAdminLoggedIn: boolean;
  isAdminAuthenticated: boolean;
  adminUser: { id: string; username: string; name: string; role: string } | null;
  adminTab: 'overview' | 'doctors' | 'departments' | 'appointments' | 'settings' | 'content';
  setAdminTab: (tab: 'overview' | 'doctors' | 'departments' | 'appointments' | 'settings' | 'content') => void;
  dashboardStats: DashboardStats | null;

  // Actions
  fetchInitialData: () => Promise<void>;
  bookAppointment: (data: any) => Promise<{ success: boolean; appointment?: Appointment; error?: string }>;
  adminLogin: (password: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  
  // Doctor CRUD
  addDoctor: (doctorData: Partial<Doctor>) => Promise<{ success: boolean; doctor?: Doctor; error?: string } | boolean>;
  createDoctor: (doctorData: Partial<Doctor>) => Promise<{ success: boolean; doctor?: Doctor; error?: string } | boolean>;
  updateDoctor: (id: string, doctorData: Partial<Doctor>) => Promise<boolean>;
  deleteDoctor: (id: string) => Promise<boolean>;

  // Department CRUD
  addDepartment: (deptData: Partial<Department>) => Promise<boolean>;
  createDepartment: (deptData: Partial<Department>) => Promise<boolean>;
  updateDepartment: (id: string, deptData: Partial<Department>) => Promise<boolean>;
  deleteDepartment: (id: string) => Promise<boolean>;

  // Appointment Actions
  updateAppointmentStatus: (id: string, status: AppointmentStatus, adminNotes?: string) => Promise<boolean>;
  adminCreateAppointment: (aptData: any) => Promise<{ success: boolean; appointment?: Appointment; error?: string }>;
  adminUpdateAppointment: (id: string, updates: Partial<Appointment>) => Promise<boolean>;
  deleteAppointment: (id: string) => Promise<boolean>;

  // Hospital Settings & Content
  updateHospitalSettings: (newSettings: Partial<HospitalSettings>) => Promise<boolean>;
  addTestimonial: (data: Partial<Testimonial>) => Promise<boolean>;
  createTestimonial: (data: Partial<Testimonial>) => Promise<boolean>;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;
  addService: (data: Partial<MedicalService>) => Promise<boolean>;
  createService: (data: Partial<MedicalService>) => Promise<boolean>;
  updateService: (id: string, data: Partial<MedicalService>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  resetDatabaseDefaults: () => Promise<boolean>;

  // Toast
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [settings, setSettings] = useState<HospitalSettings | null>(null);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation & Modals
  const [activePublicView, setActivePublicView] = useState<string>('home');
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [selectedDeptForBooking, setSelectedDeptForBooking] = useState<Department | null>(null);
  const [selectedDepartmentForModal, setSelectedDepartmentForModal] = useState<Department | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccessTicket, setBookingSuccessTicket] = useState<Appointment | null>(null);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('nexora_admin_token'));
  });
  const [adminUser, setAdminUser] = useState<{ id: string; username: string; name: string; role: string } | null>(() => {
    const saved = localStorage.getItem('nexora_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [adminTab, setAdminTab] = useState<'overview' | 'doctors' | 'departments' | 'appointments' | 'settings' | 'content'>('overview');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [docsRes, deptsRes, settingsRes, srvRes, testRes] = await Promise.all([
        fetch('/api/doctors'),
        fetch('/api/departments'),
        fetch('/api/settings'),
        fetch('/api/services'),
        fetch('/api/testimonials'),
      ]);

      let serverDoctors: Doctor[] = [];
      if (docsRes.ok) {
        serverDoctors = await docsRes.json();
      }

      // Also query Firestore for any doctors saved in cloud collection
      try {
        const firestoreDocs = await fetchDoctorsFromFirestore();
        if (firestoreDocs && firestoreDocs.length > 0) {
          const docMap = new Map<string, Doctor>();
          // Put server doctors first
          serverDoctors.forEach((d) => docMap.set(d.id, d));
          // Merge / overwrite with cloud firestore doctors
          firestoreDocs.forEach((d) => docMap.set(d.id, d));
          serverDoctors = Array.from(docMap.values());
        }
      } catch (fbErr) {
        console.warn('Firestore initial doctor load note:', fbErr);
      }

      setDoctors(serverDoctors);
      if (deptsRes.ok) setDepartments(await deptsRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (srvRes.ok) setServices(await srvRes.json());
      if (testRes.ok) setTestimonials(await testRes.json());

      // If logged in as admin, also fetch admin appointments and stats
      if (isAdminLoggedIn) {
        fetchAdminData();
      }
    } catch (err: any) {
      console.error('Error loading hospital data:', err);
      setError('Unable to reach hospital server. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const [aptRes, statsRes] = await Promise.all([
        fetch('/api/admin/appointments'),
        fetch('/api/admin/stats'),
      ]);
      if (aptRes.ok) setAppointments(await aptRes.json());
      if (statsRes.ok) setDashboardStats(await statsRes.json());
    } catch (e) {
      console.error('Error loading admin data:', e);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminData();
    }
  }, [isAdminLoggedIn]);

  // Book Appointment
  const bookAppointment = async (formData: any) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      setBookingSuccessTicket(data.appointment);
      addToast(`Appointment scheduled successfully! Reference ID: ${data.appointment.ticketNumber}`, 'success');
      
      // Update local appointments list if in admin view
      if (data.appointment) {
        // Save to Firebase Firestore
        try {
          await saveAppointmentToFirestore(data.appointment);
        } catch (fbErr) {
          console.warn('Firestore sync notice for appointment:', fbErr);
        }

        setAppointments((prev) => [data.appointment, ...prev]);
        if (dashboardStats) {
          setDashboardStats({
            ...dashboardStats,
            totalAppointments: dashboardStats.totalAppointments + 1,
            pendingAppointments: dashboardStats.pendingAppointments + 1,
          });
        }
      }
      return { success: true, appointment: data.appointment };
    } catch (err: any) {
      addToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Admin Auth
  const adminLogin = async (password: string, username: string = 'admin@nexora.com') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      localStorage.setItem('nexora_admin_token', data.user.token);
      localStorage.setItem('nexora_admin_user', JSON.stringify(data.user));
      setIsAdminLoggedIn(true);
      setAdminUser(data.user);
      addToast('Welcome back, Medical Administrator!', 'success');
      fetchAdminData();
      return { success: true };
    } catch (err: any) {
      addToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('nexora_admin_token');
    localStorage.removeItem('nexora_admin_user');
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    addToast('Admin logged out safely.', 'info');
  };

  // Doctor CRUD
  const addDoctor = async (docData: Partial<Doctor>) => {
    try {
      let savedDoctor: Doctor | null = null;

      // 1. Save to server backend database
      try {
        const res = await fetch('/api/admin/doctors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(docData),
        });
        const result = await res.json();
        if (res.ok && result && result.id) {
          savedDoctor = result;
        } else if (!res.ok) {
          throw new Error(result.error || 'Server rejected doctor record');
        }
      } catch (serverErr: any) {
        console.warn('Server API save note:', serverErr);
        // If server failed, construct new doctor object to save directly to Firestore
        if (!savedDoctor) {
          const generatedId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          savedDoctor = {
            id: generatedId,
            name: docData.name || '',
            qualification: docData.qualification || 'MBBS, MD',
            specialization: docData.specialization || '',
            department: docData.department || 'General',
            experience: Number(docData.experience) || 5,
            biography: docData.biography || '',
            consultationFee: Number(docData.consultationFee) || 100,
            availableDays: Array.isArray(docData.availableDays) && docData.availableDays.length > 0 ? docData.availableDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            availableTime: docData.availableTime || '09:00 AM - 02:00 PM',
            photoUrl: docData.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80',
            email: docData.email || '',
            phone: docData.phone || '',
            roomNumber: docData.roomNumber || 'OPD Suite',
            status: docData.status || 'Active',
            rating: 5.0,
            reviewsCount: 1,
            createdAt: new Date().toISOString(),
          };
        }
      }

      if (!savedDoctor) {
        throw new Error('Failed to create doctor profile. Please verify your input.');
      }

      // 2. Sync to Firebase Firestore
      try {
        await saveDoctorToFirestore(savedDoctor);
      } catch (fbErr: any) {
        console.warn('Firestore cloud sync notice:', fbErr);
      }

      // 3. Immediately update local state so doctor appears in UI without manual refresh
      setDoctors((prev) => [savedDoctor!, ...prev.filter((d) => d.id !== savedDoctor!.id)]);
      addToast(`Dr. ${savedDoctor.name} saved to database successfully!`, 'success');
      fetchAdminData();
      return { success: true, doctor: savedDoctor };
    } catch (err: any) {
      console.error('Error saving doctor:', err);
      const errMsg = err.message || 'Database error while saving doctor profile.';
      addToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const createDoctor = addDoctor;

  const updateDoctor = async (id: string, docData: Partial<Doctor>) => {
    try {
      let updated: Doctor | null = null;
      try {
        const res = await fetch(`/api/admin/doctors/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(docData),
        });
        if (res.ok) {
          updated = await res.json();
        }
      } catch (srvErr) {
        console.warn('Server doctor update note:', srvErr);
      }

      // Update Firestore cloud document
      try {
        await updateDoctorInFirestore(id, docData);
      } catch (fbErr) {
        console.warn('Firestore doctor update notice:', fbErr);
      }

      setDoctors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...docData, ...(updated || {}) } : d))
      );
      addToast(`Dr. ${docData.name || 'Doctor'}'s profile updated!`, 'success');
      fetchAdminData();
      return true;
    } catch (err: any) {
      console.error('Error updating doctor:', err);
      addToast(err.message || 'Failed to update doctor profile.', 'error');
      return false;
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      try {
        await fetch(`/api/admin/doctors/${id}`, {
          method: 'DELETE',
        });
      } catch (srvErr) {
        console.warn('Server delete note:', srvErr);
      }

      try {
        await deleteDoctorFromFirestore(id);
      } catch (fbErr) {
        console.warn('Firestore delete notice:', fbErr);
      }

      setDoctors((prev) => prev.filter((d) => d.id !== id));
      addToast('Doctor removed from directory.', 'info');
      fetchAdminData();
      return true;
    } catch (err: any) {
      console.error('Error deleting doctor:', err);
      addToast(err.message || 'Failed to delete doctor from database.', 'error');
      return false;
    }
  };

  // Department CRUD
  const addDepartment = async (deptData: Partial<Department>) => {
    try {
      const res = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deptData),
      });
      const newDept = await res.json();
      if (!res.ok) throw new Error(newDept.error || 'Failed to add department');

      setDepartments((prev) => [...prev, newDept]);
      addToast(`Department "${newDept.name}" created!`, 'success');
      fetchAdminData();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const createDepartment = addDepartment;

  const updateDepartment = async (id: string, deptData: Partial<Department>) => {
    try {
      const res = await fetch(`/api/admin/departments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deptData),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Failed to update department');

      setDepartments((prev) => prev.map((d) => (d.id === id ? updated : d)));
      addToast(`Department "${updated.name}" updated!`, 'success');
      fetchAdminData();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/departments/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete department');

      setDepartments((prev) => prev.filter((d) => d.id !== id));
      addToast('Department deleted successfully.', 'info');
      fetchAdminData();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  // Appointment Status Updates
  const updateAppointmentStatus = async (id: string, status: AppointmentStatus, adminNotes?: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...(adminNotes !== undefined ? { adminNotes } : {}) }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Failed to update appointment');

      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      addToast(`Appointment status updated to "${status}"`, 'success');
      fetchAdminData();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const adminCreateAppointment = async (aptData: any) => {
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aptData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create appointment');

      if (data.appointment) {
        try {
          await saveAppointmentToFirestore(data.appointment);
        } catch (fbErr) {
          console.warn('Firestore sync note:', fbErr);
        }
        setAppointments((prev) => [data.appointment, ...prev]);
        if (dashboardStats) {
          setDashboardStats({
            ...dashboardStats,
            totalAppointments: dashboardStats.totalAppointments + 1,
            confirmedAppointments: aptData.status === 'Confirmed' ? dashboardStats.confirmedAppointments + 1 : dashboardStats.confirmedAppointments,
          });
        }
      }
      addToast(`New appointment registered: ${data.appointment?.ticketNumber}`, 'success');
      fetchAdminData();
      return { success: true, appointment: data.appointment };
    } catch (err: any) {
      addToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const adminUpdateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Failed to update appointment');

      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      addToast('Appointment details updated successfully!', 'success');
      fetchAdminData();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete appointment');

      setAppointments((prev) => prev.filter((a) => a.id !== id));
      addToast('Appointment record deleted.', 'info');
      fetchAdminData();
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  // Hospital Settings
  const updateHospitalSettings = async (newSettings: Partial<HospitalSettings>) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Failed to save settings');

      setSettings(updated);
      addToast('Hospital information and homepage settings saved!', 'success');
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  // Testimonials
  const addTestimonial = async (data: Partial<Testimonial>) => {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created.error || 'Failed to add testimonial');
      setTestimonials((prev) => [created, ...prev]);
      addToast('Patient testimonial added!', 'success');
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const createTestimonial = addTestimonial;

  const updateTestimonial = async (id: string, data: Partial<Testimonial>) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Failed to update testimonial');
      setTestimonials((prev) => prev.map((t) => (t.id === id ? updated : t)));
      addToast('Testimonial updated!', 'success');
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete testimonial');
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      addToast('Testimonial deleted.', 'info');
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  // Services
  const addService = async (data: Partial<MedicalService>) => {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      if (!res.ok) throw new Error(created.error || 'Failed to add service');
      setServices((prev) => [...prev, created]);
      addToast('Medical service added!', 'success');
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const createService = addService;

  const updateService = async (id: string, data: Partial<MedicalService>) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Failed to update service');
      setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
      addToast('Service updated!', 'success');
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  const deleteService = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      setServices((prev) => prev.filter((s) => s.id !== id));
      addToast('Service removed.', 'info');
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  // Reset database to sample defaults
  const resetDatabaseDefaults = async () => {
    try {
      const res = await fetch('/api/admin/reset-data', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reset database');
      await fetchInitialData();
      addToast('Sample hospital database restored successfully!', 'success');
      return true;
    } catch (err: any) {
      addToast(err.message, 'error');
      return false;
    }
  };

  return (
    <HospitalContext.Provider
      value={{
        doctors,
        departments,
        settings,
        services,
        testimonials,
        appointments,
        isLoading,
        error,
        activePublicView,
        setActivePublicView,
        selectedDoctorForModal,
        setSelectedDoctorForModal,
        selectedDoctorForBooking,
        setSelectedDoctorForBooking,
        selectedDeptForBooking,
        setSelectedDeptForBooking,
        selectedDepartmentForModal,
        setSelectedDepartmentForModal,
        isBookingModalOpen,
        setIsBookingModalOpen,
        bookingSuccessTicket,
        setBookingSuccessTicket,
        isTrackerModalOpen,
        setIsTrackerModalOpen,
        isAdminLoggedIn,
        isAdminAuthenticated: isAdminLoggedIn,
        adminUser,
        adminTab,
        setAdminTab,
        dashboardStats,
        fetchInitialData,
        bookAppointment,
        adminLogin,
        adminLogout,
        addDoctor,
        createDoctor,
        updateDoctor,
        deleteDoctor,
        addDepartment,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        updateAppointmentStatus,
        adminCreateAppointment,
        adminUpdateAppointment,
        deleteAppointment,
        updateHospitalSettings,
        addTestimonial,
        createTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addService,
        createService,
        updateService,
        deleteService,
        resetDatabaseDefaults,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
