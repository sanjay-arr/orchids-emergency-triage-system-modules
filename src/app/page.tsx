"use client";

import { useState } from "react";
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

export default function EmergencyIntakeApp() {
  const [stage, setStage] = useState<AppStage>("intake");
  const [caseData, setCaseData] = useState<CaseData | null>(null);

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

  if (stage === "intake") {
    return <EmergencyCaseIntake onCaseCreated={handleCaseCreated} />;
  }

  if (stage === "questions" && caseData) {
    return (
      <SmartQuestionFlow
        caseId={caseData.caseId}
        category={caseData.category}
        priority={caseData.priority}
        patientName={caseData.patient.name}
        onComplete={handleQuestionsComplete}
        onPriorityEscalate={handlePriorityEscalate}
      />
    );
  }

  if (stage === "complete" && caseData) {
    return (
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
    );
  }

  return null;
}
