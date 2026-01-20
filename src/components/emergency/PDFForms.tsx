"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { QuestionResponse, PatientInfo, CasePriority, EmergencyCategory, EMERGENCY_CATEGORIES, PRIORITY_CONFIG } from "@/lib/emergency-types";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "2px solid #dc2626",
    paddingBottom: 15,
    marginBottom: 20,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  hospitalAddress: {
    fontSize: 9,
    color: "#64748b",
  },
  formTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#dc2626",
    textAlign: "right",
    marginBottom: 4,
  },
  formId: {
    fontSize: 9,
    color: "#64748b",
    textAlign: "right",
  },
  section: {
    marginBottom: 15,
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#f1f5f9",
    padding: 8,
    borderBottom: "1px solid #e2e8f0",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#334155",
    textTransform: "uppercase",
  },
  sectionContent: {
    padding: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  col2: {
    flex: 1,
    paddingRight: 10,
  },
  col3: {
    flex: 1,
    paddingRight: 8,
  },
  label: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 10,
    color: "#1e293b",
    padding: 6,
    backgroundColor: "#f8fafc",
    borderRadius: 2,
    minHeight: 20,
  },
  valueEmpty: {
    fontSize: 10,
    color: "#94a3b8",
    padding: 6,
    backgroundColor: "#f8fafc",
    borderRadius: 2,
    minHeight: 20,
    borderBottom: "1px solid #cbd5e1",
  },
  priorityBadge: {
    padding: "4px 12px",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  priorityCritical: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },
  priorityUrgent: {
    backgroundColor: "#fffbeb",
    color: "#d97706",
    border: "1px solid #fde68a",
  },
  priorityNormal: {
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottom: "1px solid #e2e8f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #f1f5f9",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    fontSize: 9,
  },
  tableCellHeader: {
    flex: 1,
    padding: 6,
    fontSize: 8,
    fontWeight: "bold",
    color: "#475569",
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  },
  signatureBox: {
    marginTop: 20,
    padding: 15,
    border: "1px solid #e2e8f0",
    borderRadius: 4,
  },
  signatureLine: {
    borderBottom: "1px solid #1e293b",
    marginTop: 30,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 8,
    color: "#64748b",
  },
  alertBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  alertText: {
    fontSize: 10,
    color: "#dc2626",
    fontWeight: "bold",
  },
  checkbox: {
    width: 12,
    height: 12,
    border: "1px solid #64748b",
    marginRight: 6,
    borderRadius: 2,
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    border: "1px solid #16a34a",
    backgroundColor: "#16a34a",
    marginRight: 6,
    borderRadius: 2,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
});

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
  return results;
};

const getResponseByKeyword = (responses: QuestionResponse[], keyword: string): string => {
  const found = responses.find(
    (r) => r.question.toLowerCase().includes(keyword.toLowerCase()) || r.questionId.toLowerCase().includes(keyword.toLowerCase())
  );
  return found?.answer || "";
};

