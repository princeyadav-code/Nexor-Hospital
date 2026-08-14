export interface Doctor {
  id: string;
  name: string;
  photoUrl: string;
  qualification: string;
  specialization: string;
  department: string;
  experience: number; // in years
  biography: string;
  consultationFee: number;
  availableDays: string[]; // e.g. ["Monday", "Wednesday", "Friday"]
  availableTime: string; // e.g. "09:00 AM - 02:00 PM"
  email?: string;
  phone?: string;
  roomNumber?: string;
  rating?: number;
  reviewsCount?: number;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  icon?: string;
  iconName?: string;
  imageUrl: string;
  headOfDepartment?: string;
  location?: string;
  floorLocation?: string;
  status: 'Active' | 'Inactive';
  featured?: boolean;
  createdAt?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt?: string;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  ticketNumber: string;
  userId?: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization?: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string;
  reason: string;
  status: AppointmentStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface HospitalSettings {
  hospitalName: string;
  tagline: string;
  logoUrl?: string;
  heroBannerUrl?: string;
  heroHeading?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImageUrl: string;
  address: string;
  phone: string;
  email: string;
  emergencyNumber: string;
  ambulanceNumber: string;
  workingHours?: {
    opd?: string;
    emergency?: string;
    visitingHours?: string;
  };
  stats?: {
    experiencedDoctors?: string | number;
    departments?: string | number;
    patientsServed?: string | number;
    satisfactionRate?: string | number;
    emergencyResponseTime?: string;
    doctorsCount?: number;
    departmentsCount?: number;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface MedicalService {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  details: string[];
}

export interface Testimonial {
  id: string;
  patientName: string;
  age?: number;
  treatment: string;
  doctorName?: string;
  rating: number;
  comment: string;
  date: string;
  avatarUrl?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
  token?: string;
}

export interface DashboardStats {
  totalDoctors: number;
  totalDepartments: number;
  totalAppointments: number;
  pendingAppointments: number;
  todayAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  recentAppointments: Appointment[];
  departmentDistribution: { name: string; count: number }[];
}
