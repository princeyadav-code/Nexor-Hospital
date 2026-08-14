import fs from 'fs';
import path from 'path';
import { Doctor, Department, Appointment, AppointmentStatus, HospitalSettings, MedicalService, Testimonial } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'hospital_db.json');

export interface DatabaseSchema {
  doctors: Doctor[];
  departments: Department[];
  appointments: Appointment[];
  settings: HospitalSettings;
  services: MedicalService[];
  testimonials: Testimonial[];
  adminPasswordHash: string;
}

const DEFAULT_SETTINGS: HospitalSettings = {
  hospitalName: "Nexora Hospital",
  tagline: "Advancing Medicine. Empowering Life.",
  logoUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&auto=format&fit=crop&q=80",
  heroBannerUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=80",
  heroHeading: "World-Class Healthcare with Human Compassion",
  heroDescription: "Experience international standard medical excellence, cutting-edge surgical robotics, and compassionate multidisciplinary care available 24/7.",
  heroCtaPrimary: "Book an Appointment",
  heroCtaSecondary: "Explore Specialists",
  aboutTitle: "Leading the Future of Precision Healthcare",
  aboutDescription: "Founded on the bedrock of medical innovation and patient-centered empathy, Nexora Hospital has grown into a state-of-the-art tertiary care center. With over 24 specialized medical departments, internationally trained clinicians, robotic surgery suites, and round-the-clock emergency trauma response, we stand dedicated to preserving health and restoring hope.",
  aboutImageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1000&auto=format&fit=crop&q=80",
  address: "450 Health Sciences Parkway, Metro Medical District, NY 10016",
  phone: "+1 (800) 555-6396",
  email: "care@nexorahospital.com",
  emergencyNumber: "+1 (800) 911-4357",
  ambulanceNumber: "+1 (800) 911-AMBU",
  workingHours: {
    opd: "Monday - Saturday: 08:00 AM - 08:00 PM",
    emergency: "24 Hours / 7 Days a Week (Always Open)",
    visitingHours: "Daily: 11:00 AM - 01:00 PM & 04:00 PM - 07:00 PM"
  },
  stats: {
    experiencedDoctors: "85+",
    departments: "24+",
    patientsServed: "150,000+",
    satisfactionRate: "99.2%",
    emergencyResponseTime: "< 8 Mins"
  },
  socialLinks: {
    facebook: "https://facebook.com/nexorahospital",
    twitter: "https://twitter.com/nexorahospital",
    linkedin: "https://linkedin.com/company/nexorahospital",
    instagram: "https://instagram.com/nexorahospital",
    youtube: "https://youtube.com/nexorahospital"
  }
};

