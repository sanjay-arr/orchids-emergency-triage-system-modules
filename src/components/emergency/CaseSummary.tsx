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
  const criticalResponses = responses.filter((r) =>
    r.answer.toLowerCase().includes("yes")
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Emergency Intake Complete
          </h1>
          <p className="text-slate-400">
            Case has been registered and is ready for medical review
          </p>
        </motion.div>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Case Information
              </h2>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  priority === "critical"
                    ? "bg-red-500/20 border-red-500/50"
                    : priority === "urgent"
                    ? "bg-amber-500/20 border-amber-500/50"
                    : "bg-emerald-500/20 border-emerald-500/50"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[priority].bgColor}`}
                />
                <span className={`font-semibold ${PRIORITY_CONFIG[priority].color}`}>
                  {PRIORITY_CONFIG[priority].label} Priority
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Case ID</p>
                <p className="text-lg font-mono text-red-400">{caseId}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Emergency Type</p>
                <p className="text-lg text-white flex items-center gap-2">
                  <span>{categoryInfo?.icon}</span>
                  {categoryInfo?.label}
                </p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Location</p>
                <p className="text-white">{hospitalName}</p>
                <p className="text-sm text-slate-400">{ward}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Arrival Time</p>
                <p className="text-white">
                  {arrivalTime.toLocaleTimeString()}
                </p>
                <p className="text-sm text-slate-400">
                  {arrivalTime.toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-slate-400" />
              Patient Information
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Name</p>
                <p className="text-white font-medium">{patient.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Age</p>
                <p className="text-white">{patient.age || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Gender</p>
                <p className="text-white capitalize">
                  {patient.gender || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Contact</p>
                <p className="text-white">{patient.phone || "Not provided"}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-slate-400" />
              Assessment Responses ({responses.length})
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {responses.map((response, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 rounded-lg p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm">{response.question}</p>
                    <p className="text-white font-medium mt-1">{response.answer}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {response.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <Button
              onClick={onNewCase}
              variant="outline"
              className="flex-1 h-14 bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              New Emergency Case
            </Button>
            <Button
              onClick={handlePrint}
              className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Summary
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
