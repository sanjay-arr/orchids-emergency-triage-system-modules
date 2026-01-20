"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  CasePriority,
  QuestionResponse,
  PRIORITY_CONFIG,
  PatientInfo,
  EmergencyCategory,
  EMERGENCY_CATEGORIES,
} from "@/lib/emergency-types";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Printer,
  FileText,
  User,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Download,
  Activity,
  MapPin,
  Phone,
  Share2,
  Sparkles,
  Loader2,
  FileCheck,
  Stethoscope,
  Pill,
  Ambulance,
  ClipboardList,
} from "lucide-react";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const EmergencyIntakeForm = dynamic(
  () => import("./PDFForms").then((mod) => mod.EmergencyIntakeForm),
  { ssr: false }
);

const TriageAssessmentForm = dynamic(
  () => import("./PDFForms").then((mod) => mod.TriageAssessmentForm),
  { ssr: false }
);

const AllergyMedicationForm = dynamic(
  () => import("./PDFForms").then((mod) => mod.AllergyMedicationForm),
  { ssr: false }
);

const AccidentSymptomForm = dynamic(
  () => import("./PDFForms").then((mod) => mod.AccidentSymptomForm),
  { ssr: false }
);

const DoctorSummaryForm = dynamic(
  () => import("./PDFForms").then((mod) => mod.DoctorSummaryForm),
  { ssr: false }
);

interface CaseSummaryProps {
  caseId: string;
  priority: CasePriority;
  category: EmergencyCategory;
  patient: PatientInfo;
  hospitalName: string;
  ward: string;
  arrivalTime: Date;
  responses: QuestionResponse[];
  onNewCase: () => void;
}

interface FormType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  component: React.ComponentType<{ data: FormData }>;
}

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