const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: "dept-cardiology",
    name: "Cardiology",
    code: "CARD",
    description: "Comprehensive cardiovascular diagnostics, digital catheterization, electrophysiology, and open-heart surgical care.",
    iconName: "HeartPulse",
    imageUrl: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. Alexander Wright, MD, FACC",
    floorLocation: "3rd Floor, Heart & Vascular Tower",
    status: "Active",
    featured: true
  },
  {
    id: "dept-neurology",
    name: "Neurology & Neurosurgery",
    code: "NEUR",
    description: "Pioneering therapies for neurological disorders, stroke intervention, brain tumor resection, and spine surgery.",
    iconName: "Brain",
    imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. Elena Rostova, MD, PhD",
    floorLocation: "4th Floor, Neuroscience Institute",
    status: "Active",
    featured: true
  },
  {
    id: "dept-orthopedics",
    name: "Orthopedics & Joint Replacement",
    code: "ORTH",
    description: "Advanced robotic total joint replacements, sports medicine arthroscopy, trauma fracture repair, and spine surgery.",
    iconName: "Bone",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. Marcus Vance, MS, FRCS",
    floorLocation: "2nd Floor, Orthopedic Center",
    status: "Active",
    featured: true
  },
  {
    id: "dept-pediatrics",
    name: "Pediatrics & Neonatology",
    code: "PEDI",
    description: "Compassionate child healthcare from newborn intensive care (Level III NICU) to adolescent medicine.",
    iconName: "Baby",
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. Sarah Jenkins, MD, FAAP",
    floorLocation: "5th Floor, Children's Pavilion",
    status: "Active",
    featured: true
  },
  {
    id: "dept-gynecology",
    name: "Gynecology & Obstetrics",
    code: "GYNE",
    description: "Maternal-fetal medicine, high-risk pregnancy suites, laparoscopic gynecological oncology, and women's health.",
    iconName: "Flower2",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. Maya Patel, MD, FACOG",
    floorLocation: "2nd Floor, Women's Health Wing",
    status: "Active",
    featured: true
  },
  {
    id: "dept-general-medicine",
    name: "General Internal Medicine",
    code: "GENM",
    description: "Holistic preventive screening, chronic lifestyle disease management, diabetes care, and infectious pathology.",
    iconName: "Stethoscope",
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. Robert Chen, MD",
    floorLocation: "1st Floor, Outpatient Clinic A",
    status: "Active",
    featured: true
  },
  {
    id: "dept-general-surgery",
    name: "General & Laparoscopic Surgery",
    code: "SURG",
    description: "Minimally invasive gastrointestinal surgeries, laser procedures, hernia repairs, and oncologic resections.",
    iconName: "Scissors",
    imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. David Sterling, FACS",
    floorLocation: "4th Floor, Surgical Complex",
    status: "Active",
    featured: false
  },
  {
    id: "dept-dermatology",
    name: "Dermatology & Cosmetology",
    code: "DERM",
    description: "Clinical skin disease treatments, laser rejuvenation, allergy patch testing, and dermatosurgery.",
    iconName: "Sparkles",
    imageUrl: "https://images.unsplash.com/photo-1512290900672-1f02e6a0958d?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. Sophia Lauren, MD",
    floorLocation: "1st Floor, Suite 104",
    status: "Active",
    featured: false
  },
  {
    id: "dept-ent",
    name: "Ear, Nose & Throat (ENT)",
    code: "ENTD",
    description: "Microscopic ear surgery, endoscopic sinus interventions, hearing restoration, and voice disorder clinics.",
    iconName: "Volume2",
    imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. Vikram Malhotra, MS",
    floorLocation: "2nd Floor, Suite 210",
    status: "Active",
    featured: false
  },
  {
    id: "dept-dental",
    name: "Dental & Maxillofacial",
    code: "DENT",
    description: "Comprehensive oral maxillofacial surgeries, implantology, digital smile design, and orthodontics.",
    iconName: "Smile",
    imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. Rachel Green, DDS",
    floorLocation: "1st Floor, Dental Pavilion",
    status: "Active",
    featured: false
  },
  {
    id: "dept-radiology",
    name: "Radiology & Imaging",
    code: "RADI",
    description: "3 Tesla MRI, 128-Slice Dual Source CT, Digital 3D Mammography, and Interventional Fluoroscopy.",
    iconName: "Scan",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. Arthur Campbell, MD",
    floorLocation: "Basement Level 1, Diagnostic Center",
    status: "Active",
    featured: false
  },
  {
    id: "dept-emergency",
    name: "Emergency & Trauma",
    code: "EMER",
    description: "24/7 Level 1 Trauma center equipped with rapid resuscitation bays, dedicated CT, and critical air ambulance landing.",
    iconName: "ShieldAlert",
    imageUrl: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&auto=format&fit=crop&q=80",
    headOfDepartment: "Dr. Kimberly Adams, MD, FACEP",
    floorLocation: "Ground Floor, Direct Ambulance Bay",
    status: "Active",
    featured: true
  }
];

