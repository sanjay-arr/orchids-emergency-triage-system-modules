export type PatientType = 'patient' | 'caregiver' | 'staff';

export type EmergencyCategory = 
  | 'accident'
  | 'chest_pain'
  | 'fever'
  | 'injury'
  | 'breathing'
  | 'stroke'
  | 'poisoning'
  | 'burn'
  | 'other';

export type CasePriority = 'normal' | 'urgent' | 'critical';

export type ArrivalMode = 'walk_in' | 'ambulance' | 'transfer' | 'police';

export type Gender = 'male' | 'female' | 'other';

export type Language = 'en' | 'ta' | 'hi';

export interface EmergencyCase {
  id: string;
  createdAt: Date;
  patientType: PatientType;
  category: EmergencyCategory;
  priority: CasePriority;
  arrivalMode: ArrivalMode;
  patient: PatientInfo;
  hospital: HospitalInfo;
  responses: QuestionResponse[];
  status: 'intake' | 'questioning' | 'completed';
}

export interface PatientInfo {
  name: string;
  age: number | null;
  gender: Gender | null;
  phone?: string;
  address?: string;
  bloodGroup?: string;
  allergies?: string[];
  medications?: string[];
  medicalHistory?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  arrivalMode?: string;
  broughtBy?: string;
}

export interface HospitalInfo {
  name: string;
  ward: string;
  arrivalTime: Date;
}

export interface QuestionResponse {
  questionId: string;
  question: string;
  answer: string;
  answeredVia: 'voice' | 'text';
  timestamp: Date;
}

export interface EmergencyQuestion {
  id: string;
  text: string;
  category: EmergencyCategory | 'common';
  priority: number;
  type: 'yes_no' | 'text' | 'select' | 'multiple';
  options?: string[];
  followUp?: {
    condition: string;
    questionId: string;
  };
  required: boolean;
  criticalFlag?: boolean;
}

export const EMERGENCY_CATEGORIES: { value: EmergencyCategory; label: string; icon: string }[] = [
  { value: 'accident', label: 'Accident', icon: '🚗' },
  { value: 'chest_pain', label: 'Chest Pain', icon: '❤️' },
  { value: 'fever', label: 'Fever', icon: '🤒' },
  { value: 'injury', label: 'Injury', icon: '🩹' },
  { value: 'breathing', label: 'Breathing Issue', icon: '🫁' },
  { value: 'stroke', label: 'Stroke', icon: '🧠' },
  { value: 'poisoning', label: 'Poisoning', icon: '☠️' },
  { value: 'burn', label: 'Burn', icon: '🔥' },
  { value: 'other', label: 'Other', icon: '🏥' },
];

export const PATIENT_TYPES: { value: PatientType; label: string; icon: string }[] = [
  { value: 'patient', label: 'Patient', icon: '🧑' },
  { value: 'caregiver', label: 'Caregiver/Family', icon: '👨‍👩‍👦' },
  { value: 'staff', label: 'Hospital Staff', icon: '👨‍⚕️' },
];

export const ARRIVAL_MODES: { value: ArrivalMode; label: string; icon: string }[] = [
  { value: 'walk_in', label: 'Walk-in', icon: '🚶' },
  { value: 'ambulance', label: 'Ambulance', icon: '🚑' },
  { value: 'transfer', label: 'Hospital Transfer', icon: '🏥' },
  { value: 'police', label: 'Police/Emergency', icon: '🚔' },
];

export const LANGUAGES: { value: Language; label: string; native: string }[] = [
  { value: 'en', label: 'English', native: 'English' },
  { value: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { value: 'hi', label: 'Hindi', native: 'हिन्दी' },
];

export const PRIORITY_CONFIG: Record<CasePriority, { color: string; bgColor: string; label: string }> = {
  normal: { color: 'text-emerald-600', bgColor: 'bg-emerald-500', label: 'Normal' },
  urgent: { color: 'text-amber-600', bgColor: 'bg-amber-500', label: 'Urgent' },
  critical: { color: 'text-red-600', bgColor: 'bg-red-500', label: 'Critical' },
};

export function generateCaseId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ER-${timestamp}-${random}`;
}

export function determinePriority(category: EmergencyCategory, arrivalMode: ArrivalMode): CasePriority {
  if (arrivalMode === 'ambulance' || arrivalMode === 'police') {
    return 'critical';
  }
  if (['chest_pain', 'stroke', 'breathing', 'poisoning'].includes(category)) {
    return 'critical';
  }
  if (['accident', 'burn', 'injury'].includes(category)) {
    return 'urgent';
  }
  return 'normal';
}