export const EmergencyIntakeForm = ({ data }: { data: FormData }) => {
  const categoryInfo = EMERGENCY_CATEGORIES.find((c) => c.value === data.category);
  const priorityStyle =
    data.priority === "critical" ? styles.priorityCritical :
    data.priority === "urgent" ? styles.priorityUrgent : styles.priorityNormal;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.hospitalInfo}>
            <Text style={styles.hospitalName}>{data.hospitalName}</Text>
            <Text style={styles.hospitalAddress}>Emergency Department | 24x7 Services</Text>
            <Text style={styles.hospitalAddress}>Contact: 1800-XXX-XXXX | emergency@hospital.com</Text>
          </View>
          <View>
            <Text style={styles.formTitle}>EMERGENCY INTAKE FORM</Text>
            <Text style={styles.formId}>Case ID: {data.caseId}</Text>
            <Text style={styles.formId}>Date: {formatDate(data.arrivalTime)}</Text>
          </View>
        </View>

        <View style={[styles.priorityBadge, priorityStyle, { marginBottom: 15 }]}>
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>
            PRIORITY: {PRIORITY_CONFIG[data.priority].label.toUpperCase()}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.value}>{data.patient.name || "________________"}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Age</Text>
                <Text style={styles.value}>{data.patient.age || "____"} years</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Gender</Text>
                <Text style={styles.value}>{data.patient.gender || "________"}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.label}>Contact Number</Text>
                <Text style={styles.value}>{data.patient.phone || "________________"}</Text>
              </View>
              <View style={styles.col2}>
                <Text style={styles.label}>Emergency Contact</Text>
                <Text style={styles.valueEmpty}>________________</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Details</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.label}>Emergency Type</Text>
                <Text style={styles.value}>{categoryInfo?.icon} {categoryInfo?.label}</Text>
              </View>
              <View style={styles.col2}>
                <Text style={styles.label}>Arrival Time</Text>
                <Text style={styles.value}>{formatTime(data.arrivalTime)}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.label}>Ward/Department</Text>
                <Text style={styles.value}>{data.ward}</Text>
              </View>
              <View style={styles.col2}>
                <Text style={styles.label}>Mode of Arrival</Text>
                <Text style={styles.value}>{data.priority === "critical" ? "Ambulance" : "Walk-in"}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Initial Assessment (Voice Recorded)</Text>
          </View>
          <View style={styles.sectionContent}>
            {data.responses.slice(0, 6).map((r, idx) => (
              <View key={idx} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{r.question}</Text>
                  <Text style={styles.value}>{r.answer} {r.answeredVia === "voice" ? "(Voice)" : ""}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.signatureBox}>
          <View style={styles.row}>
            <View style={styles.col2}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Patient/Caregiver Signature</Text>
            </View>
            <View style={styles.col2}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Receiving Staff Signature</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Form generated: {new Date().toLocaleString()}</Text>
          <Text style={styles.footerText}>AI-Powered Emergency Form System</Text>
        </View>
      </Page>
    </Document>
  );
};

