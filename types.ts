
export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  // Patient specific
  medicalHistory?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  // Doctor specific
  specialization?: string;
  clinicAddress?: string;
  availabilityHours?: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  type: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'message' | 'system';
  read: boolean;
  timestamp: string;
}
