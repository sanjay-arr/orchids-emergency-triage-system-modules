"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { 
  PatientInfo, 
  EmergencyCategory, 
  CasePriority, 
  ArrivalMode,
  QuestionResponse
} from "@/lib/emergency-types";
import { 
  FileText, 
  Activity, 
  History, 
  AlertCircle, 
  Stethoscope, 
  HeartPulse, 
  ClipboardCheck, 
  UserCheck,
  Download,
  X,
  Printer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MedicalFormsProps {
  caseId: string;
  patient: PatientInfo;
  category: EmergencyCategory;
  priority: CasePriority;
  arrivalMode: ArrivalMode;
  hospitalName: string;
  ward: string;
  arrivalTime: Date;
  responses: QuestionResponse[];
  isDark: boolean;
}

type FormType = "registration" | "triage" | "history" | "allergy" | "category" | "vitals" | "summary" | "consent";

interface FormIcon {
  id: FormType;
  label: string;
  icon: React.ElementType;
  color: string;
}

const FORM_ICONS: FormIcon[] = [
  { id: "registration", label: "Registration", icon: UserCheck, color: "bg-blue-500" },
  { id: "triage", label: "Triage", icon: Activity, color: "bg-amber-500" },
  { id: "history", label: "Medical History", icon: History, color: "bg-purple-500" },
  { id: "allergy", label: "Allergy & Meds", icon: AlertCircle, color: "bg-red-500" },
  { id: "category", label: "Category Form", icon: Stethoscope, color: "bg-teal-500" },
  { id: "vitals", label: "Vital Signs", icon: HeartPulse, color: "bg-pink-500" },
  { id: "summary", label: "Doctor Summary", icon: FileText, color: "bg-emerald-500" },
  { id: "consent", label: "Consent Form", icon: ClipboardCheck, color: "bg-indigo-500" },
];

export function MedicalForms(props: MedicalFormsProps) {
  const {
    caseId,
    patient,
    category,
    priority,
    arrivalMode,
    hospitalName,
    ward,
    arrivalTime,
    responses,
    isDark
  } = props;

  const [activeForm, setActiveForm] = useState<FormType | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const containerBg = isDark ? "bg-slate-900" : "bg-white";
  const textColor = isDark ? "text-slate-200" : "text-slate-800";
  const borderColor = isDark ? "border-slate-700" : "border-slate-300";
  const currentDate = arrivalTime.toLocaleDateString("en-GB");
  const currentTime = arrivalTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.beginPath();
    }
  };

  const generateRegistrationPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 0;

    // ===== HEADER SECTION =====
    // Top gradient bar
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 45, "F");
    
    // Red accent line
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 45, pageWidth, 3, "F");

    // Hospital Logo placeholder (circle)
    doc.setFillColor(59, 130, 246);
    doc.circle(25, 22, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("+", 22, 26);

    // Hospital Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(hospitalName || "City Emergency Hospital", 42, 18);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("Emergency Department | 24x7 Critical Care Services", 42, 26);
    doc.text("Contact: 1800-XXX-XXXX | Fax: XXX-XXX-XXXX", 42, 32);
    doc.text("emergency@hospital.com | www.hospital.com", 42, 38);

    // Form Title on right
    doc.setTextColor(248, 113, 113);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("EMERGENCY REGISTRATION FORM", pageWidth - 15, 18, { align: "right" });
    
    // Case ID Badge
    doc.setFillColor(220, 38, 38);
    doc.roundedRect(pageWidth - 70, 22, 55, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("CASE ID: " + caseId, pageWidth - 42.5, 28.5, { align: "center" });

    // Date Time Location
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Date: " + currentDate + " | Time: " + currentTime, pageWidth - 15, 38, { align: "right" });
    doc.text("Location: " + (ward || "ER Unit 1"), pageWidth - 15, 43, { align: "right" });

    y = 58;

    // ===== PATIENT DETAILS SECTION =====
    // Section Header with icon
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(10, y, pageWidth - 20, 10, 2, 2, "F");
    doc.setFillColor(59, 130, 246);
    doc.circle(18, y + 5, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.text("P", 16.5, y + 6.5);
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT DETAILS", 25, y + 7);
    y += 16;

    // Patient info grid
    const addField = (label: string, value: string, x: number, yPos: number, width: number) => {
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(label.toUpperCase(), x, yPos);
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(value || "_______________", x, yPos + 6);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(x, yPos + 8, x + width, yPos + 8);
    };

    addField("Full Name", patient.name, 15, y, 85);
    addField("Age", patient.age ? patient.age + " Years" : "", 105, y, 30);
    addField("Gender", patient.gender || "", 145, y, 45);
    y += 18;

    addField("Blood Group", "", 15, y, 40);
    // Blood group checkbox
    doc.setDrawColor(100, 116, 139);
    doc.rect(60, y + 2, 4, 4);
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Unknown", 66, y + 5);
    
    addField("Phone Number", patient.phone || "", 105, y, 85);
    y += 18;

    addField("Address (Short)", "", 15, y, 175);
    y += 18;

    addField("Identity Proof", "", 15, y, 80);
    doc.rect(100, y + 2, 4, 4);
    doc.text("Not Available", 106, y + 5);
    y += 22;

    // ===== EMERGENCY CONTACT SECTION =====
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(10, y, pageWidth - 20, 10, 2, 2, "F");
    doc.setFillColor(239, 68, 68);
    doc.circle(18, y + 5, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.text("!", 16.8, y + 6.5);
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("EMERGENCY CONTACT", 25, y + 7);
    y += 16;

    addField("Contact Person Name", "", 15, y, 80);
    addField("Relationship", "", 105, y, 40);
    addField("Phone Number", "", 155, y, 35);
    y += 22;

    // ===== ARRIVAL INFO SECTION =====
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(10, y, pageWidth - 20, 10, 2, 2, "F");
    doc.setFillColor(34, 197, 94);
    doc.circle(18, y + 5, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.text("A", 16.3, y + 6.5);
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("ARRIVAL INFORMATION", 25, y + 7);
    y += 16;

    // Arrival Mode checkboxes
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("ARRIVAL MODE", 15, y);
    y += 6;

    const arrivalModes = ["Walk-in", "Ambulance", "Police Vehicle", "Private Vehicle", "Other"];
    arrivalModes.forEach((mode, i) => {
      const x = 15 + (i * 36);
      doc.setDrawColor(100, 116, 139);
      doc.rect(x, y, 4, 4);
      if (arrivalMode.toLowerCase().includes(mode.toLowerCase().split(" ")[0].toLowerCase()) || 
          (mode === "Walk-in" && arrivalMode === "walk_in") ||
          (mode === "Ambulance" && arrivalMode === "ambulance")) {
        doc.setFillColor(59, 130, 246);
        doc.rect(x + 0.5, y + 0.5, 3, 3, "F");
      }
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8);
      doc.text(mode, x + 6, y + 3);
    });
    y += 12;

    // Brought By
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    doc.text("BROUGHT BY", 15, y);
    y += 6;

    const broughtBy = ["Self", "Family", "Police", "Bystander", "Others"];
    broughtBy.forEach((by, i) => {
      const x = 15 + (i * 36);
      doc.setDrawColor(100, 116, 139);
      doc.rect(x, y, 4, 4);
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8);
      doc.text(by, x + 6, y + 3);
    });
    y += 12;

    addField("Ambulance Number (if applicable)", "", 15, y, 85);
    addField("Arrival Time", currentTime, 115, y, 75);
    y += 22;

    // ===== FOOTER SECTION =====
    // Separator line
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(10, y, pageWidth - 10, y);
    y += 8;

    // Signature boxes
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    // Left signature
    doc.setDrawColor(203, 213, 225);
    doc.rect(15, y, 80, 25);
    doc.text("Patient / Caregiver Signature", 55, y + 30, { align: "center" });

    // Right signature
    doc.rect(110, y, 80, 25);
    doc.text("Registration Staff / Nurse", 150, y + 30, { align: "center" });

    y += 40;

    // Footer bar
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 270, pageWidth, 27, "F");
    
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(15, 274, 40, 6, 1, 1, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("AI FORM AUTOMATION", 35, 278, { align: "center" });

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Generated by: MedEmergency AI System", 15, 286);
    doc.text("This is a computer-generated document. No signature required for digital copy.", 15, 291);
    
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(6);
    doc.text("Document ID: " + caseId + "-REG | Generated: " + new Date().toISOString(), pageWidth - 15, 291, { align: "right" });

    doc.save("registration-" + caseId + ".pdf");
  };

  const generatePDF = (formType: FormType) => {
    if (formType === "registration") {
      generateRegistrationPDF();
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(hospitalName || "Emergency Hospital", 15, 15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Emergency Department | 24x7 Services", 15, 22);
    doc.text("Contact: 1800-XXX-XXXX | emergency@hospital.com", 15, 28);

    // Title
    const formTitles: Record<FormType, string> = {
      registration: "PATIENT REGISTRATION FORM",
      triage: "TRIAGE ASSESSMENT FORM",
      history: "MEDICAL HISTORY FORM",
      allergy: "ALLERGY & MEDICATION FORM",
      category: category.replace("_", " ").toUpperCase() + " FORM",
      vitals: "VITAL SIGNS RECORD",
      summary: "DOCTOR CASE SUMMARY",
      consent: "CONSENT FOR EMERGENCY TREATMENT"
    };

    doc.setTextColor(220, 38, 38);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(formTitles[formType], pageWidth - 15, 15, { align: "right" });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("Case ID: " + caseId, pageWidth - 15, 22, { align: "right" });
    doc.text("Date: " + currentDate, pageWidth - 15, 28, { align: "right" });

    yPos = 45;

    // Patient Info Section
    doc.setFillColor(219, 234, 254);
    doc.rect(10, yPos, pageWidth - 20, 8, "F");
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT INFORMATION", 15, yPos + 6);
    yPos += 14;

    // Patient details
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("PATIENT NAME", 15, yPos);
    doc.text("AGE", 80, yPos);
    doc.text("CASE ID", 130, yPos);
    yPos += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, 70, yPos);
    doc.line(80, yPos, 120, yPos);
    doc.line(130, yPos, 190, yPos);
    yPos += 6;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(patient.name || "N/A", 15, yPos);
    doc.text((patient.age || "N/A") + " years", 80, yPos);
    doc.text(caseId, 130, yPos);
    yPos += 15;

    if (formType === "triage") {
      doc.setFillColor(219, 234, 254);
      doc.rect(10, yPos, pageWidth - 20, 8, "F");
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("CHIEF COMPLAINT", 15, yPos + 6);
      yPos += 14;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(category.replace("_", " ").toUpperCase(), 15, yPos + 5);
      yPos += 15;

      doc.setFillColor(219, 234, 254);
      doc.rect(10, yPos, pageWidth - 20, 8, "F");
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("TRIAGE CLASSIFICATION", 15, yPos + 6);
      yPos += 14;

      const triageColors: Array<{ label: string; color: [number, number, number] }> = [
        { label: "Critical (Red)", color: [220, 38, 38] },
        { label: "Urgent (Orange)", color: [245, 158, 11] },
        { label: "Standard (Yellow)", color: [234, 179, 8] },
        { label: "Non-Urgent (Green)", color: [34, 197, 94] }
      ];
      triageColors.forEach((t, i) => {
        const x = 15 + (i % 2) * 90;
        if (i === 2) yPos += 10;
        doc.setFillColor(t.color[0], t.color[1], t.color[2]);
        doc.rect(x, yPos - 3, 4, 4, "F");
        const isSelected = (priority === "critical" && i === 0) || 
                          (priority === "urgent" && i === 1) || 
                          (priority === "standard" && i === 2);
        if (isSelected) {
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.5);
          doc.circle(x + 2, yPos - 1, 4);
        }
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text(t.label, x + 7, yPos);
      });
    }

    if (formType === "allergy") {
      doc.setFillColor(254, 226, 226);
      doc.rect(10, yPos, pageWidth - 20, 8, "F");
      doc.setTextColor(185, 28, 28);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("KNOWN ALLERGIES", 15, yPos + 6);
      yPos += 14;

      doc.setDrawColor(100, 100, 100);
      doc.rect(15, yPos - 3, 4, 4);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("Drug Allergies: _______________", 22, yPos);
      yPos += 8;
      doc.rect(15, yPos - 3, 4, 4);
      doc.text("Food Allergies: _______________", 22, yPos);
      yPos += 8;
      doc.setFillColor(34, 197, 94);
      doc.rect(15.5, yPos - 2.5, 3, 3, "F");
      doc.rect(15, yPos - 3, 4, 4);
      doc.text("No Known Allergies (NKDA)", 22, yPos);
      yPos += 15;

      doc.setFillColor(219, 234, 254);
      doc.rect(10, yPos, pageWidth - 20, 8, "F");
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("CURRENT MEDICATIONS", 15, yPos + 6);
      yPos += 14;

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text("MEDICATION NAME", 15, yPos);
      doc.text("DOSAGE", 80, yPos);
      doc.text("FREQUENCY", 130, yPos);
      yPos += 3;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, yPos, 190, yPos);
    }

    if (formType === "vitals") {
      doc.setFillColor(219, 234, 254);
      doc.rect(10, yPos, pageWidth - 20, 8, "F");
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("VITAL SIGNS", 15, yPos + 6);
      yPos += 14;

      const vitals = [
        ["Blood Pressure", "_____ / _____ mmHg"],
        ["Pulse Rate", "_____ bpm"],
        ["Temperature", "_____ F / C"],
        ["SpO2", "_____ %"],
        ["Respiratory Rate", "_____ /min"],
        ["Blood Sugar", "_____ mg/dL"]
      ];

      vitals.forEach((vital, i) => {
        const x = 15 + (i % 2) * 90;
        if (i > 0 && i % 2 === 0) yPos += 15;
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text(vital[0].toUpperCase(), x, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(vital[1], x, yPos + 6);
      });
    }

    if (formType === "consent") {
      doc.setFillColor(219, 234, 254);
      doc.rect(10, yPos, pageWidth - 20, 8, "F");
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("CONSENT DECLARATION", 15, yPos + 6);
      yPos += 14;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const consentText = "I, the undersigned, hereby authorize the emergency medical staff at " + 
        (hospitalName || "this hospital") + " to perform such diagnostic procedures and medical treatment " +
        "as may be deemed necessary for the health and safety of " + patient.name + ".";
      const lines = doc.splitTextToSize(consentText, pageWidth - 30);
      doc.text(lines, 15, yPos);
      yPos += lines.length * 5 + 15;

      doc.setFillColor(219, 234, 254);
      doc.rect(10, yPos, pageWidth - 20, 8, "F");
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("AUTHORIZATION", 15, yPos + 6);
      yPos += 14;

      doc.setFillColor(30, 136, 229);
      doc.rect(15.5, yPos - 2.5, 3, 3, "F");
      doc.setDrawColor(100, 100, 100);
      doc.rect(15, yPos - 3, 4, 4);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("I consent to emergency treatment", 22, yPos);
      yPos += 8;
      doc.rect(15, yPos - 3, 4, 4);
      doc.text("I consent to blood transfusion if required", 22, yPos);
      yPos += 8;
      doc.rect(15, yPos - 3, 4, 4);
      doc.text("I consent to surgical intervention if required", 22, yPos);
    }

    // Signature lines at bottom
    yPos = 250;
    doc.setDrawColor(150, 150, 150);
    doc.line(15, yPos, 85, yPos);
    doc.line(110, yPos, 190, yPos);
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Patient/Caregiver Signature", 15, yPos + 5);
    doc.text("Staff Signature & Date", 110, yPos + 5);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const footerText = "Generated: " + new Date().toLocaleString() + " | " + (hospitalName || "Emergency Hospital") + " | Confidential Medical Record";
    doc.text(footerText, pageWidth / 2, 285, { align: "center" });

    doc.save(formType + "-form-" + caseId + ".pdf");
  };

  const getFormTitle = (formType: FormType): string => {
    const titles: Record<FormType, string> = {
      registration: "Patient Registration Form",
      triage: "Triage Assessment Form",
      history: "Medical History Form",
      allergy: "Allergy & Medication Form",
      category: category.replace("_", " ") + " Assessment Form",
      vitals: "Vital Signs Record",
      summary: "Doctor Case Summary",
      consent: "Consent for Emergency Treatment"
    };
    return titles[formType];
  };

  return (
    <div className={`mt-8 p-6 rounded-2xl border ${borderColor} ${containerBg}`}>
      <h3 className={`text-xl font-bold mb-6 ${textColor}`}>Medical Forms</h3>
      <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        Click on any form icon to preview and download as PDF
      </p>
      
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {FORM_ICONS.map((form) => {
          const Icon = form.icon;
          return (
            <motion.button
              key={form.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveForm(form.id)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:shadow-lg group"
            >
              <div className={`w-14 h-14 rounded-xl ${form.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <span className={`text-xs font-medium text-center leading-tight ${textColor}`}>
                {form.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveForm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{getFormTitle(activeForm)}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {caseId}
                      </span>
                      <span className="text-slate-400 text-sm">{currentDate} | {currentTime}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveForm(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">+</div>
                      <div>
                        <h3 className="font-bold text-slate-800">{hospitalName || "Emergency Hospital"}</h3>
                        <p className="text-xs text-slate-500">Emergency Department | 24x7 Services</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Location: {ward || "ER Unit 1"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <h4 className="text-xs font-bold text-blue-800 uppercase mb-2 flex items-center gap-2">
                        <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">P</span>
                        Patient Information
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500 text-xs block">Full Name</span>
                          <p className="font-semibold text-slate-800">{patient.name}</p>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">Age</span>
                          <p className="font-semibold text-slate-800">{patient.age || "N/A"} years</p>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">Gender</span>
                          <p className="font-semibold text-slate-800">{patient.gender || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {activeForm === "registration" && (
                      <>
                        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                          <h4 className="text-xs font-bold text-red-800 uppercase mb-2 flex items-center gap-2">
                            <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                            Emergency Contact
                          </h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500 text-xs block">Contact Person</span>
                              <p className="font-semibold text-slate-800">_______________</p>
                            </div>
                            <div>
                              <span className="text-slate-500 text-xs block">Relationship</span>
                              <p className="font-semibold text-slate-800">_______________</p>
                            </div>
                            <div>
                              <span className="text-slate-500 text-xs block">Phone</span>
                              <p className="font-semibold text-slate-800">_______________</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                          <h4 className="text-xs font-bold text-green-800 uppercase mb-2 flex items-center gap-2">
                            <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">A</span>
                            Arrival Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500 text-xs block">Arrival Mode</span>
                              <p className="font-semibold text-slate-800">{arrivalMode.replace("_", " ").toUpperCase()}</p>
                            </div>
                            <div>
                              <span className="text-slate-500 text-xs block">Time</span>
                              <p className="font-semibold text-slate-800">{currentTime}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {activeForm === "consent" && (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          I, the undersigned, hereby authorize the emergency medical staff at <strong>{hospitalName || "this hospital"}</strong> to perform such diagnostic procedures and medical treatment as may be deemed necessary for the health and safety of <strong>{patient.name}</strong>.
                        </p>
                        <div className="bg-slate-100 rounded-lg p-4">
                          <h4 className="text-xs font-bold text-slate-600 uppercase mb-3">Digital Signature</h4>
                          <canvas
                            ref={canvasRef}
                            width={400}
                            height={150}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-32 bg-white border-2 border-dashed border-slate-300 rounded-lg cursor-crosshair"
                          />
                          <button
                            onClick={clearSignature}
                            className="mt-2 text-xs text-slate-500 hover:text-slate-700"
                          >
                            Clear Signature
                          </button>
                        </div>
                      </div>
                    )}

                    {activeForm !== "consent" && activeForm !== "registration" && (
                      <div className="text-center py-8 text-slate-400">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Click download to generate the complete PDF form</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                <Button
                  onClick={() => generatePDF(activeForm)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => generatePDF(activeForm)}
                  variant="outline"
                  className="border-slate-300"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
