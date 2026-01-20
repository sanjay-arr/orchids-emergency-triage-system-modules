"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmergencyCaseIntake } from "@/components/emergency/EmergencyCaseIntake";
import { SmartQuestionFlow } from "@/components/emergency/SmartQuestionFlow";
import { CaseSummary } from "@/components/emergency/CaseSummary";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/emergency-types";
import {
  EmergencyCategory,
  PatientType,
  CasePriority,
  ArrivalMode,
  PatientInfo,
  QuestionResponse,
} from "@/lib/emergency-types";
import { ArrowLeft, Sun, Moon, Globe, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AppStage = "intake" | "questions" | "complete";

interface CaseData {
  caseId: string;
  patientType: PatientType;
  category: EmergencyCategory;
  priority: CasePriority;
  arrivalMode: ArrivalMode;
  patient: PatientInfo;
  hospitalName: string;
  ward: string;
  arrivalTime: Date;
  responses: QuestionResponse[];
}

export default function EmergencyIntakePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const [stage, setStage] = useState<AppStage>("intake");
  const [caseData, setCaseData] = useState<CaseData | null>(null);

  const isDark = theme === "dark";

  const handleCaseCreated = (data: {
    caseId: string;
    patientType: PatientType;
    category: EmergencyCategory;
    priority: CasePriority;
    arrivalMode: ArrivalMode;
    patient: PatientInfo;
    hospitalName: string;
    ward: string;
  }) => {
    setCaseData({
      ...data,
      arrivalTime: new Date(),
      responses: [],
    });
    setStage("questions");
  };

  const handleQuestionsComplete = (responses: QuestionResponse[]) => {
    if (caseData) {
      setCaseData({
        ...caseData,
        responses,
      });
      setStage("complete");
    }
  };

  const handlePriorityEscalate = (newPriority: CasePriority) => {
    if (caseData) {
      setCaseData({
        ...caseData,
        priority: newPriority,
      });
    }
  };

  const handleNewCase = () => {
    setCaseData(null);
    setStage("intake");
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className={`${
            isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? "bg-red-500/20" : "bg-red-100"}`}>
            <Heart className={`w-4 h-4 ${isDark ? "text-red-400" : "text-red-500"}`} />
          </div>
          <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>MedEmergency</span>
        </div>
      </div>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className={`p-2 rounded-lg transition-all ${
              isDark
                ? "bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700"
                : "bg-white/80 hover:bg-white text-slate-800 border border-slate-200 shadow"
            }`}
          >
            <Globe className="w-5 h-5" />
          </button>
          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute right-0 mt-2 rounded-xl overflow-hidden shadow-xl ${
                  isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
                }`}
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      setLanguage(lang.value);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      language === lang.value
                        ? isDark ? "bg-red-500/20 text-red-400" : "bg-red-50 text-red-600"
                        : isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="font-medium">{lang.native}</span>
                    <span className="text-xs opacity-60">{lang.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all ${
            isDark
              ? "bg-slate-800/80 hover:bg-slate-700 text-yellow-400 border border-slate-700"
              : "bg-white/80 hover:bg-white text-slate-800 border border-slate-200 shadow"
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {stage === "intake" && <EmergencyCaseIntake onCaseCreated={handleCaseCreated} />}

      {stage === "questions" && caseData && (
        <SmartQuestionFlow
          caseId={caseData.caseId}
          category={caseData.category}
          priority={caseData.priority}
          patientName={caseData.patient.name}
          onComplete={handleQuestionsComplete}
          onPriorityEscalate={handlePriorityEscalate}
        />
      )}

      {stage === "complete" && caseData && (
        <CaseSummary
          caseId={caseData.caseId}
          priority={caseData.priority}
          category={caseData.category}
          patient={caseData.patient}
          hospitalName={caseData.hospitalName}
          ward={caseData.ward}
          arrivalTime={caseData.arrivalTime}
          responses={caseData.responses}
          onNewCase={handleNewCase}
        />
      )}
    </div>
  );
}
