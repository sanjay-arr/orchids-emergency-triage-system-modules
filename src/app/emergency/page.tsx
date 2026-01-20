"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmergencyCaseIntake } from "@/components/emergency/EmergencyCaseIntake";
import { SmartQuestionFlow } from "@/components/emergency/SmartQuestionFlow";
import { CaseSummary } from "@/components/emergency/CaseSummary";
import {
  EmergencyCategory,
  PatientType,
  CasePriority,
  ArrivalMode,
  PatientInfo,
  QuestionResponse,
} from "@/lib/emergency-types";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";

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

export default function EmergencyPage() {
  const router = useRouter();
  const [stage, setStage] = useState<AppStage>("intake");
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("emergency_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
      const updatedCaseData = {
        ...caseData,
        responses,
      };
      setCaseData(updatedCaseData);
      
      const existingCases = JSON.parse(localStorage.getItem("emergency_cases") || "[]");
      existingCases.push({
        ...updatedCaseData,
        arrivalTime: updatedCaseData.arrivalTime.toISOString(),
        responses: updatedCaseData.responses.map(r => ({
          ...r,
          timestamp: r.timestamp.toISOString()
        }))
      });
      localStorage.setItem("emergency_cases", JSON.stringify(existingCases));
      
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

  const handleLogout = () => {
    localStorage.removeItem("emergency_user");
    router.push("/login");
  };

  const isStaff = user?.role === "doctor" || user?.role === "nurse" || user?.role === "admin";

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {isStaff && (
          <Link href="/dashboard">
            <Button variant="outline" className="glass-card border-slate-700 text-slate-300 hover:bg-slate-700">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        )}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="glass-card border-slate-700 text-slate-300 hover:bg-slate-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {stage === "intake" && (
        <EmergencyCaseIntake onCaseCreated={handleCaseCreated} />
      )}

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
