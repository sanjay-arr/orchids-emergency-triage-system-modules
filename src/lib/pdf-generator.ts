"use client";

import jsPDF from "jspdf";
import { QuestionResponse, PatientInfo, CasePriority, EmergencyCategory, EMERGENCY_CATEGORIES, PRIORITY_CONFIG } from "@/lib/emergency-types";

interface FormData {
  caseId: string;
  patient: PatientInfo;
  category: EmergencyCategory;
  priority: CasePriority;
  hospitalName: string;
  ward: string;
  arrivalTime: Date;
  responses: QuestionResponse[];
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const extractFromResponses = (responses: QuestionResponse[], keywords: string[]): string[] => {
  const results: string[] = [];
  responses.forEach((r) => {
    keywords.forEach((kw) => {
      if (r.question.toLowerCase().includes(kw.toLowerCase()) || r.questionId.toLowerCase().includes(kw.toLowerCase())) {
        if (r.answer && r.answer !== "No" && r.answer !== "None") {
          results.push(r.answer);
        }
      }
    });
  });
  return [...new Set(results)];
};

const addHeader = (doc: jsPDF, data: FormData, formTitle: string) => {
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, 210, 3, "F");
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(data.hospitalName, 15, 20);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Emergency Department | 24x7 Services", 15, 26);
  doc.text("Contact: 1800-XXX-XXXX | emergency@hospital.com", 15, 31);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 38, 38);
  doc.text(formTitle, 195, 20, { align: "right" });
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Case ID: ${data.caseId}`, 195, 26, { align: "right" });
  doc.text(`Date: ${formatDate(data.arrivalTime)}`, 195, 31, { align: "right" });
  
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(15, 36, 195, 36);
  
  return 45;
};

const addSectionHeader = (doc: jsPDF, title: string, y: number, color: [number, number, number] = [241, 245, 249]) => {
  doc.setFillColor(...color);
  doc.rect(15, y, 180, 8, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text(title.toUpperCase(), 18, y + 5.5);
  return y + 12;
};

const addField = (doc: jsPDF, label: string, value: string, x: number, y: number, width: number = 80) => {
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(label.toUpperCase(), x, y);
  
  doc.setFillColor(248, 250, 252);
  doc.rect(x, y + 2, width, 8, "F");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(value || "—", x + 2, y + 8);
  
  return y + 14;
};

const addPriorityBadge = (doc: jsPDF, priority: CasePriority, y: number) => {
  const colors: Record<CasePriority, [number, number, number]> = {
    critical: [254, 242, 242],
    urgent: [255, 251, 235],
    normal: [240, 253, 244],
  };
  const textColors: Record<CasePriority, [number, number, number]> = {
    critical: [220, 38, 38],
    urgent: [217, 119, 6],
    normal: [22, 163, 74],
  };
  
  doc.setFillColor(...colors[priority]);
  doc.roundedRect(15, y, 50, 10, 2, 2, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColors[priority]);
  doc.text(`PRIORITY: ${PRIORITY_CONFIG[priority].label.toUpperCase()}`, 18, y + 7);
  
  return y + 15;
};

const addFooter = (doc: jsPDF, caseId: string) => {
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(15, pageHeight - 15, 195, pageHeight - 15);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 15, pageHeight - 10);
  doc.text(`Case ID: ${caseId} | AI-Powered Emergency System`, 195, pageHeight - 10, { align: "right" });
};

const addSignatureBox = (doc: jsPDF, y: number) => {
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(15, y, 180, 25);
  
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  
  doc.line(20, y + 18, 85, y + 18);
  doc.text("Patient/Caregiver Signature", 20, y + 22);
  
  doc.line(110, y + 18, 175, y + 18);
  doc.text("Staff Signature & Date", 110, y + 22);
  
  return y + 30;
};

export const generateEmergencyIntakeForm = (data: FormData) => {
  const doc = new jsPDF();
  const categoryInfo = EMERGENCY_CATEGORIES.find((c) => c.value === data.category);
  
  let y = addHeader(doc, data, "EMERGENCY INTAKE FORM");
  y = addPriorityBadge(doc, data.priority, y);
  
  y = addSectionHeader(doc, "Patient Information", y);
  addField(doc, "Full Name", data.patient.name, 15, y, 85);
  addField(doc, "Age", `${data.patient.age || "—"} years`, 105, y, 40);
  addField(doc, "Gender", data.patient.gender || "—", 150, y, 45);
  y += 14;
  addField(doc, "Contact Number", data.patient.phone || "—", 15, y, 85);
  addField(doc, "Emergency Contact", "________________", 105, y, 90);
  y += 18;
  
  y = addSectionHeader(doc, "Emergency Details", y);
  addField(doc, "Emergency Type", `${categoryInfo?.icon || ""} ${categoryInfo?.label || data.category}`, 15, y, 85);
  addField(doc, "Arrival Time", formatTime(data.arrivalTime), 105, y, 90);
  y += 14;
  addField(doc, "Ward/Department", data.ward, 15, y, 85);
  addField(doc, "Mode of Arrival", data.priority === "critical" ? "Ambulance" : "Walk-in", 105, y, 90);
  y += 18;
  
  y = addSectionHeader(doc, "Initial Assessment (Voice Recorded)", y);
  data.responses.slice(0, 6).forEach((r) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(r.question, 15, y);
    y += 4;
    doc.setFillColor(248, 250, 252);
    doc.rect(15, y, 180, 8, "F");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`${r.answer} ${r.answeredVia === "voice" ? "(Voice)" : ""}`, 17, y + 6);
    y += 12;
  });
  
  y += 5;
  addSignatureBox(doc, y);
  addFooter(doc, data.caseId);
  
  return doc;
};

export const generateTriageAssessmentForm = (data: FormData) => {
  const doc = new jsPDF();
  const categoryInfo = EMERGENCY_CATEGORIES.find((c) => c.value === data.category);
  
  let y = addHeader(doc, data, "TRIAGE ASSESSMENT FORM");
  
  y = addSectionHeader(doc, "Patient Identification", y);
  addField(doc, "Name", data.patient.name, 15, y, 60);
  addField(doc, "Age/Gender", `${data.patient.age || "—"}y / ${data.patient.gender || "—"}`, 80, y, 55);
  addField(doc, "Triage Time", formatTime(data.arrivalTime), 140, y, 55);
  y += 18;
  
  y = addSectionHeader(doc, "Triage Category", y);
  ["critical", "urgent", "normal"].forEach((level, idx) => {
    const x = 15 + idx * 60;
    if (data.priority === level) {
      doc.setFillColor(220, 38, 38);
      doc.rect(x, y, 10, 5, "F");
    } else {
      doc.setDrawColor(100, 116, 139);
      doc.rect(x, y, 10, 5);
    }
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(level.charAt(0).toUpperCase() + level.slice(1), x + 14, y + 4);
  });
  y += 12;
  
  y = addSectionHeader(doc, "Chief Complaint", y);
  doc.setFillColor(248, 250, 252);
  doc.rect(15, y, 180, 12, "F");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(`${categoryInfo?.label}: ${data.responses[0]?.answer || "As per voice assessment"}`, 17, y + 8);
  y += 18;
  
  y = addSectionHeader(doc, "Vital Signs (To be filled by staff)", y);
  const vitals = [
    ["Blood Pressure", "____/____ mmHg"],
    ["Pulse Rate", "_______ /min"],
    ["Temperature", "_______°F"],
    ["SpO2", "_______%"],
    ["Respiratory Rate", "_______ /min"],
    ["GCS Score", "_______ /15"],
  ];
  vitals.forEach((v, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    addField(doc, v[0], v[1], 15 + col * 60, y + row * 14, 55);
  });
  y += 32;
  
  y = addSectionHeader(doc, "Presenting Symptoms (Voice Recorded)", y);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 90, 6, "F");
  doc.rect(105, y, 50, 6, "F");
  doc.rect(155, y, 40, 6, "F");
  doc.text("SYMPTOM/FINDING", 17, y + 4);
  doc.text("RESPONSE", 107, y + 4);
  doc.text("METHOD", 157, y + 4);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  data.responses.slice(0, 8).forEach((r) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(255, 255, 255);
    doc.rect(15, y, 90, 6, "F");
    doc.rect(105, y, 50, 6, "F");
    doc.rect(155, y, 40, 6, "F");
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8);
    const question = r.question.length > 45 ? r.question.substring(0, 45) + "..." : r.question;
    doc.text(question, 17, y + 4);
    doc.text(r.answer.substring(0, 25), 107, y + 4);
    doc.text(r.answeredVia, 157, y + 4);
    y += 7;
  });
  
  y += 10;
  addSignatureBox(doc, y);
  addFooter(doc, data.caseId);
  
  return doc;
};

export const generateAllergyMedicationForm = (data: FormData) => {
  const doc = new jsPDF();
  const allergies = extractFromResponses(data.responses, ["allerg", "reaction"]);
  const medications = extractFromResponses(data.responses, ["medic", "drug", "taking", "prescription"]);
  const conditions = extractFromResponses(data.responses, ["diabetes", "bp", "heart", "condition", "history", "disease"]);
  
  let y = addHeader(doc, data, "ALLERGY & MEDICATION FORM");
  
  if (allergies.length > 0) {
    doc.setFillColor(254, 242, 242);
    doc.rect(15, y, 180, 12, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38);
    doc.text(`⚠ ALLERGY ALERT: ${allergies.join(", ")}`, 18, y + 8);
    y += 18;
  }
  
  y = addSectionHeader(doc, "Patient Information", y);
  addField(doc, "Patient Name", data.patient.name, 15, y, 85);
  addField(doc, "Age", `${data.patient.age || "—"} years`, 105, y, 40);
  addField(doc, "Case ID", data.caseId, 150, y, 45);
  y += 18;
  
  y = addSectionHeader(doc, "Known Allergies", y, [254, 242, 242]);
  if (allergies.length > 0) {
    allergies.forEach((a) => {
      doc.setFillColor(220, 38, 38);
      doc.rect(17, y + 1, 4, 4, "F");
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(a, 24, y + 4);
      y += 8;
    });
  } else {
    const allergyTypes = ["Drug Allergies: _______________", "Food Allergies: _______________", "No Known Allergies (NKDA)"];
    allergyTypes.forEach((a, idx) => {
      doc.setDrawColor(100, 116, 139);
      doc.rect(17, y + 1, 4, 4);
      if (idx === 2) {
        doc.setFillColor(22, 163, 74);
        doc.rect(17, y + 1, 4, 4, "F");
      }
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(a, 24, y + 4);
      y += 8;
    });
  }
  y += 5;
  
  y = addSectionHeader(doc, "Current Medications", y);
  if (medications.length > 0) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, 90, 6, "F");
    doc.rect(105, y, 45, 6, "F");
    doc.rect(150, y, 45, 6, "F");
    doc.setTextColor(71, 85, 105);
    doc.text("MEDICATION NAME", 17, y + 4);
    doc.text("DOSAGE", 107, y + 4);
    doc.text("FREQUENCY", 152, y + 4);
    y += 8;
    
    medications.forEach((m) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 41, 59);
      doc.text(m.substring(0, 40), 17, y + 4);
      doc.text("As prescribed", 107, y + 4);
      doc.text("Regular", 152, y + 4);
      y += 7;
    });
  } else {
    doc.setFillColor(248, 250, 252);
    doc.rect(15, y, 180, 8, "F");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("No current medications reported", 17, y + 6);
    y += 12;
  }
  y += 5;
  
  y = addSectionHeader(doc, "Medical History / Chronic Conditions", y);
  const commonConditions = ["Diabetes", "Hypertension", "Heart Disease", "Asthma"];
  commonConditions.forEach((cond, idx) => {
    const x = 15 + (idx % 4) * 45;
    const hasCondition = conditions.some((c) => c.toLowerCase().includes(cond.toLowerCase()));
    if (hasCondition) {
      doc.setFillColor(22, 163, 74);
      doc.rect(x, y, 4, 4, "F");
    } else {
      doc.setDrawColor(100, 116, 139);
      doc.rect(x, y, 4, 4);
    }
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(cond, x + 6, y + 3);
  });
  y += 10;
  
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Other Conditions (from voice input):", 15, y);
  y += 4;
  doc.setFillColor(248, 250, 252);
  doc.rect(15, y, 180, 8, "F");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(conditions.join(", ") || "None reported", 17, y + 6);
  y += 15;
  
  addSignatureBox(doc, y);
  addFooter(doc, data.caseId);
  
  return doc;
};

export const generateAccidentSymptomForm = (data: FormData) => {
  const doc = new jsPDF();
  const categoryInfo = EMERGENCY_CATEGORIES.find((c) => c.value === data.category);
  
  let y = addHeader(doc, data, "ACCIDENT/SYMPTOM FORM");
  
  y = addSectionHeader(doc, "Patient Details", y);
  addField(doc, "Name", data.patient.name, 15, y, 60);
  addField(doc, "Age/Gender", `${data.patient.age || "—"}y / ${data.patient.gender || "—"}`, 80, y, 55);
  addField(doc, "Date/Time", `${formatDate(data.arrivalTime)} ${formatTime(data.arrivalTime)}`, 140, y, 55);
  y += 18;
  
  y = addSectionHeader(doc, "Incident/Symptom Type", y);
  addField(doc, "Category", `${categoryInfo?.icon || ""} ${categoryInfo?.label || data.category}`, 15, y, 85);
  addField(doc, "Priority Level", PRIORITY_CONFIG[data.priority].label, 105, y, 90);
  y += 18;
  
  y = addSectionHeader(doc, "Incident Description (Voice Recorded)", y);
  doc.setFillColor(248, 250, 252);
  doc.rect(15, y, 180, 15, "F");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const description = data.responses[0]?.answer || "As described during voice assessment";
  doc.text(description.substring(0, 90), 17, y + 6);
  if (description.length > 90) {
    doc.text(description.substring(90, 180), 17, y + 12);
  }
  y += 20;
  
  y = addSectionHeader(doc, "Symptoms Reported", y);
  data.responses.filter((r) => r.answer !== "No").slice(0, 6).forEach((r) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(22, 163, 74);
    doc.rect(17, y, 4, 4, "F");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`${r.question}: ${r.answer}`, 24, y + 3);
    y += 8;
  });
  y += 5;
  
  y = addSectionHeader(doc, "Body Areas Affected", y);
  const bodyAreas = ["Head/Neck", "Chest", "Abdomen", "Back", "Arms", "Legs"];
  bodyAreas.forEach((area, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 15 + col * 60;
    const yPos = y + row * 8;
    doc.setDrawColor(100, 116, 139);
    doc.rect(x, yPos, 4, 4);
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(area, x + 6, yPos + 3);
  });
  y += 22;
  
  y = addSectionHeader(doc, "Complete Voice Assessment Log", y);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 100, 6, "F");
  doc.rect(115, y, 50, 6, "F");
  doc.rect(165, y, 30, 6, "F");
  doc.setTextColor(71, 85, 105);
  doc.text("QUESTION", 17, y + 4);
  doc.text("ANSWER", 117, y + 4);
  doc.text("METHOD", 167, y + 4);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  data.responses.forEach((r) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setTextColor(30, 41, 59);
    const question = r.question.length > 50 ? r.question.substring(0, 50) + "..." : r.question;
    doc.text(question, 17, y + 4);
    doc.text(r.answer.substring(0, 25), 117, y + 4);
    doc.text(r.answeredVia, 167, y + 4);
    y += 7;
  });
  
  addFooter(doc, data.caseId);
  
  return doc;
};

export const generateDoctorSummaryForm = (data: FormData) => {
  const doc = new jsPDF();
  const categoryInfo = EMERGENCY_CATEGORIES.find((c) => c.value === data.category);
  const allergies = extractFromResponses(data.responses, ["allerg"]);
  const conditions = extractFromResponses(data.responses, ["diabetes", "bp", "heart", "condition", "history"]);
  
  let y = addHeader(doc, data, "DOCTOR SUMMARY FORM");
  
  if (allergies.length > 0) {
    doc.setFillColor(254, 242, 242);
    doc.rect(15, y, 180, 10, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38);
    doc.text(`⚠ ALLERGY ALERT: ${allergies.join(", ")}`, 18, y + 7);
    y += 15;
  }
  
  const priorityColors: Record<CasePriority, [number, number, number]> = {
    critical: [254, 242, 242],
    urgent: [255, 251, 235],
    normal: [240, 253, 244],
  };
  doc.setFillColor(...priorityColors[data.priority]);
  doc.rect(15, y, 180, 20, "F");
  addField(doc, "Priority", PRIORITY_CONFIG[data.priority].label.toUpperCase(), 17, y + 2, 50);
  addField(doc, "Emergency Type", categoryInfo?.label || data.category, 72, y + 2, 55);
  addField(doc, "Ward", data.ward, 132, y + 2, 60);
  y += 25;
  
  y = addSectionHeader(doc, "Patient Summary", y);
  addField(doc, "Name", data.patient.name, 15, y, 60);
  addField(doc, "Age", `${data.patient.age || "—"} years`, 80, y, 35);
  addField(doc, "Gender", data.patient.gender || "—", 120, y, 35);
  addField(doc, "Contact", data.patient.phone || "Not provided", 160, y, 35);
  y += 14;
  addField(doc, "Known Conditions", conditions.join(", ") || "None reported", 15, y, 180);
  y += 18;
  
  const criticalFindings = data.responses.filter((r) => {
    const keywords = ["severe", "critical", "emergency", "urgent", "bleeding", "unconscious", "chest pain", "breathing"];
    return keywords.some((k) => r.answer.toLowerCase().includes(k) || r.question.toLowerCase().includes(k));
  });
  
  if (criticalFindings.length > 0) {
    y = addSectionHeader(doc, "Critical Findings", y, [254, 242, 242]);
    criticalFindings.forEach((f) => {
      doc.setFontSize(9);
      doc.setTextColor(220, 38, 38);
      doc.text(`• ${f.question}: ${f.answer}`, 17, y + 2);
      y += 6;
    });
    y += 5;
  }
  
  y = addSectionHeader(doc, "Assessment Summary (AI Voice Interview)", y);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 120, 6, "F");
  doc.rect(135, y, 60, 6, "F");
  doc.setTextColor(71, 85, 105);
  doc.text("ASSESSMENT POINT", 17, y + 4);
  doc.text("PATIENT RESPONSE", 137, y + 4);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  data.responses.forEach((r) => {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    doc.setTextColor(30, 41, 59);
    const question = r.question.length > 60 ? r.question.substring(0, 60) + "..." : r.question;
    doc.text(question, 17, y + 4);
    doc.setFont("helvetica", r.answer === "Yes" ? "bold" : "normal");
    doc.text(r.answer.substring(0, 30), 137, y + 4);
    doc.setFont("helvetica", "normal");
    y += 7;
  });
  y += 5;
  
  y = addSectionHeader(doc, "Doctor's Notes", y);
  doc.setFillColor(248, 250, 252);
  doc.rect(15, y, 180, 20, "F");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Clinical observations and treatment plan:", 17, y + 5);
  y += 25;
  
  y = addSectionHeader(doc, "Orders", y);
  const orders = ["Labs", "Imaging", "Medications", "Consult", "Admission", "Discharge"];
  orders.forEach((order, idx) => {
    const col = idx % 6;
    const x = 15 + col * 30;
    doc.setDrawColor(100, 116, 139);
    doc.rect(x, y, 4, 4);
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(order, x + 6, y + 3);
  });
  y += 12;
  
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, 180, 20);
  doc.line(20, y + 15, 70, y + 15);
  doc.line(90, y + 15, 130, y + 15);
  doc.line(150, y + 15, 190, y + 15);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Attending Physician", 20, y + 18);
  doc.text("License No.", 90, y + 18);
  doc.text("Date/Time", 150, y + 18);
  
  addFooter(doc, data.caseId);
  
  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};