export function CaseSummary({
  caseId,
  priority,
  category,
  patient,
  hospitalName,
  ward,
  arrivalTime,
  responses,
  onNewCase,
}: CaseSummaryProps) {
  const [isClient, setIsClient] = useState(false);
  
  useState(() => {
    setIsClient(true);
  });

  const categoryInfo = EMERGENCY_CATEGORIES.find((c) => c.value === category);
  
  const formData: FormData = {
    caseId,
    patient,
    category,
    priority,
    hospitalName,
    ward,
    arrivalTime,
    responses,
  };

  const FORM_TYPES: FormType[] = [
    {
      id: "intake",
      name: "Emergency Intake Form",
      description: "Initial patient registration",
      icon: ClipboardList,
      color: "from-red-500 to-orange-500",
      component: EmergencyIntakeForm,
    },
    {
      id: "triage",
      name: "Triage Assessment Form",
      description: "Priority & vital signs",
      icon: Activity,
      color: "from-amber-500 to-yellow-500",
      component: TriageAssessmentForm,
    },
    {
      id: "allergy",
      name: "Allergy & Medication Form",
      description: "Allergies & current meds",
      icon: Pill,
      color: "from-pink-500 to-rose-500",
      component: AllergyMedicationForm,
    },
    {
      id: "accident",
      name: "Accident/Symptom Form",
      description: "Incident details & injuries",
      icon: Ambulance,
      color: "from-blue-500 to-cyan-500",
      component: AccidentSymptomForm,
    },
    {
      id: "doctor",
      name: "Doctor Summary Form",
      description: "Clinical summary for review",
      icon: Stethoscope,
      color: "from-emerald-500 to-teal-500",
      component: DoctorSummaryForm,
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.1),transparent_50%)]" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/30 rotate-3">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-6 py-2 mb-4"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Successfully Registered</span>
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-3">
            Emergency Intake <span className="text-gradient-blue">Complete</span>
          </h1>
          <p className="text-slate-400 text-lg">Download hospital-ready PDF forms below</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Case Details</h2>
              <div className={`px-4 py-2 rounded-xl ${
                priority === "critical" ? "status-critical" :
                priority === "urgent" ? "status-urgent" : "status-normal"
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${PRIORITY_CONFIG[priority].bgColor}`} />
                  <span className={`text-sm font-bold ${PRIORITY_CONFIG[priority].color}`}>
                    {PRIORITY_CONFIG[priority].label}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-card-light rounded-2xl p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Case ID</p>
                <p className="text-xl font-mono text-red-400 font-bold">{caseId}</p>
              </div>

              <div className="glass-card-light rounded-2xl p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Emergency Type</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{categoryInfo?.icon}</span>
                  <span className="text-white font-semibold">{categoryInfo?.label}</span>
                </div>
              </div>

              <div className="glass-card-light rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
                </div>
                <p className="text-white font-semibold">{hospitalName}</p>
                <p className="text-slate-400 text-sm">{ward}</p>
              </div>

              <div className="glass-card-light rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Arrival</p>
                </div>
                <p className="text-white font-semibold">{arrivalTime.toLocaleTimeString()}</p>
                <p className="text-slate-400 text-sm">{arrivalTime.toLocaleDateString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card rounded-3xl p-6"
          >
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-blue-400" />
              Patient Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                <span className="text-slate-400">Name</span>
                <span className="text-white font-semibold">{patient.name}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                <span className="text-slate-400">Age</span>
                <span className="text-white">{patient.age || "—"} years</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                <span className="text-slate-400">Gender</span>
                <span className="text-white capitalize">{patient.gender || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact
                </span>
                <span className="text-white">{patient.phone || "—"}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <FileText className="w-4 h-4" />
                <span>{responses.length} questions answered</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Activity className="w-4 h-4" />
                <span>{responses.filter(r => r.answeredVia === "voice").length} via voice</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl p-6"
          >
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Key Findings
            </h2>

            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {responses.filter(r => r.answer !== "No" && r.answer.toLowerCase() !== "none").slice(0, 6).map((response, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="glass-card-light rounded-xl p-3"
                >
                  <p className="text-slate-400 text-xs mb-1">{response.question}</p>
                  <p className="text-white font-medium text-sm">{response.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Download className="w-6 h-6 text-emerald-400" />
              Download Hospital Forms (PDF)
            </h2>
            <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
              5 forms available
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {FORM_TYPES.map((form, idx) => {
              const FormComponent = form.component;
              return (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="glass-card-light rounded-2xl p-4 flex flex-col"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${form.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <form.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{form.name}</h3>
                  <p className="text-slate-400 text-xs mb-4 flex-1">{form.description}</p>
                  
                  {typeof window !== 'undefined' && (
                    <PDFDownloadLink
                      document={<FormComponent data={formData} />}
                      fileName={`${form.id}-${caseId}.pdf`}
                    >
                      {({ loading }) => (
                        <button
                          disabled={loading}
                          className={`w-full py-2 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                            loading
                              ? "bg-slate-700 text-slate-400 cursor-wait"
                              : `bg-gradient-to-r ${form.color} text-white hover:opacity-90 shadow-lg`
                          }`}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Download
                            </>
                          )}
                        </button>
                      )}
                    </PDFDownloadLink>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <Button
            onClick={onNewCase}
            variant="outline"
            className="h-16 glass-card border-slate-700 text-white hover:bg-slate-800 rounded-2xl flex flex-col items-center justify-center gap-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs">New Case</span>
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            className="h-16 glass-card border-slate-700 text-white hover:bg-slate-800 rounded-2xl flex flex-col items-center justify-center gap-1"
          >
            <Printer className="w-5 h-5" />
            <span className="text-xs">Print Page</span>
          </Button>
          <Button
            className="h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/30 flex flex-col items-center justify-center gap-1"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Send to Staff</span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="status-normal rounded-2xl p-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-emerald-300 font-bold">Ready for Medical Team</p>
              <p className="text-emerald-400/70 text-sm">
                All forms have been generated with collected data. Download and print as needed.
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
