import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from './components/common/ToastContainer';
import { Navbar } from './components/public/Navbar';
import { HeroSection } from './components/public/HeroSection';
import { StatsSection } from './components/public/StatsSection';
import { DepartmentsSection } from './components/public/DepartmentsSection';
import { DepartmentDetailModal } from './components/public/DepartmentDetailModal';
import { DoctorsSection } from './components/public/DoctorsSection';
import { DoctorProfileModal } from './components/public/DoctorProfileModal';
import { ServicesSection } from './components/public/ServicesSection';
import { FacilitiesSection } from './components/public/FacilitiesSection';
import { AboutSection } from './components/public/AboutSection';
import { AppointmentBookingSection } from './components/public/AppointmentBookingSection';
import { AppointmentConfirmationModal } from './components/public/AppointmentConfirmationModal';
import { AppointmentTrackerModal } from './components/public/AppointmentTrackerModal';
import { TestimonialsSection } from './components/public/TestimonialsSection';
import { ContactEmergencySection } from './components/public/ContactEmergencySection';
import { Footer } from './components/public/Footer';

// Auth Components
import { AuthModal } from './components/auth/AuthModal';
import { PatientPortalModal } from './components/auth/PatientPortalModal';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminDoctorManagement } from './components/admin/AdminDoctorManagement';
import { AdminDepartmentManagement } from './components/admin/AdminDepartmentManagement';
import { AdminAppointmentManagement } from './components/admin/AdminAppointmentManagement';
import { AdminHospitalSettings } from './components/admin/AdminHospitalSettings';
import { AdminHomepageContent } from './components/admin/AdminHomepageContent';

import { X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const HospitalAppContent: React.FC = () => {
  const {
    isAdminLoggedIn,
    isAdminAuthenticated,
    adminTab,
    isBookingModalOpen,
    setIsBookingModalOpen,
    setSelectedDoctorForBooking,
    setSelectedDeptForBooking,
  } = useHospital();

  const isAuthed = isAdminLoggedIn || isAdminAuthenticated;

  const [isAdminView, setIsAdminView] = useState(() => {
    // Check URL or hash if needed
    return window.location.pathname.includes('/admin') || window.location.hash.includes('admin');
  });

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDoctorForBooking(null);
    setSelectedDeptForBooking(null);
  };

  // If in Admin view
  if (isAdminView) {
    if (!isAuthed) {
      return <AdminLogin onBackToPublic={() => setIsAdminView(false)} />;
    }

    return (
      <AdminLayout onExitAdmin={() => setIsAdminView(false)}>
        {adminTab === 'overview' && <AdminOverview />}
        {adminTab === 'doctors' && <AdminDoctorManagement />}
        {adminTab === 'departments' && <AdminDepartmentManagement />}
        {adminTab === 'appointments' && <AdminAppointmentManagement />}
        {adminTab === 'settings' && <AdminHospitalSettings />}
        {adminTab === 'content' && <AdminHomepageContent />}
      </AdminLayout>
    );
  }

  // Public Hospital Website
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900 font-sans">
      {/* Navigation */}
      <Navbar onOpenAdmin={() => setIsAdminView(true)} />

      {/* Main Sections */}
      <main>
        <HeroSection onOpenAdmin={() => setIsAdminView(true)} />
        <StatsSection />
        <DepartmentsSection />
        <DoctorsSection />
        <ServicesSection />
        <FacilitiesSection />
        <AboutSection />
        <AppointmentBookingSection />
        <TestimonialsSection />
        <ContactEmergencySection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminView(true)} />

      {/* Modals & Overlays */}
      <DepartmentDetailModal />
      <DoctorProfileModal />
      <AppointmentConfirmationModal />
      <AppointmentTrackerModal />
      <AuthModal />
      <PatientPortalModal />

      {/* Dedicated Floating / Header Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8"
            >
              <button
                onClick={handleCloseBookingModal}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[85vh] overflow-y-auto">
                <AppointmentBookingSection isModal onCloseModal={handleCloseBookingModal} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <HospitalProvider>
        <ToastContainer />
        <HospitalAppContent />
      </HospitalProvider>
    </AuthProvider>
  );
}

export default App;

