"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EmergencyPDFGenerator from "@/components/emergency/EmergencyPDFGenerator";
import { PatientData } from "@/lib/pdf-templates";

const PDFGeneratorPage = () => {
  const [caseData, setCaseData] = useState<PatientData | null>(null);

  // Demo data - in real scenario, this would come from the case summary
  useEffect(() => {
    const demoData: PatientData = {
      caseId: "ER-2026-00012",
      name: "Rajesh Kumar",
      age: 45,
      gender: "Male",
      bloodGroup: "O+",
      phone: "+91-9876543210",
      address: "123 Main Street, City, State",
      hospitalName: "Emergency Care Hospital",
      ward: "ER-Unit-A",
      arrivalTime: new Date().toLocaleTimeString(),
      category: "Chest Pain",
      priority: "urgent",
      symptoms: ["Severe chest pain", "Shortness of breath", "Sweating"],
      allergies: ["Penicillin", "Aspirin"],
      medications: ["Metformin", "Enalapril"],
      medicalHistory: ["Hypertension", "Diabetes"],
      vitals: {
        bp: "160/95",
        pulse: "102",
        temperature: "98.6",
        respiratoryRate: "22",
        spO2: "94",
      },
      emergencyContact: {
        name: "Priya Kumar",
        relationship: "Wife",
        phone: "+91-9876543211",
      },
      arrivalMode: "Ambulance",
      broughtBy: "Ambulance",
      notes: "Patient brought with acute chest pain onset 30 minutes ago. Vitals show tachycardia and mild hypoxia.",
    };

    setCaseData(demoData);
  }, []);

  if (!caseData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin inline-block">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
          <p className="mt-4 text-white text-lg">Loading Case Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 px-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
          🏥 Emergency PDF Form System
        </h1>
        <p className="text-slate-600 text-lg">
          Generate Professional Healthcare Forms for Emergency Triage
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="px-4">
        <EmergencyPDFGenerator caseData={caseData} />
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 px-4 pb-8"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "📋",
              title: "8 Professional Forms",
              desc: "Complete emergency healthcare documentation",
            },
            {
              icon: "🎨",
              title: "Hackathon Design",
              desc: "Color-coded sections with icons & alerts",
            },
            {
              icon: "⚡",
              title: "One-Click Download",
              desc: "Generate all PDFs simultaneously",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + idx * 0.1 }}
              className="text-center p-6 bg-white rounded-lg shadow-md"
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PDFGeneratorPage;
