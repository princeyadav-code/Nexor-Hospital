import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { UserProfile, Appointment, Doctor } from './types';

export const firebaseConfig = {
  apiKey: "AIzaSyAyo7XR0aLgXnIORHXz2-LV2QVMKmHc-c4",
  authDomain: "nexora-hospital.firebaseapp.com",
  projectId: "nexora-hospital",
  storageBucket: "nexora-hospital.firebasestorage.app",
  messagingSenderId: "518951745969",
  appId: "1:518951745969:web:216566ffd09dba339ce590"
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

// User Document Operations
export async function syncUserProfile(
  user: FirebaseUser,
  additionalData?: Partial<UserProfile>
): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        name: additionalData?.name || user.displayName || 'Patient',
        email: user.email || '',
        phone: additionalData?.phone || user.phoneNumber || '',
        age: additionalData?.age || 30,
        gender: additionalData?.gender || 'Male',
        bloodGroup: additionalData?.bloodGroup || 'O+',
        address: additionalData?.address || '',
        emergencyContact: additionalData?.emergencyContact || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      const existingData = userSnap.data() as UserProfile;
      if (additionalData && Object.keys(additionalData).length > 0) {
        const updated: UserProfile = {
          ...existingData,
          ...additionalData,
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, updated, { merge: true });
        return updated;
      }
      return existingData;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    // Return fallback local profile so UI never breaks
    return {
      uid: user.uid,
      name: additionalData?.name || user.displayName || 'Patient',
      email: user.email || '',
      phone: additionalData?.phone || '',
      age: additionalData?.age || 30,
      gender: additionalData?.gender || 'Male',
      bloodGroup: additionalData?.bloodGroup || 'O+',
      address: additionalData?.address || '',
      emergencyContact: additionalData?.emergencyContact || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}`);
    return null;
  }
}

// Appointment Operations in Firestore
export async function saveAppointmentToFirestore(appointment: Appointment): Promise<boolean> {
  try {
    const aptRef = doc(db, 'appointments', appointment.id);
    await setDoc(aptRef, {
      ...appointment,
      firestoreTimestamp: serverTimestamp(),
    });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `appointments/${appointment.id}`);
    return false;
  }
}

export async function fetchUserAppointmentsFromFirestore(userId: string): Promise<Appointment[]> {
  try {
    const aptsRef = collection(db, 'appointments');
    const q = query(aptsRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    const results: Appointment[] = [];
    snap.forEach((d) => {
      results.push(d.data() as Appointment);
    });
    return results;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'appointments');
    return [];
  }
}

// Doctor & Clinical Specialist Operations in Firestore
export async function saveDoctorToFirestore(doctor: Doctor): Promise<Doctor> {
  const docId = doctor.id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const doctorToSave: Doctor = {
    ...doctor,
    id: docId,
    name: doctor.name || '',
    qualification: doctor.qualification || 'MBBS, MD',
    specialization: doctor.specialization || '',
    department: doctor.department || 'General',
    experience: Number(doctor.experience) || 5,
    biography: doctor.biography || '',
    consultationFee: Number(doctor.consultationFee) || 100,
    availableDays: Array.isArray(doctor.availableDays) && doctor.availableDays.length > 0 ? doctor.availableDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTime: doctor.availableTime || '09:00 AM - 02:00 PM',
    photoUrl: doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80',
    email: doctor.email || '',
    phone: doctor.phone || '',
    roomNumber: doctor.roomNumber || 'OPD Suite',
    status: doctor.status || 'Active',
    rating: doctor.rating ?? 5.0,
    reviewsCount: doctor.reviewsCount ?? 1,
    createdAt: doctor.createdAt || new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'doctors', docId);
    await setDoc(docRef, {
      ...doctorToSave,
      firestoreTimestamp: serverTimestamp(),
    }, { merge: true });
    return doctorToSave;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `doctors/${docId}`);
    throw err;
  }
}

export async function fetchDoctorsFromFirestore(): Promise<Doctor[]> {
  try {
    const colRef = collection(db, 'doctors');
    const snap = await getDocs(colRef);
    const results: Doctor[] = [];
    snap.forEach((d) => {
      const data = d.data() as Doctor;
      results.push({
        ...data,
        id: d.id || data.id,
      });
    });
    return results;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'doctors');
    return [];
  }
}

export async function updateDoctorInFirestore(id: string, updates: Partial<Doctor>): Promise<boolean> {
  try {
    const docRef = doc(db, 'doctors', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
      firestoreTimestamp: serverTimestamp(),
    });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `doctors/${id}`);
    return false;
  }
}

export async function deleteDoctorFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'doctors', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `doctors/${id}`);
    return false;
  }
}