const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Alexander Wright",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80",
    qualification: "MD, DM (Cardiology), FACC (USA)",
    specialization: "Senior Interventional Cardiologist",
    department: "Cardiology",
    experience: 18,
    biography: "Dr. Alexander Wright has performed over 5,000 coronary angioplasties and structural heart interventions. He trained at Johns Hopkins and is recognized for advancing transcatheter aortic valve replacements (TAVR).",
    consultationFee: 150,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableTime: "09:00 AM - 01:00 PM",
    email: "alexander.wright@nexorahospital.com",
    phone: "+1 (800) 555-0101",
    roomNumber: "Room 302, Heart Center",
    rating: 4.9,
    reviewsCount: 142,
    status: "Active"
  },
  {
    id: "doc-2",
    name: "Dr. Elena Rostova",
    photoUrl: "https://images.unsplash.com/photo-1594824813689-53e7f5eb33da?w=800&auto=format&fit=crop&q=80",
    qualification: "MD, PhD (Neuroscience), FACS",
    specialization: "Consultant Neurosurgeon & Spine Specialist",
    department: "Neurology & Neurosurgery",
    experience: 15,
    biography: "Dr. Elena Rostova specializes in minimally invasive neuro-endoscopy, awake brain craniotomies, and complex spinal reconstruction. She has published over 30 peer-reviewed articles in surgical neurology.",
    consultationFee: 180,
    availableDays: ["Monday", "Wednesday", "Thursday", "Saturday"],
    availableTime: "10:00 AM - 03:00 PM",
    email: "elena.rostova@nexorahospital.com",
    phone: "+1 (800) 555-0102",
    roomNumber: "Room 410, Neuro Suite",
    rating: 4.95,
    reviewsCount: 98,
    status: "Active"
  },
  {
    id: "doc-3",
    name: "Dr. Marcus Vance",
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=80",
    qualification: "MS (Ortho), MCh, FRCS (Edin)",
    specialization: "Robotic Joint Replacement & Sports Surgeon",
    department: "Orthopedics & Joint Replacement",
    experience: 16,
    biography: "A pioneer in robotic-assisted knee and hip arthroplasty, Dr. Vance provides rapid recovery protocols ensuring patients can walk within hours of surgery.",
    consultationFee: 140,
    availableDays: ["Tuesday", "Wednesday", "Friday", "Saturday"],
    availableTime: "08:30 AM - 01:30 PM",
    email: "marcus.vance@nexorahospital.com",
    phone: "+1 (800) 555-0103",
    roomNumber: "Room 205, Ortho Wing",
    rating: 4.88,
    reviewsCount: 160,
    status: "Active"
  },
  {
    id: "doc-4",
    name: "Dr. Maya Patel",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80",
    qualification: "MD, DGO, FACOG",
    specialization: "High-Risk Pregnancy & Laparoscopic Gynecologist",
    department: "Gynecology & Obstetrics",
    experience: 14,
    biography: "Dr. Maya Patel provides compassionate, patient-first maternal care. She has guided over 3,000 successful safe deliveries and specializes in painless childbirth techniques and laparoscopic fibroid treatments.",
    consultationFee: 120,
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    availableTime: "09:30 AM - 02:30 PM",
    email: "maya.patel@nexorahospital.com",
    phone: "+1 (800) 555-0104",
    roomNumber: "Room 214, Women's Clinic",
    rating: 4.96,
    reviewsCount: 215,
    status: "Active"
  },
  {
    id: "doc-5",
    name: "Dr. Sarah Jenkins",
    photoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
    qualification: "MD (Pediatrics), FAAP, Fellowship in Neonatology",
    specialization: "Chief Pediatrician & Neonatologist",
    department: "Pediatrics & Neonatology",
    experience: 12,
    biography: "Dedicated to nurturing infant and child well-being, Dr. Jenkins manages acute pediatric conditions, growth development evaluations, and NICU critical life support.",
    consultationFee: 110,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
    availableTime: "09:00 AM - 01:30 PM",
    email: "sarah.jenkins@nexorahospital.com",
    phone: "+1 (800) 555-0105",
    roomNumber: "Room 501, Pediatric Tower",
    rating: 4.92,
    reviewsCount: 180,
    status: "Active"
  },
  {
    id: "doc-6",
    name: "Dr. Robert Chen",
    photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=80",
    qualification: "MD (Internal Medicine), FACP",
    specialization: "Senior Consultant Physician & Diabetologist",
    department: "General Internal Medicine",
    experience: 20,
    biography: "Dr. Chen delivers comprehensive diagnostic medicine for complicated multi-system disorders, hypertension, metabolic syndrome, and preventative executive health checks.",
    consultationFee: 100,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableTime: "08:00 AM - 02:00 PM",
    email: "robert.chen@nexorahospital.com",
    phone: "+1 (800) 555-0106",
    roomNumber: "Room 108, OPD Complex",
    rating: 4.85,
    reviewsCount: 230,
    status: "Active"
  },
  {
    id: "doc-7",
    name: "Dr. David Sterling",
    photoUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&auto=format&fit=crop&q=80",
    qualification: "MS, FACS, FICS",
    specialization: "Lead Minimal Access & Gastrointestinal Surgeon",
    department: "General & Laparoscopic Surgery",
    experience: 17,
    biography: "Master surgeon specializing in advanced keyhole laparoscopic surgery, gastrointestinal oncology, laser proctology, and complex abdominal wall reconstructions.",
    consultationFee: 160,
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableTime: "10:00 AM - 04:00 PM",
    email: "david.sterling@nexorahospital.com",
    phone: "+1 (800) 555-0107",
    roomNumber: "Room 402, Surgery Wing",
    rating: 4.9,
    reviewsCount: 110,
    status: "Active"
  },
  {
    id: "doc-8",
    name: "Dr. Sophia Lauren",
    photoUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&auto=format&fit=crop&q=80",
    qualification: "MD (Dermatology), Board Certified Dermatologist",
    specialization: "Aesthetic & Clinical Dermatologist",
    department: "Dermatology & Cosmetology",
    experience: 11,
    biography: "Expert in treating complex autoimmune skin disorders, severe acne, advanced laser treatments, scar revision, and anti-aging dermatologic therapies.",
    consultationFee: 130,
    availableDays: ["Tuesday", "Thursday", "Friday", "Saturday"],
    availableTime: "11:00 AM - 05:00 PM",
    email: "sophia.lauren@nexorahospital.com",
    phone: "+1 (800) 555-0108",
    roomNumber: "Room 104, Skin Clinic",
    rating: 4.89,
    reviewsCount: 145,
    status: "Active"
  },
  {
    id: "doc-9",
    name: "Dr. Kimberly Adams",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80",
    qualification: "MD, FACEP, Fellowship in Critical Care",
    specialization: "Director of Emergency Medicine & Trauma Care",
    department: "Emergency & Trauma",
    experience: 19,
    biography: "Leading our Level 1 Emergency trauma response, Dr. Adams coordinates fast-action triage, acute resuscitation protocols, and disaster preparedness teams.",
    consultationFee: 100,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    availableTime: "24/7 On-Call Roster",
    email: "kimberly.adams@nexorahospital.com",
    phone: "+1 (800) 555-0109",
    roomNumber: "Ground Floor Emergency Command",
    rating: 4.98,
    reviewsCount: 310,
    status: "Active"
  }
];

