"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  generateAllPDFs,
  generateRegistrationPDF,
  generateTriagePDF,
  generateMedicalHistoryPDF,
  generateAllergyMedsPDF,
  generateVitalSignsPDF,
  generateCategoryFormPDF,
  generateDoctorSummaryPDF,
  generateConsentFormPDF,
  PatientData,
} from "@/lib/pdf-templates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PDFGeneratorProps {
  caseData: PatientData;
}

const pdfForms = [
  {
    id: "registration",
    title: "📋 Registration Form",
    description: "Patient Registration & Basic Info",
    icon: "🏥",
    color: "from-red-500 to-red-600",
  },
  {
    id: "triage",
    title: "🚨 Triage Assessment",
    description: "Priority & Risk Assessment",
    icon: "🎯",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "medical-history",
    title: "📝 Medical History",
    description: "Patient Medical Background",
    icon: "🏥",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "allergy-meds",
    title: "⚠️ Allergy & Meds",
    description: "CRITICAL Safety Information",
    icon: "💊",
    color: "from-red-600 to-red-700",
  },
  {
    id: "vital-signs",
    title: "📊 Vital Signs",
    description: "Patient Vital Monitoring",
    icon: "❤️",
    color: "from-green-500 to-green-600",
  },
  {
    id: "category-form",
    title: "📋 Category Form",
    description: "Specific Emergency Category",
    icon: "🔍",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "doctor-summary",
    title: "🏥 Doctor Summary",
    description: "AI-Generated Clinical Summary",
    icon: "📄",
    color: "from-slate-700 to-slate-800",
  },
  {
    id: "consent",
    title: "✍️ Consent Form",
    description: "Treatment Consent & Legal",
    icon: "📜",
    color: "from-indigo-500 to-indigo-600",
  },
];

const EmergencyPDFGenerator: React.FC<PDFGeneratorProps> = ({ caseData }) => {
  const [generating, setGenerating] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const handleGeneratePDF = async (formId: string) => {
    setGenerating(formId);
    try {
      switch (formId) {
        case "registration":
          await generateRegistrationPDF(caseData);
          break;
        case "triage":
          await generateTriagePDF(caseData);
          break;
        case "medical-history":
          await generateMedicalHistoryPDF(caseData);
          break;
        case "allergy-meds":
          await generateAllergyMedsPDF(caseData);
          break;
        case "vital-signs":
          await generateVitalSignsPDF(caseData);
          break;
        case "category-form":
          await generateCategoryFormPDF(caseData);
          break;
        case "doctor-summary":
          await generateDoctorSummaryPDF(caseData);
          break;
        case "consent":
          await generateConsentFormPDF(caseData);
          break;
        default:
          break;
      }
      setCompleted((prev) => new Set(prev).add(formId));
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerateAll = async () => {
    setGenerating("all");
    try {
      await generateAllPDFs(caseData);
      setCompleted(new Set(pdfForms.map((f) => f.id)));
    } catch (error) {
      console.error("Error generating all PDFs:", error);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          🏥 Emergency Form Generator
        </h2>
        <p className="text-slate-600">
          Case ID: <span className="font-bold text-red-600">{caseData.caseId}</span> | 
          Patient: <span className="font-bold">{caseData.name}</span>
        </p>
      </motion.div>

      {/* Generate All Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 flex gap-3"
      >
        <Button
          onClick={handleGenerateAll}
          disabled={generating !== null}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg"
        >
          {generating === "all" ? "⏳ Generating All..." : "⚡ Generate All PDFs"}
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">
            {completed.size} of {pdfForms.length} forms ready
          </span>
          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${(completed.size / pdfForms.length) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* PDF Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfForms.map((form, index) => (
          <motion.div
            key={form.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
              <div
                className={`bg-gradient-to-br ${form.color} p-6 text-white relative overflow-hidden`}
              >
                {/* Animated background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent" />
                </div>
                <div className="relative z-10">
                  <div className="text-4xl mb-2">{form.icon}</div>
                  <h3 className="text-lg font-bold mb-1">{form.title}</h3>
                  <p className="text-sm opacity-90">{form.description}</p>
                </div>
              </div>

              <div className="p-4">
                <motion.button
                  onClick={() => handleGeneratePDF(form.id)}
                  disabled={generating !== null}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    completed.has(form.id)
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200"
                  } ${generating === form.id ? "opacity-50 cursor-wait" : ""}`}
                  whileHover={{ scale: completed.has(form.id) ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {generating === form.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Generating...
                    </span>
                  ) : completed.has(form.id) ? (
                    <span className="flex items-center justify-center gap-2">
                      ✅ Generated
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      📥 Generate PDF
                    </span>
                  )}
                </motion.button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg"
      >
        <h4 className="font-bold text-blue-900 mb-2">📌 PDF Generator Features</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ 8 Professional Healthcare Forms</li>
          <li>✅ Hackathon-level Design with Color-Coded Sections</li>
          <li>✅ Auto-Populated Patient Data</li>
          <li>✅ Risk Alerts & Critical Warnings</li>
          <li>✅ Category-Specific Assessment Forms</li>
          <li>✅ AI-Generated Doctor Summary</li>
          <li>✅ Legal Consent Forms with Signatures</li>
          <li>✅ Download All at Once or Individually</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default EmergencyPDFGenerator;
