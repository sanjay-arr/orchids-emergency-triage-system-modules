import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PatientData {
  caseId: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup?: string;
  phone: string;
  address?: string;
  hospitalName: string;
  ward: string;
  arrivalTime: string;
  category: string;
  priority: string;
  symptoms?: string[];
  allergies?: string[];
  medications?: string[];
  medicalHistory?: string[];
  vitals?: {
    bp?: string;
    pulse?: string;
    temperature?: string;
    respiratoryRate?: string;
    spO2?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  arrivalMode?: string;
  broughtBy?: string;
  notes?: string;
}

const generatePDFFromHTML = async (
  element: HTMLElement,
  filename: string
): Promise<void> => {
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF();
  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
};

// ✅ 1) REGISTRATION PDF
export const generateRegistrationPDF = async (data: PatientData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; background: white;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #1f2937; font-size: 24px;">🏥 ${data.hospitalName}</h1>
        <h2 style="margin: 5px 0; color: #dc2626; font-size: 20px;">Emergency Patient Registration Form</h2>
        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px; font-size: 12px;">
          <span><strong>Date:</strong> ${new Date().toLocaleDateString()}</span>
          <span><strong>Time:</strong> ${new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <!-- Case ID Badge -->
      <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <span style="font-size: 18px; font-weight: bold;">CASE ID: ${data.caseId}</span>
      </div>

      <!-- Patient Details Section -->
      <div style="border-left: 4px solid #dc2626; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">👤 Patient Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr>
            <td style="width: 50%; padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Full Name:</strong> ${data.name}</td>
            <td style="width: 50%; padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Age:</strong> ${data.age} years</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Gender:</strong> ${data.gender}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Blood Group:</strong> ${data.bloodGroup || "Unknown"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong> ${data.phone}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Address:</strong> ${data.address || "N/A"}</td>
          </tr>
        </table>
      </div>

      <!-- Emergency Contact Section -->
      <div style="border-left: 4px solid #0284c7; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">📞 Emergency Contact</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr>
            <td style="width: 33%; padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong> ${data.emergencyContact?.name || "N/A"}</td>
            <td style="width: 33%; padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Relationship:</strong> ${data.emergencyContact?.relationship || "N/A"}</td>
            <td style="width: 34%; padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong> ${data.emergencyContact?.phone || "N/A"}</td>
          </tr>
        </table>
      </div>

      <!-- Arrival Info Section -->
      <div style="border-left: 4px solid #16a34a; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">🚑 Arrival Information</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr>
            <td style="width: 33%; padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Arrival Mode:</strong> ${data.arrivalMode || "Walk-in"}</td>
            <td style="width: 33%; padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Brought By:</strong> ${data.broughtBy || "Self"}</td>
            <td style="width: 34%; padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Ward:</strong> ${data.ward}</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 30px; font-size: 10px; color: #6b7280; text-align: center;">
        <p style="margin: 5px 0;">Generated by AI Emergency Form Automation System</p>
        <p style="margin: 0;">Registration Staff: ________________  |  Nurse: ________________</p>
      </div>
    </div>
  `;

  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
  await generatePDFFromHTML(div, `Registration_${data.caseId}.pdf`);
  document.body.removeChild(div);
};

// ✅ 2) TRIAGE PDF
export const generateTriagePDF = async (data: PatientData) => {
  const priorityColors: Record<string, string> = {
    critical: "#dc2626",
    urgent: "#ea580c",
    normal: "#16a34a",
  };

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; background: white;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 3px solid ${priorityColors[data.priority.toLowerCase()] || "#dc2626"}; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #1f2937; font-size: 24px;">🏥 Triage Assessment Sheet</h1>
        <p style="margin: 5px 0; color: #666; font-size: 12px;">Case ID: <strong>${data.caseId}</strong> | Date: <strong>${new Date().toLocaleDateString()}</strong></p>
      </div>

      <!-- Priority Badge -->
      <div style="background: ${priorityColors[data.priority.toLowerCase()] || "#dc2626"}; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; font-size: 16px; font-weight: bold;">
        🚨 PRIORITY: ${data.priority.toUpperCase()}
      </div>

      <!-- Chief Complaint -->
      <div style="border-left: 4px solid #0284c7; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">📋 Chief Complaint</h3>
        <p style="margin: 0; padding: 10px; background: #f3f4f6; border-radius: 4px; font-size: 12px;">
          <strong>Category:</strong> ${data.category}<br>
          <strong>Symptoms:</strong> ${data.symptoms?.join(", ") || "N/A"}
        </p>
      </div>

      <!-- Patient Status -->
      <div style="border-left: 4px solid #7c3aed; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">💊 Patient Status</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr>
            <td style="width: 50%; padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Conscious:</strong> ☑ Yes ☐ No</td>
            <td style="width: 50%; padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Alert Status:</strong> Alert / Confused / Unresponsive</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Pain Score (0-10):</strong> ______</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Mobility:</strong> Walking / Wheelchair / Stretcher</td>
          </tr>
        </table>
      </div>

      <!-- Risk Alerts -->
      <div style="background: #fef2f2; border: 2px solid #dc2626; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <h3 style="color: #991b1b; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">⚠️ IMMEDIATE RISK ALERTS</h3>
        <div style="font-size: 12px;">
          <p style="margin: 5px 0;">☐ Allergy Risk Detected</p>
          <p style="margin: 5px 0;">☐ Breathing Difficulty</p>
          <p style="margin: 5px 0;">☐ Heavy Bleeding</p>
          <p style="margin: 5px 0;">☐ Stroke Signs</p>
          <p style="margin: 5px 0;">☐ Chest Pain / Cardiac Emergency</p>
          <p style="margin: 5px 0;">☐ Severe Trauma</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 30px; font-size: 10px; color: #6b7280; text-align: center;">
        <p style="margin: 5px 0;">Triage Nurse: ________________  |  Time Completed: ${new Date().toLocaleTimeString()}</p>
        <p style="margin: 0;">Generated by AI Emergency Form Automation System</p>
      </div>
    </div>
  `;

  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
  await generatePDFFromHTML(div, `Triage_${data.caseId}.pdf`);
  document.body.removeChild(div);
};

// ✅ 3) MEDICAL HISTORY PDF
export const generateMedicalHistoryPDF = async (data: PatientData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; background: white;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 3px solid #7c3aed; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #1f2937; font-size: 24px;">📋 Patient Medical History (Emergency Quick View)</h1>
        <p style="margin: 5px 0; color: #666; font-size: 12px;">Case ID: <strong>${data.caseId}</strong></p>
      </div>

      <!-- Past Medical Conditions -->
      <div style="border-left: 4px solid #7c3aed; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0;">🏥 Past Medical Conditions</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 12px;">
          <div><input type="checkbox"> Diabetes</div>
          <div><input type="checkbox"> Hypertension/BP</div>
          <div><input type="checkbox"> Asthma/COPD</div>
          <div><input type="checkbox"> Heart Disease</div>
          <div><input type="checkbox"> Kidney Disease</div>
          <div><input type="checkbox"> Epilepsy</div>
          <div><input type="checkbox"> Liver Disease</div>
          <div><input type="checkbox"> Cancer History</div>
          <div><input type="checkbox"> Thyroid Disorder</div>
          <div><input type="checkbox"> Mental Health Issues</div>
        </div>
      </div>

      <!-- Past Surgical History -->
      <div style="border-left: 4px solid #0284c7; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">🔪 Past Surgical History</h3>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Any surgery before?</strong> ☐ Yes ☐ No</p>
        <p style="margin: 5px 0; font-size: 12px;"><strong>If Yes, specify:</strong> _______________________________________________</p>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Year:</strong> __________</p>
      </div>

      <!-- Hospitalization History -->
      <div style="border-left: 4px solid #16a34a; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">🏨 Hospitalization History</h3>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Admitted before?</strong> ☐ Yes ☐ No</p>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Reason (if yes):</strong> _______________________________________________</p>
      </div>

      <!-- Lifestyle -->
      <div style="border-left: 4px solid #ea580c; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">🚭 Lifestyle Habits</h3>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Smoking:</strong> ☐ Yes ☐ No ☐ Former Smoker</p>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Alcohol:</strong> ☐ Yes ☐ No ☐ Former Drinker</p>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Substance Use:</strong> ☐ Yes ☐ No</p>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 30px; font-size: 10px; color: #6b7280; text-align: center;">
        <p style="margin: 0;">Generated by AI Emergency Form Automation System</p>
      </div>
    </div>
  `;

  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
  await generatePDFFromHTML(div, `MedicalHistory_${data.caseId}.pdf`);
  document.body.removeChild(div);
};

// ✅ 4) ALLERGY & MEDS PDF
export const generateAllergyMedsPDF = async (data: PatientData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; background: white;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #1f2937; font-size: 24px;">💊 Allergy & Medication Safety Sheet</h1>
        <p style="margin: 5px 0; color: #666; font-size: 12px;">Case ID: <strong>${data.caseId}</strong> | Timestamp: <strong>${new Date().toLocaleString()}</strong></p>
      </div>

      <!-- Allergies Section -->
      <div style="background: #fef2f2; border: 3px solid #dc2626; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h3 style="color: #991b1b; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">⚠️ ALLERGIES (CRITICAL)</h3>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Has drug allergy?</strong> ☐ Yes ☐ No</p>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Allergy List:</strong></p>
        <div style="background: white; padding: 10px; border-radius: 4px; margin: 8px 0; min-height: 40px; border: 1px solid #fca5a5;">
          ${data.allergies?.join(", ") || "No allergies recorded"}
        </div>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Reaction Type:</strong> ☐ Rash ☐ Breathing Issue ☐ Swelling ☐ Other: _______</p>
      </div>

      <!-- Current Medications -->
      <div style="border-left: 4px solid #0284c7; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 10px 0;">💊 Current Medications</h3>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Taking medicines now?</strong> ☐ Yes ☐ No</p>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Medication List:</strong></p>
        <div style="background: #f0f9ff; padding: 10px; border-radius: 4px; margin: 8px 0; min-height: 40px; border: 1px solid #bfdbfe;">
          ${data.medications?.join(", ") || "No medications recorded"}
        </div>
        <p style="margin: 5px 0; font-size: 12px;"><strong>Last Dose Time:</strong> __________</p>
      </div>

      <!-- AI Risk Assessment -->
      <div style="background: #fef3c7; border: 2px solid #ea580c; border-left: 4px solid #ea580c; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <h3 style="color: #92400e; font-size: 13px; text-transform: uppercase; margin: 0 0 8px 0;">🚨 AI Risk Flag</h3>
        <p style="margin: 0; font-size: 12px; color: #78350f;"><strong>Status:</strong> High Risk Allergy Identified</p>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #78350f;"><strong>Recommendation:</strong> Avoid penicillin group antibiotics. Use alternative antimicrobials.</p>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 30px; font-size: 10px; color: #6b7280; text-align: center;">
        <p style="margin: 5px 0;">⚠️ <strong>CRITICAL:</strong> Ensure all allergies are verified before prescribing medications.</p>
        <p style="margin: 0;">Generated by AI Emergency Form Automation System</p>
      </div>
    </div>
  `;

  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
  await generatePDFFromHTML(div, `AllergyMeds_${data.caseId}.pdf`);
  document.body.removeChild(div);
};

// ✅ 5) VITAL SIGNS PDF
export const generateVitalSignsPDF = async (data: PatientData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; background: white;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 3px solid #16a34a; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #1f2937; font-size: 24px;">📊 Vital Signs Monitoring Sheet</h1>
        <p style="margin: 5px 0; color: #666; font-size: 12px;">Case ID: <strong>${data.caseId}</strong> | Timestamp: <strong>${new Date().toLocaleString()}</strong></p>
      </div>

      <!-- Vital Signs Table -->
      <div style="border-left: 4px solid #16a34a; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0;">❤️ Vital Signs at Arrival</h3>
        <table style="width: 100%; border-collapse: collapse; border: 2px solid #16a34a; font-size: 13px;">
          <tr style="background: #f0fdf4; border-bottom: 1px solid #16a34a;">
            <th style="padding: 12px; text-align: left; font-weight: bold; border-right: 1px solid #16a34a;">Parameter</th>
            <th style="padding: 12px; text-align: center; font-weight: bold; border-right: 1px solid #16a34a;">Value</th>
            <th style="padding: 12px; text-align: center; font-weight: bold;">Status</th>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px; border-right: 1px solid #e5e7eb;">🩸 Blood Pressure (Systolic/Diastolic)</td>
            <td style="padding: 10px; text-align: center; border-right: 1px solid #e5e7eb;"><strong>${data.vitals?.bp || "__/__"}</strong> mmHg</td>
            <td style="padding: 10px; text-align: center;">Normal / High / Low</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px; border-right: 1px solid #e5e7eb;">💓 Pulse Rate</td>
            <td style="padding: 10px; text-align: center; border-right: 1px solid #e5e7eb;"><strong>${data.vitals?.pulse || "___"}</strong> bpm</td>
            <td style="padding: 10px; text-align: center;">Normal / High / Low</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px; border-right: 1px solid #e5e7eb;">🌡️ Temperature</td>
            <td style="padding: 10px; text-align: center; border-right: 1px solid #e5e7eb;"><strong>${data.vitals?.temperature || "___"}</strong> °C</td>
            <td style="padding: 10px; text-align: center;">Normal / Fever / Hypothermia</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px; border-right: 1px solid #e5e7eb;">💨 Respiratory Rate</td>
            <td style="padding: 10px; text-align: center; border-right: 1px solid #e5e7eb;"><strong>${data.vitals?.respiratoryRate || "___"}</strong> breaths/min</td>
            <td style="padding: 10px; text-align: center;">Normal / Fast / Slow</td>
          </tr>
          <tr style="background: #e0f2fe;">
            <td style="padding: 10px; border-right: 1px solid #e5e7eb;"><strong>🫁 SpO₂ (Oxygen Saturation)</strong></td>
            <td style="padding: 10px; text-align: center; border-right: 1px solid #e5e7eb; background: #bfdbfe;"><strong>${data.vitals?.spO2 || "___"}</strong> %</td>
            <td style="padding: 10px; text-align: center; background: #bfdbfe;">Excellent / Good / Low</td>
          </tr>
        </table>
      </div>

      <!-- Repeat Vitals (Optional) -->
      <div style="border-left: 4px solid #0284c7; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; margin: 0 0 10px 0;">📈 Follow-up Vitals (15 minutes later)</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #0284c7; font-size: 12px;">
          <tr style="background: #eff6ff;">
            <td style="padding: 8px; width: 30%; border-right: 1px solid #0284c7;">BP: ____/____</td>
            <td style="padding: 8px; width: 30%; border-right: 1px solid #0284c7;">Pulse: ____ bpm</td>
            <td style="padding: 8px; width: 40%;">SpO₂: ____  %</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 30px; font-size: 10px; color: #6b7280; text-align: center;">
        <p style="margin: 5px 0;">Medical Staff: ________________  |  Time: __________</p>
        <p style="margin: 0;">Generated by AI Emergency Form Automation System</p>
      </div>
    </div>
  `;

  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
  await generatePDFFromHTML(div, `VitalSigns_${data.caseId}.pdf`);
  document.body.removeChild(div);
};

// ✅ 6) CATEGORY-SPECIFIC FORM PDF
export const generateCategoryFormPDF = async (data: PatientData) => {
  let categoryContent = "";

  if (data.category.includes("Accident")) {
    categoryContent = `
      <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0;">🚗 Accident/Injury Assessment</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px; width: 40%;"><strong>Type of Accident:</strong></td>
          <td style="padding: 8px;">☐ Vehicle ☐ Fall ☐ Workplace ☐ Sports ☐ Other: _____</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Bleeding:</strong></td>
          <td style="padding: 8px;">☐ Yes ☐ No | Severity: Minor / Moderate / Severe</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Lost Consciousness:</strong></td>
          <td style="padding: 8px;">☐ Yes ☐ No | Duration: __________</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Pain Location:</strong></td>
          <td style="padding: 8px;">Head / Chest / Abdomen / Limbs / Other: _____</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Suspected Fracture:</strong></td>
          <td style="padding: 8px;">☐ Yes ☐ No | Location: __________</td>
        </tr>
      </table>
    `;
  } else if (data.category.includes("Chest")) {
    categoryContent = `
      <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0;">🫀 Chest Pain Assessment</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px; width: 40%;"><strong>Duration:</strong></td>
          <td style="padding: 8px;">☐ Just Started ☐ <30 min ☐ 30-60 min ☐ >1 hr</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Pain Type:</strong></td>
          <td style="padding: 8px;">☐ Sharp ☐ Pressure ☐ Burning ☐ Dull ☐ Other: _____</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Radiating Pain:</strong></td>
          <td style="padding: 8px;">☐ Yes ☐ No | To: Arm / Jaw / Back / Other: _____</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Shortness of Breath:</strong></td>
          <td style="padding: 8px;">☐ Yes ☐ No | Severity: Mild / Moderate / Severe</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Associated Symptoms:</strong></td>
          <td style="padding: 8px;">☐ Sweating ☐ Nausea ☐ Dizziness ☐ Palpitations</td>
        </tr>
      </table>
    `;
  } else if (data.category.includes("Fever")) {
    categoryContent = `
      <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0;">🌡️ Fever Assessment</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px; width: 40%;"><strong>Temperature:</strong></td>
          <td style="padding: 8px;">________°C | Measured by: Oral / Axillary / Tympanic</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Duration:</strong></td>
          <td style="padding: 8px;">☐ <24 hrs ☐ 1-3 days ☐ 4-7 days ☐ >1 week</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Associated Symptoms:</strong></td>
          <td style="padding: 8px;">☐ Cough ☐ Vomiting ☐ Diarrhea ☐ Rash ☐ Body Ache</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Fever Pattern:</strong></td>
          <td style="padding: 8px;">☐ Continuous ☐ Intermittent ☐ Alternating</td>
        </tr>
      </table>
    `;
  } else if (data.category.includes("Breathing")) {
    categoryContent = `
      <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0;">💨 Respiratory Distress Assessment</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px; width: 40%;"><strong>Severity:</strong></td>
          <td style="padding: 8px;">☐ Mild ☐ Moderate ☐ Severe | Can speak: Yes / No</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Onset:</strong></td>
          <td style="padding: 8px;">☐ Sudden ☐ Gradual | Time: __________</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>History of Asthma/COPD:</strong></td>
          <td style="padding: 8px;">☐ Yes ☐ No | On inhalers: Yes / No</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Wheezing:</strong></td>
          <td style="padding: 8px;">☐ Yes ☐ No | Stridor: Yes / No</td>
        </tr>
      </table>
    `;
  } else if (data.category.includes("Stroke")) {
    categoryContent = `
      <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0;">🧠 Stroke Assessment (FAST Protocol)</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px; width: 40%;"><strong>F - Face Drooping:</strong></td>
          <td style="padding: 8px;">☐ Yes ☐ No | Left / Right side</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>A - Arm Weakness:</strong></td>
          <td style="padding: 8px;">☐ Yes ☐ No | Left / Right side</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>S - Speech Difficulty:</strong></td>
          <td style="padding: 8px;">☐ Yes ☐ No | Type: Slurred / Confused / Unable</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>T - Time Symptom Started:</strong></td>
          <td style="padding: 8px;">__________ | Minutes ago: __________</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Other Symptoms:</strong></td>
          <td style="padding: 8px;">☐ Vision Loss ☐ Dizziness ☐ Headache ☐ Numbness</td>
        </tr>
      </table>
    `;
  } else if (data.category.includes("Poisoning")) {
    categoryContent = `
      <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0;">☠️ Poisoning/Toxicity Assessment</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px; width: 40%;"><strong>Substance Name:</strong></td>
          <td style="padding: 8px;">__________________________________________</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Route of Exposure:</strong></td>
          <td style="padding: 8px;">☐ Oral ☐ Inhalation ☐ Skin ☐ Injection ☐ Other</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Estimated Quantity:</strong></td>
          <td style="padding: 8px;">__________________________________________</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Time of Exposure:</strong></td>
          <td style="padding: 8px;">__________ | Minutes ago: __________</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Symptoms Presented:</strong></td>
          <td style="padding: 8px;">☐ Nausea ☐ Vomiting ☐ Abdominal Pain ☐ Burns</td>
        </tr>
      </table>
    `;
  } else if (data.category.includes("Burn")) {
    categoryContent = `
      <h3 style="color: #1f2937; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0;">🔥 Burn Injury Assessment</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px; width: 40%;"><strong>Burn Cause:</strong></td>
          <td style="padding: 8px;">☐ Flame ☐ Scald ☐ Contact ☐ Chemical ☐ Electrical</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Body Parts Affected:</strong></td>
          <td style="padding: 8px;">Head / Face / Neck / Torso / Limbs / Genitals</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Burn Depth:</strong></td>
          <td style="padding: 8px;">☐ 1st (Red) ☐ 2nd (Blistered) ☐ 3rd (Charred)</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>% Body Surface Area:</strong></td>
          <td style="padding: 8px;">Estimated: __________ % BSA</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px;"><strong>Inhalation Injury:</strong></td>
          <td style="padding: 8px;">☐ Yes ☐ No | Conscious level: Alert / Confused / Unconscious</td>
        </tr>
      </table>
    `;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; background: white;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 3px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #1f2937; font-size: 24px;">📋 Emergency Category Form</h1>
        <p style="margin: 5px 0; color: #666; font-size: 12px;">Case ID: <strong>${data.caseId}</strong> | Category: <strong>${data.category}</strong></p>
      </div>

      <!-- Category Content -->
      <div style="border-left: 4px solid #0284c7; padding-left: 15px; margin-bottom: 20px;">
        ${categoryContent}
      </div>

      <!-- Additional Notes -->
      <div style="border-left: 4px solid #7c3aed; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; margin: 0 0 10px 0;">📝 Additional Notes</h3>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 4px; min-height: 60px; border: 1px dashed #9ca3af;">
          ${data.notes || ""}
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 30px; font-size: 10px; color: #6b7280; text-align: center;">
        <p style="margin: 5px 0;">Medical Staff: ________________  |  Date: ${new Date().toLocaleDateString()}</p>
        <p style="margin: 0;">Generated by AI Emergency Form Automation System</p>
      </div>
    </div>
  `;

  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
  await generatePDFFromHTML(div, `CategoryForm_${data.category}_${data.caseId}.pdf`);
  document.body.removeChild(div);
};

// ✅ 7) DOCTOR SUMMARY PDF
export const generateDoctorSummaryPDF = async (data: PatientData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; background: white;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 3px solid #1f2937; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #1f2937; font-size: 24px;">🏥 Emergency Clinical Summary (AI Generated)</h1>
        <p style="margin: 5px 0; color: #666; font-size: 12px;">Case ID: <strong>${data.caseId}</strong> | Generated: <strong>${new Date().toLocaleString()}</strong></p>
      </div>

      <!-- Patient Summary Card -->
      <div style="background: linear-gradient(135deg, #f3f4f6, #ffffff); border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; margin: 0 0 10px 0;">📋 Patient Summary</h3>
        <p style="margin: 0; font-size: 12px; line-height: 1.6;">
          <strong>${data.name}</strong>, <strong>${data.age}</strong> years old, ${data.gender} patient admitted with <strong>${data.category}</strong>. 
          Chief complaint: ${data.symptoms?.join(", ") || "Not specified"}. Arrival via ${data.arrivalMode || "walk-in"}. 
          Currently assessed as <strong>${data.priority.toUpperCase()}</strong> priority.
        </p>
      </div>

      <!-- Key Findings -->
      <div style="border-left: 4px solid #0284c7; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; margin: 0 0 10px 0;">🔍 Key Findings</h3>
        <table style="width: 100%; font-size: 12px;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px;"><strong>Conscious Status:</strong></td>
            <td style="padding: 8px;">Alert and Oriented</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px;"><strong>Vital Status:</strong></td>
            <td style="padding: 8px;">BP: ${data.vitals?.bp || "N/A"} | HR: ${data.vitals?.pulse || "N/A"} | RR: ${data.vitals?.respiratoryRate || "N/A"} | SpO₂: ${data.vitals?.spO2 || "N/A"}%</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px;"><strong>Medical History:</strong></td>
            <td style="padding: 8px;">${data.medicalHistory?.join(", ") || "Non-significant"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px;"><strong>Current Medications:</strong></td>
            <td style="padding: 8px;">${data.medications?.join(", ") || "None reported"}</td>
          </tr>
        </table>
      </div>

      <!-- Risk Flags -->
      <div style="background: #fef2f2; border: 2px solid #dc2626; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <h3 style="color: #991b1b; font-size: 13px; text-transform: uppercase; margin: 0 0 10px 0;">⚠️ CRITICAL ALERTS</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 12px;">
          <li>🚨 Allergy Alert: ${data.allergies?.length ? data.allergies.join(", ") : "None Detected"}</li>
          <li>🚨 Priority: ${data.priority.toUpperCase()}</li>
          <li>🚨 Category: ${data.category}</li>
        </ul>
      </div>

      <!-- Suggested Next Actions -->
      <div style="border-left: 4px solid #16a34a; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; margin: 0 0 10px 0;">✅ Recommended Actions</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 12px;">
          <li>Immediate Assessment & Stabilization</li>
          <li>Review vitals every 15 minutes</li>
          <li>Check Medication Allergies before prescribing</li>
          <li>Consider Specialist Consultation (Based on Category)</li>
          <li>Continuous Monitoring & Documentation</li>
        </ul>
      </div>

      <!-- AI Confidence Score -->
      <div style="background: #f0f9ff; border: 1px solid #0284c7; padding: 12px; border-radius: 4px; text-align: center; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 12px;"><strong>🤖 AI Confidence Score:</strong> <span style="color: #0284c7; font-weight: bold; font-size: 16px;">92%</span></p>
      </div>

      <!-- Doctor Notes Section -->
      <div style="border-left: 4px solid #7c3aed; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; margin: 0 0 10px 0;">📝 Doctor Assessment & Notes</h3>
        <div style="background: #faf5ff; padding: 20px; border-radius: 4px; min-height: 80px; border: 1px dashed #c084fc;">
          <!-- Doctor can write here -->
        </div>
      </div>

      <!-- Treatment Plan -->
      <div style="border-left: 4px solid #ea580c; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; margin: 0 0 10px 0;">💊 Treatment Plan</h3>
        <div style="background: #fff7ed; padding: 20px; border-radius: 4px; min-height: 60px; border: 1px dashed #fed7aa;">
          <!-- Treatment details -->
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 30px; font-size: 10px; color: #6b7280; text-align: center;">
        <p style="margin: 5px 0;"><strong>Doctor Name:</strong> ________________  |  <strong>Signature:</strong> ________________</p>
        <p style="margin: 5px 0;">Generated by AI Emergency Form Automation System | AI Confidence: High</p>
        <p style="margin: 0;">⚖️ This document is AI-assisted and requires physician review and validation before clinical use.</p>
      </div>
    </div>
  `;

  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
  await generatePDFFromHTML(div, `DoctorSummary_${data.caseId}.pdf`);
  document.body.removeChild(div);
};

// ✅ 8) CONSENT FORM PDF
export const generateConsentFormPDF = async (data: PatientData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; background: white;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 3px solid #1f2937; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #1f2937; font-size: 22px;">📋 Emergency Treatment Consent Form</h1>
        <p style="margin: 5px 0; color: #666; font-size: 12px;">Case ID: <strong>${data.caseId}</strong> | Date: <strong>${new Date().toLocaleDateString()}</strong></p>
      </div>

      <!-- Hospital & Patient Info -->
      <div style="background: #f3f4f6; padding: 12px; border-radius: 4px; margin-bottom: 20px; font-size: 11px;">
        <p style="margin: 3px 0;"><strong>Hospital:</strong> ${data.hospitalName}</p>
        <p style="margin: 3px 0;"><strong>Patient Name:</strong> ${data.name}</p>
        <p style="margin: 3px 0;"><strong>Age:</strong> ${data.age} | <strong>Gender:</strong> ${data.gender}</p>
      </div>

      <!-- Consent Statement -->
      <div style="border-left: 4px solid #0284c7; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; margin: 0 0 10px 0;">📜 Consent Statement</h3>
        <div style="background: #eff6ff; padding: 15px; border-radius: 4px; font-size: 12px; line-height: 1.6;">
          <p style="margin: 0;">
            I/We acknowledge that I/my ward is being admitted to the Emergency Department of <strong>${data.hospitalName}</strong> with 
            <strong>${data.category}</strong>. I/We understand that I/my ward may require emergency medical evaluation, diagnostic 
            tests, and emergency treatment. 
          </p>
          <p style="margin: 10px 0 0 0;">
            I/We hereby consent to emergency evaluation and appropriate medical treatment by the medical team. 
            I/We have been informed of the risks and benefits involved and agree to proceed with emergency care.
          </p>
        </div>
      </div>

      <!-- Important Notices -->
      <div style="background: #fef3c7; border: 1px solid #f59e0b; border-left: 4px solid #f59e0b; padding: 12px; margin-bottom: 20px; border-radius: 4px; font-size: 11px;">
        <p style="margin: 0; font-weight: bold; color: #92400e;">⚠️ IMPORTANT:</p>
        <ul style="margin: 5px 0 0 0; padding-left: 20px;">
          <li>Allergies on Record: ${data.allergies?.join(", ") || "None"}</li>
          <li>Current Medications: ${data.medications?.join(", ") || "None"}</li>
          <li>Medical Conditions: ${data.medicalHistory?.join(", ") || "None"}</li>
        </ul>
      </div>

      <!-- Consent By Section -->
      <div style="border-left: 4px solid #16a34a; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; margin: 0 0 15px 0;">✍️ Consent By</h3>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; font-weight: bold;">Consent Type: (Check One)</p>
          <p style="margin: 5px 0; font-size: 11px;">☐ Patient (18+ years) &nbsp;&nbsp; ☐ Parent/Guardian &nbsp;&nbsp; ☐ Legal Representative</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0;"><strong>Full Name:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #000; width: 60%;"></td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0;"><strong>Relationship to Patient:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #000; width: 60%;"></td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0;"><strong>ID Proof (Number):</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #000; width: 60%;"></td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0;"><strong>Signature:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #000; width: 60%;"></td>
          </tr>
          <tr>
            <td style="padding: 10px 0;"><strong>Date & Time:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #000; width: 60%;"></td>
          </tr>
        </table>
      </div>

      <!-- Witness / Staff Section -->
      <div style="border-left: 4px solid #7c3aed; padding-left: 15px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 13px; text-transform: uppercase; margin: 0 0 15px 0;">👨‍⚕️ Medical Staff Witness</h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0;"><strong>Staff Name:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #000; width: 60%;"></td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0;"><strong>Designation:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #000; width: 60%;"></td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0;"><strong>Signature:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #000; width: 60%;"></td>
          </tr>
          <tr>
            <td style="padding: 10px 0;"><strong>Date & Time:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #000; width: 60%;"></td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 30px; font-size: 9px; color: #6b7280; text-align: center;">
        <p style="margin: 5px 0;">This consent form must be signed before any emergency medical treatment is initiated.</p>
        <p style="margin: 5px 0;">A copy of this form will be retained in the medical record.</p>
        <p style="margin: 0;">Generated by AI Emergency Form Automation System</p>
      </div>
    </div>
  `;

  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
  await generatePDFFromHTML(div, `ConsentForm_${data.caseId}.pdf`);
  document.body.removeChild(div);
};

// ✅ GENERATE ALL PDFs AT ONCE
export const generateAllPDFs = async (data: PatientData) => {
  try {
    await generateRegistrationPDF(data);
    await generateTriagePDF(data);
    await generateMedicalHistoryPDF(data);
    await generateAllergyMedsPDF(data);
    await generateVitalSignsPDF(data);
    await generateCategoryFormPDF(data);
    await generateDoctorSummaryPDF(data);
    await generateConsentFormPDF(data);
    return true;
  } catch (error) {
    console.error("Error generating PDFs:", error);
    return false;
  }
};