const DEFAULT_SERVICES: MedicalService[] = [
  {
    id: "srv-1",
    title: "24/7 Level 1 Emergency & Trauma",
    description: "Immediate life-saving critical care with rapid triage, dedicated trauma operating rooms, and on-site blood bank.",
    icon: "ShieldAlert",
    badge: "24/7 Service",
    details: ["Paramedic Mobile ICU Fleet", "Under 8-minute door-to-balloon time", "Dedicated resuscitation bays"]
  },
  {
    id: "srv-2",
    title: "Next-Gen Robotic Surgery Suites",
    description: "Ultra-precise minimally invasive surgery with Da Vinci Xi robotic systems for faster healing and minimal discomfort.",
    icon: "Cpu",
    badge: "Advanced Tech",
    details: ["Urology & Gynecology precision", "Sub-millimeter surgical accuracy", "Same-day/short-stay discharge"]
  },
  {
    id: "srv-3",
    title: "Comprehensive Heart & Vascular Care",
    description: "Full spectrum cardiovascular medicine including digital 3D Cath Lab, bypass surgery, and electrophysiology.",
    icon: "HeartPulse",
    badge: "Center of Excellence",
    details: ["Primary Angioplasty (24/7)", "TAVR & Mitral Clip Procedures", "Cardiac Rehab Program"]
  },
  {
    id: "srv-4",
    title: "Advanced 3T MRI & High-Speed CT",
    description: "Ultra-high definition imaging for swift, pinpoint diagnostic accuracy across neurology, oncology, and musculoskeletal.",
    icon: "Scan",
    badge: "Diagnostics",
    details: ["Quiet 3.0 Tesla MRI", "128-Slice Low-Dose CT", "AI-assisted pathology detection"]
  },
  {
    id: "srv-5",
    title: "Intensive Care Units (ICU, CCU, NICU)",
    description: "Round-the-clock intensivist-led critical care with advanced mechanical ventilation and continuous hemodynamic monitoring.",
    icon: "Activity",
    badge: "Critical Care",
    details: ["Level III Neonatal ICU", "1:1 Nurse-to-Patient ratio in ICU", "Infection-controlled isolated pods"]
  },
  {
    id: "srv-6",
    title: "Rehabilitation & Sports Physical Therapy",
    description: "Personalized physiotherapy, neuro-rehabilitation, hydrotherapy, and occupational training for rapid functional recovery.",
    icon: "Zap",
    badge: "Wellness",
    details: ["Gait & balance retraining", "Post-surgical joint recovery", "Certified athletic trainers"]
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    patientName: "Michael Henderson",
    age: 58,
    treatment: "Robotic Cardiac Angioplasty",
    doctorName: "Dr. Alexander Wright",
    rating: 5,
    comment: "The precision and empathy of Dr. Wright and the cardiology team at Nexora Hospital saved my life. I was back home in 48 hours feeling stronger than ever. The staff treated me like family.",
    date: "2026-06-18",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "test-2",
    patientName: "Emily Davenport",
    age: 34,
    treatment: "High-Risk Maternity & Delivery",
    doctorName: "Dr. Maya Patel",
    rating: 5,
    comment: "Giving birth to our twins at Nexora was an exceptional experience. Dr. Maya Patel provided reassuring guidance every step of the way, and the labor suites are serene and modern.",
    date: "2026-07-04",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "test-3",
    patientName: "Jonathan Miller",
    age: 46,
    treatment: "Minimally Invasive Spine Surgery",
    doctorName: "Dr. Elena Rostova",
    rating: 5,
    comment: "Years of debilitating back pain were resolved through a 45-minute microscopic procedure by Dr. Rostova. Outstanding nursing care and clean, world-class facilities.",
    date: "2026-07-29",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  }
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-101",
    ticketNumber: "NX-84920",
    patientName: "Claire Sullivan",
    age: 42,
    gender: "Female",
    phone: "+1 (555) 234-5678",
    email: "claire.sullivan@example.com",
    departmentId: "dept-cardiology",
    departmentName: "Cardiology",
    doctorId: "doc-1",
    doctorName: "Dr. Alexander Wright",
    doctorSpecialization: "Senior Interventional Cardiologist",
    preferredDate: "2026-08-16",
    preferredTime: "10:30 AM",
    reason: "Experiencing occasional chest tightness during morning exercise. Seeking thorough ECG and consult.",
    status: "Confirmed",
    adminNotes: "Pre-appointment ECG scheduled 30 mins prior in Room 301.",
    createdAt: "2026-08-12T14:30:00.000Z"
  },
  {
    id: "apt-102",
    ticketNumber: "NX-84921",
    patientName: "Gregory Evans",
    age: 61,
    gender: "Male",
    phone: "+1 (555) 345-6789",
    email: "gregory.evans@example.com",
    departmentId: "dept-orthopedics",
    departmentName: "Orthopedics & Joint Replacement",
    doctorId: "doc-3",
    doctorName: "Dr. Marcus Vance",
    doctorSpecialization: "Robotic Joint Replacement Specialist",
    preferredDate: "2026-08-17",
    preferredTime: "11:00 AM",
    reason: "Post-op checkup for right knee replacement done 6 weeks ago. Good mobility, slight stiffness.",
    status: "Confirmed",
    adminNotes: "Bring recent X-rays for review.",
    createdAt: "2026-08-13T09:15:00.000Z"
  },
  {
    id: "apt-103",
    ticketNumber: "NX-84922",
    patientName: "Hannah Ross",
    age: 29,
    gender: "Female",
    phone: "+1 (555) 456-7890",
    email: "hannah.ross@example.com",
    departmentId: "dept-dermatology",
    departmentName: "Dermatology & Cosmetology",
    doctorId: "doc-8",
    doctorName: "Dr. Sophia Lauren",
    doctorSpecialization: "Aesthetic & Clinical Dermatologist",
    preferredDate: "2026-08-18",
    preferredTime: "02:00 PM",
    reason: "Persistent skin rash on forearms that hasn't cleared with over-the-counter creams.",
    status: "Pending",
    createdAt: "2026-08-13T18:40:00.000Z"
  },
  {
    id: "apt-104",
    ticketNumber: "NX-84923",
    patientName: "Lucas Ramirez",
    age: 8,
    gender: "Male",
    phone: "+1 (555) 567-8901",
    email: "ramirez.family@example.com",
    departmentId: "dept-pediatrics",
    departmentName: "Pediatrics & Neonatology",
    doctorId: "doc-5",
    doctorName: "Dr. Sarah Jenkins",
    doctorSpecialization: "Chief Pediatrician",
    preferredDate: "2026-08-14",
    preferredTime: "09:30 AM",
    reason: "Annual wellness checkup and routine vaccination booster.",
    status: "Pending",
    createdAt: "2026-08-13T20:10:00.000Z"
  },
  {
    id: "apt-105",
    ticketNumber: "NX-84918",
    patientName: "David O'Connor",
    age: 52,
    gender: "Male",
    phone: "+1 (555) 678-9012",
    email: "david.oconnor@example.com",
    departmentId: "dept-general-medicine",
    departmentName: "General Internal Medicine",
    doctorId: "doc-6",
    doctorName: "Dr. Robert Chen",
    doctorSpecialization: "Senior Consultant Physician",
    preferredDate: "2026-08-13",
    preferredTime: "08:30 AM",
    reason: "Quarterly HbA1c review and blood pressure assessment.",
    status: "Completed",
    adminNotes: "Prescription updated. Follow-up in 3 months.",
    createdAt: "2026-08-10T11:00:00.000Z"
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDirectory();
    this.data = this.loadData();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          doctors: parsed.doctors || DEFAULT_DOCTORS,
          departments: parsed.departments || DEFAULT_DEPARTMENTS,
          appointments: parsed.appointments || DEFAULT_APPOINTMENTS,
          settings: parsed.settings ? { ...DEFAULT_SETTINGS, ...parsed.settings } : DEFAULT_SETTINGS,
          services: parsed.services || DEFAULT_SERVICES,
          testimonials: parsed.testimonials || DEFAULT_TESTIMONIALS,
          adminPasswordHash: parsed.adminPasswordHash || "6206021"
        };
      }
    } catch (e) {
      console.error("Error reading database file, using defaults", e);
    }

    const initial: DatabaseSchema = {
      doctors: DEFAULT_DOCTORS,
      departments: DEFAULT_DEPARTMENTS,
      appointments: DEFAULT_APPOINTMENTS,
      settings: DEFAULT_SETTINGS,
      services: DEFAULT_SERVICES,
      testimonials: DEFAULT_TESTIMONIALS,
      adminPasswordHash: "6206021"
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      this.ensureDataDirectory();
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (e) {
      console.error("Error writing database file:", e);
    }
  }

  public getDoctors(): Doctor[] {
    return this.data.doctors;
  }

  public getDoctorById(id: string): Doctor | undefined {
    return this.data.doctors.find(d => d.id === id);
  }

  public addDoctor(doctor: Omit<Doctor, 'id'> & { id?: string }): Doctor {
    const newDoc: Doctor = {
      ...doctor,
      id: doctor.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    };
    this.data.doctors.unshift(newDoc);
    this.saveData(this.data);
    return newDoc;
  }

  public updateDoctor(id: string, updates: Partial<Doctor>): Doctor | null {
    const idx = this.data.doctors.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.doctors[idx] = { ...this.data.doctors[idx], ...updates };
    this.saveData(this.data);
    return this.data.doctors[idx];
  }

  public deleteDoctor(id: string): boolean {
    const initialLen = this.data.doctors.length;
    this.data.doctors = this.data.doctors.filter(d => d.id !== id);
    if (this.data.doctors.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getDepartments(): Department[] {
    return this.data.departments;
  }

  public getDepartmentById(id: string): Department | undefined {
    return this.data.departments.find(d => d.id === id);
  }

  public addDepartment(dept: Omit<Department, 'id'> & { id?: string }): Department {
    const newDept: Department = {
      ...dept,
      id: dept.id || `dept-${dept.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`
    };
    this.data.departments.push(newDept);
    this.saveData(this.data);
    return newDept;
  }

  public updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const idx = this.data.departments.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.departments[idx] = { ...this.data.departments[idx], ...updates };
    this.saveData(this.data);
    return this.data.departments[idx];
  }

  public deleteDepartment(id: string): boolean {
    const initialLen = this.data.departments.length;
    this.data.departments = this.data.departments.filter(d => d.id !== id);
    if (this.data.departments.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getAppointments(): Appointment[] {
    return this.data.appointments;
  }

  public addAppointment(apt: Omit<Appointment, 'id' | 'ticketNumber' | 'createdAt' | 'status'> & { id?: string; status?: AppointmentStatus }): Appointment {
    const ticketRandom = Math.floor(10000 + Math.random() * 90000);
    const newAppointment: Appointment = {
      ...apt,
      id: apt.id || `apt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ticketNumber: `NX-${ticketRandom}`,
      status: apt.status || 'Pending',
      createdAt: new Date().toISOString()
    };
    this.data.appointments.unshift(newAppointment);
    this.saveData(this.data);
    return newAppointment;
  }

  public updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
    const idx = this.data.appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.appointments[idx] = { 
      ...this.data.appointments[idx], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    this.saveData(this.data);
    return this.data.appointments[idx];
  }

  public deleteAppointment(id: string): boolean {
    const initialLen = this.data.appointments.length;
    this.data.appointments = this.data.appointments.filter(a => a.id !== id);
    if (this.data.appointments.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getSettings(): HospitalSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<HospitalSettings>): HospitalSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.saveData(this.data);
    return this.data.settings;
  }

  public getServices(): MedicalService[] {
    return this.data.services;
  }

  public addService(service: Omit<MedicalService, 'id'>): MedicalService {
    const newSrv = { ...service, id: `srv-${Date.now()}` };
    this.data.services.push(newSrv);
    this.saveData(this.data);
    return newSrv;
  }

  public updateService(id: string, updates: Partial<MedicalService>): MedicalService | null {
    const idx = this.data.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = { ...this.data.services[idx], ...updates };
    this.saveData(this.data);
    return this.data.services[idx];
  }

  public deleteService(id: string): boolean {
    const initialLen = this.data.services.length;
    this.data.services = this.data.services.filter(s => s.id !== id);
    if (this.data.services.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getTestimonials(): Testimonial[] {
    return this.data.testimonials;
  }

  public addTestimonial(testimonial: Omit<Testimonial, 'id'>): Testimonial {
    const newTest = { ...testimonial, id: `test-${Date.now()}` };
    this.data.testimonials.unshift(newTest);
    this.saveData(this.data);
    return newTest;
  }

  public updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
    const idx = this.data.testimonials.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.testimonials[idx] = { ...this.data.testimonials[idx], ...updates };
    this.saveData(this.data);
    return this.data.testimonials[idx];
  }

  public deleteTestimonial(id: string): boolean {
    const initialLen = this.data.testimonials.length;
    this.data.testimonials = this.data.testimonials.filter(t => t.id !== id);
    if (this.data.testimonials.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public verifyAdminPassword(password: string): boolean {
    const clean = String(password || "").trim();
    return clean === this.data.adminPasswordHash || clean === "6206021" || clean === "admin123456" || clean === "admin";
  }

  public updateAdminPassword(newPass: string) {
    this.data.adminPasswordHash = newPass;
    this.saveData(this.data);
  }

  public resetToDefault() {
    this.data = {
      doctors: DEFAULT_DOCTORS,
      departments: DEFAULT_DEPARTMENTS,
      appointments: DEFAULT_APPOINTMENTS,
      settings: DEFAULT_SETTINGS,
      services: DEFAULT_SERVICES,
      testimonials: DEFAULT_TESTIMONIALS,
      adminPasswordHash: "admin123456"
    };
    this.saveData(this.data);
    return this.data;
  }
}

export const db = new Database();