export const TriageAssessmentForm = ({ data }: { data: FormData }) => {
  const categoryInfo = EMERGENCY_CATEGORIES.find((c) => c.value === data.category);
  const symptoms = extractFromResponses(data.responses, ["symptom", "pain", "feel", "experiencing"]);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.hospitalInfo}>
            <Text style={styles.hospitalName}>{data.hospitalName}</Text>
            <Text style={styles.hospitalAddress}>Emergency Triage Assessment</Text>
          </View>
          <View>
            <Text style={styles.formTitle}>TRIAGE ASSESSMENT FORM</Text>
            <Text style={styles.formId}>Case ID: {data.caseId}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Patient Identification</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.col3}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{data.patient.name}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Age/Gender</Text>
                <Text style={styles.value}>{data.patient.age}y / {data.patient.gender}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Triage Time</Text>
                <Text style={styles.value}>{formatTime(data.arrivalTime)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Triage Category</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              {["critical", "urgent", "normal"].map((level) => (
                <View key={level} style={[styles.col3, { flexDirection: "row", alignItems: "center" }]}>
                  <View style={data.priority === level ? styles.checkboxChecked : styles.checkbox} />
                  <Text style={{ fontSize: 10 }}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chief Complaint</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.value}>{categoryInfo?.label}: {getResponseByKeyword(data.responses, "describe") || getResponseByKeyword(data.responses, "chief") || data.responses[0]?.answer || "As per voice assessment"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vital Signs (To be filled by staff)</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.col3}>
                <Text style={styles.label}>Blood Pressure</Text>
                <Text style={styles.valueEmpty}>____/____ mmHg</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Pulse Rate</Text>
                <Text style={styles.valueEmpty}>_______ /min</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Temperature</Text>
                <Text style={styles.valueEmpty}>_______°F</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col3}>
                <Text style={styles.label}>SpO2</Text>
                <Text style={styles.valueEmpty}>_______% </Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Respiratory Rate</Text>
                <Text style={styles.valueEmpty}>_______ /min</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>GCS Score</Text>
                <Text style={styles.valueEmpty}>_______ /15</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Presenting Symptoms (Voice Recorded)</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCellHeader}>Symptom/Finding</Text>
                <Text style={styles.tableCellHeader}>Patient Response</Text>
                <Text style={styles.tableCellHeader}>Input Method</Text>
              </View>
              {data.responses.map((r, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{r.question}</Text>
                  <Text style={styles.tableCell}>{r.answer}</Text>
                  <Text style={styles.tableCell}>{r.answeredVia}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.signatureBox}>
          <View style={styles.row}>
            <View style={styles.col2}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Triage Nurse Name & Signature</Text>
            </View>
            <View style={styles.col2}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Date & Time</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Triage Form | {data.caseId}</Text>
          <Text style={styles.footerText}>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export const AllergyMedicationForm = ({ data }: { data: FormData }) => {
  const allergies = extractFromResponses(data.responses, ["allerg", "reaction"]);
  const medications = extractFromResponses(data.responses, ["medic", "drug", "taking", "prescription"]);
  const conditions = extractFromResponses(data.responses, ["diabetes", "bp", "heart", "condition", "history", "disease"]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.hospitalInfo}>
            <Text style={styles.hospitalName}>{data.hospitalName}</Text>
            <Text style={styles.hospitalAddress}>Patient Medical History</Text>
          </View>
          <View>
            <Text style={styles.formTitle}>ALLERGY & MEDICATION FORM</Text>
            <Text style={styles.formId}>Case ID: {data.caseId}</Text>
          </View>
        </View>

        {allergies.length > 0 && (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>⚠️ ALLERGY ALERT: {allergies.join(", ")}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.label}>Patient Name</Text>
                <Text style={styles.value}>{data.patient.name}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Age</Text>
                <Text style={styles.value}>{data.patient.age} years</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Case ID</Text>
                <Text style={styles.value}>{data.caseId}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: "#fef2f2" }]}>
            <Text style={[styles.sectionTitle, { color: "#dc2626" }]}>Known Allergies</Text>
          </View>
          <View style={styles.sectionContent}>
            {allergies.length > 0 ? (
              allergies.map((a, idx) => (
                <View key={idx} style={styles.checkboxRow}>
                  <View style={styles.checkboxChecked} />
                  <Text style={{ fontSize: 10 }}>{a}</Text>
                </View>
              ))
            ) : (
              <View>
                <View style={styles.checkboxRow}>
                  <View style={styles.checkbox} />
                  <Text style={{ fontSize: 10 }}>Drug Allergies: _______________</Text>
                </View>
                <View style={styles.checkboxRow}>
                  <View style={styles.checkbox} />
                  <Text style={{ fontSize: 10 }}>Food Allergies: _______________</Text>
                </View>
                <View style={styles.checkboxRow}>
                  <View style={styles.checkbox} />
                  <Text style={{ fontSize: 10 }}>Other Allergies: _______________</Text>
                </View>
                <View style={styles.checkboxRow}>
                  <View style={styles.checkboxChecked} />
                  <Text style={{ fontSize: 10 }}>No Known Allergies (NKDA)</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Medications</Text>
          </View>
          <View style={styles.sectionContent}>
            {medications.length > 0 ? (
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableCellHeader}>Medication Name</Text>
                  <Text style={styles.tableCellHeader}>Dosage</Text>
                  <Text style={styles.tableCellHeader}>Frequency</Text>
                </View>
                {medications.map((m, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{m}</Text>
                    <Text style={styles.tableCell}>As prescribed</Text>
                    <Text style={styles.tableCell}>Regular</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.value}>No current medications reported</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical History / Chronic Conditions</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              {["Diabetes", "Hypertension", "Heart Disease", "Asthma"].map((cond) => (
                <View key={cond} style={[styles.col3, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}>
                  <View style={conditions.some(c => c.toLowerCase().includes(cond.toLowerCase())) ? styles.checkboxChecked : styles.checkbox} />
                  <Text style={{ fontSize: 9 }}>{cond}</Text>
                </View>
              ))}
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Other Conditions (from voice input)</Text>
                <Text style={styles.value}>{conditions.join(", ") || "None reported"}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.signatureBox}>
          <Text style={{ fontSize: 9, marginBottom: 10, color: "#64748b" }}>
            I confirm that the above information is accurate to the best of my knowledge.
          </Text>
          <View style={styles.row}>
            <View style={styles.col2}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Patient/Caregiver Signature</Text>
            </View>
            <View style={styles.col2}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Date</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Allergy & Medication Form | {data.caseId}</Text>
          <Text style={styles.footerText}>CONFIDENTIAL</Text>
        </View>
      </Page>
    </Document>
  );
};

export const AccidentSymptomForm = ({ data }: { data: FormData }) => {
  const categoryInfo = EMERGENCY_CATEGORIES.find((c) => c.value === data.category);
  const injuries = extractFromResponses(data.responses, ["injury", "pain", "hurt", "broken", "bleeding", "wound"]);
  const circumstances = getResponseByKeyword(data.responses, "how") || getResponseByKeyword(data.responses, "happen") || getResponseByKeyword(data.responses, "accident");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.hospitalInfo}>
            <Text style={styles.hospitalName}>{data.hospitalName}</Text>
            <Text style={styles.hospitalAddress}>Emergency Accident/Symptom Report</Text>
          </View>
          <View>
            <Text style={styles.formTitle}>ACCIDENT/SYMPTOM FORM</Text>
            <Text style={styles.formId}>Case ID: {data.caseId}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Patient Details</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{data.patient.name}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Age/Gender</Text>
                <Text style={styles.value}>{data.patient.age}y / {data.patient.gender}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Date/Time</Text>
                <Text style={styles.value}>{formatDate(data.arrivalTime)} {formatTime(data.arrivalTime)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Incident/Symptom Type</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.label}>Category</Text>
                <Text style={styles.value}>{categoryInfo?.icon} {categoryInfo?.label}</Text>
              </View>
              <View style={styles.col2}>
                <Text style={styles.label}>Priority Level</Text>
                <Text style={styles.value}>{PRIORITY_CONFIG[data.priority].label}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Incident Description (Voice Recorded)</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.label}>How did the incident occur?</Text>
            <Text style={[styles.value, { minHeight: 40 }]}>{circumstances || "As described during voice assessment"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Injuries / Symptoms Reported</Text>
          </View>
          <View style={styles.sectionContent}>
            {injuries.length > 0 ? (
              injuries.map((inj, idx) => (
                <View key={idx} style={styles.checkboxRow}>
                  <View style={styles.checkboxChecked} />
                  <Text style={{ fontSize: 10 }}>{inj}</Text>
                </View>
              ))
            ) : (
              <View>
                {data.responses.filter(r => r.answer !== "No").slice(0, 5).map((r, idx) => (
                  <View key={idx} style={styles.checkboxRow}>
                    <View style={styles.checkboxChecked} />
                    <Text style={{ fontSize: 10 }}>{r.question}: {r.answer}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Body Areas Affected</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              {["Head/Neck", "Chest", "Abdomen", "Back", "Arms", "Legs"].map((area) => (
                <View key={area} style={[styles.col3, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}>
                  <View style={styles.checkbox} />
                  <Text style={{ fontSize: 9 }}>{area}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Complete Voice Assessment Log</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCellHeader, { flex: 2 }]}>Question</Text>
                <Text style={styles.tableCellHeader}>Answer</Text>
                <Text style={styles.tableCellHeader}>Method</Text>
              </View>
              {data.responses.map((r, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{r.question}</Text>
                  <Text style={styles.tableCell}>{r.answer}</Text>
                  <Text style={styles.tableCell}>{r.answeredVia}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Accident/Symptom Form | {data.caseId}</Text>
          <Text style={styles.footerText}>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export const DoctorSummaryForm = ({ data }: { data: FormData }) => {
  const categoryInfo = EMERGENCY_CATEGORIES.find((c) => c.value === data.category);
  const allergies = extractFromResponses(data.responses, ["allerg"]);
  const medications = extractFromResponses(data.responses, ["medic", "drug"]);
  const conditions = extractFromResponses(data.responses, ["diabetes", "bp", "heart", "condition", "history"]);
  
  const criticalFindings = data.responses.filter((r) => {
    const keywords = ["severe", "critical", "emergency", "urgent", "bleeding", "unconscious", "chest pain", "breathing"];
    return keywords.some((k) => r.answer.toLowerCase().includes(k) || r.question.toLowerCase().includes(k));
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.hospitalInfo}>
            <Text style={styles.hospitalName}>{data.hospitalName}</Text>
            <Text style={styles.hospitalAddress}>Clinical Summary Report</Text>
          </View>
          <View>
            <Text style={styles.formTitle}>DOCTOR SUMMARY FORM</Text>
            <Text style={styles.formId}>Case ID: {data.caseId}</Text>
            <Text style={styles.formId}>{formatDate(data.arrivalTime)} | {formatTime(data.arrivalTime)}</Text>
          </View>
        </View>

        {allergies.length > 0 && (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>⚠️ ALLERGY ALERT: {allergies.join(", ")}</Text>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: data.priority === "critical" ? "#fef2f2" : data.priority === "urgent" ? "#fffbeb" : "#f0fdf4" }]}>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.col3}>
                <Text style={styles.label}>Priority</Text>
                <Text style={[styles.value, { fontWeight: "bold", color: data.priority === "critical" ? "#dc2626" : data.priority === "urgent" ? "#d97706" : "#16a34a" }]}>
                  {PRIORITY_CONFIG[data.priority].label.toUpperCase()}
                </Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Emergency Type</Text>
                <Text style={styles.value}>{categoryInfo?.label}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Ward</Text>
                <Text style={styles.value}>{data.ward}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Patient Summary</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{data.patient.name}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Age</Text>
                <Text style={styles.value}>{data.patient.age} years</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.label}>Gender</Text>
                <Text style={styles.value}>{data.patient.gender}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.label}>Contact</Text>
                <Text style={styles.value}>{data.patient.phone || "Not provided"}</Text>
              </View>
              <View style={styles.col2}>
                <Text style={styles.label}>Known Conditions</Text>
                <Text style={styles.value}>{conditions.join(", ") || "None reported"}</Text>
              </View>
            </View>
          </View>
        </View>

        {criticalFindings.length > 0 && (
          <View style={[styles.section, { borderColor: "#dc2626" }]}>
            <View style={[styles.sectionHeader, { backgroundColor: "#fef2f2" }]}>
              <Text style={[styles.sectionTitle, { color: "#dc2626" }]}>Critical Findings</Text>
            </View>
            <View style={styles.sectionContent}>
              {criticalFindings.map((f, idx) => (
                <View key={idx} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 9, color: "#dc2626" }}>• {f.question}: {f.answer}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Assessment Summary (AI Voice Interview)</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCellHeader, { flex: 2 }]}>Assessment Point</Text>
                <Text style={styles.tableCellHeader}>Patient Response</Text>
              </View>
              {data.responses.map((r, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{r.question}</Text>
                  <Text style={[styles.tableCell, { fontWeight: r.answer === "Yes" ? "bold" : "normal" }]}>{r.answer}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Doctor's Notes</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={[styles.valueEmpty, { minHeight: 60 }]}>
              <Text style={{ color: "#94a3b8", fontSize: 9 }}>Clinical observations and treatment plan:</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Orders</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              {["Labs", "Imaging", "Medications", "Consult", "Admission", "Discharge"].map((order) => (
                <View key={order} style={[styles.col3, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}>
                  <View style={styles.checkbox} />
                  <Text style={{ fontSize: 9 }}>{order}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.signatureBox}>
          <View style={styles.row}>
            <View style={styles.col2}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Attending Physician Name & Signature</Text>
            </View>
            <View style={styles.col3}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>License No.</Text>
            </View>
            <View style={styles.col3}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Date/Time</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Doctor Summary | {data.caseId} | CONFIDENTIAL</Text>
          <Text style={styles.footerText}>AI-Powered Emergency Documentation</Text>
        </View>
      </Page>
    </Document>
  );
};
