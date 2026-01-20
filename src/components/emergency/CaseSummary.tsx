"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";

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
  const categoryInfo = EMERGENCY_CATEGORIES.find((c) => c.value === category);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `
EMERGENCY CASE SUMMARY
======================
Case ID: ${caseId}
Priority: ${PRIORITY_CONFIG[priority].label}
Emergency Type: ${categoryInfo?.label}

PATIENT INFORMATION
-------------------
Name: ${patient.name}
Age: ${patient.age || 'Not provided'}
Gender: ${patient.gender || 'Not provided'}
Contact: ${patient.phone || 'Not provided'}

LOCATION
--------
Hospital: ${hospitalName}
Ward: ${ward}
Arrival: ${arrivalTime.toLocaleString()}

ASSESSMENT RESPONSES
--------------------
${responses.map((r) => `Q: ${r.question}\nA: ${r.answer}\n`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emergency-case-${caseId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
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
          <p className="text-slate-400 text-lg">Case is ready for medical review</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-3xl p-6"
            >
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-blue-400" />
                Patient Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Name</span>
                  <span className="text-white font-semibold">{patient.name}</span>
                </div>
                <div className="h-px bg-slate-700/50" />
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Age</span>
                  <span className="text-white">{patient.age || "—"}</span>
                </div>
                <div className="h-px bg-slate-700/50" />
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Gender</span>
                  <span className="text-white capitalize">{patient.gender || "—"}</span>
                </div>
                <div className="h-px bg-slate-700/50" />
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact
                  </span>
                  <span className="text-white">{patient.phone || "—"}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Assessment Responses
                </h2>
                <span className="text-sm text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
                  {responses.length} answers
                </span>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {responses.map((response, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="glass-card-light rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-slate-400 text-sm mb-2">{response.question}</p>
                        <p className="text-white font-semibold text-lg">{response.answer}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-2 py-1 rounded-lg ${
                          response.answeredVia === 'voice' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {response.answeredVia}
                        </span>
                        <span className="text-xs text-slate-500">
                          {response.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4"
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
                onClick={handleDownload}
                variant="outline"
                className="h-16 glass-card border-slate-700 text-white hover:bg-slate-800 rounded-2xl flex flex-col items-center justify-center gap-1"
              >
                <Download className="w-5 h-5" />
                <span className="text-xs">Download</span>
              </Button>
              <Button
                onClick={handlePrint}
                className="h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/30 flex flex-col items-center justify-center gap-1"
              >
                <Printer className="w-5 h-5" />
                <span className="text-xs">Print</span>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="status-normal rounded-2xl p-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-emerald-300 font-bold">Ready for Medical Team</p>
                  <p className="text-emerald-400/70 text-sm">
                    This case is now visible to doctors and nurses on duty
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
