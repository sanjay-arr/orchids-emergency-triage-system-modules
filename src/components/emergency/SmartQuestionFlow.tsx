"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EmergencyCategory,
  CasePriority,
  Language,
  QuestionResponse,
  PRIORITY_CONFIG,
  EMERGENCY_CATEGORIES,
} from "@/lib/emergency-types";
import { EmergencyQuestion, getQuestionsForCategory, shouldShowFollowUp, EMERGENCY_QUESTIONS } from "@/lib/emergency-questions";
import { VoiceInteraction } from "./VoiceInteraction";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  CheckCircle2,
  SkipForward,
  ChevronRight,
  Shield,
  Clock,
  FileText,
} from "lucide-react";

interface SmartQuestionFlowProps {
  caseId: string;
  category: EmergencyCategory;
  priority: CasePriority;
  patientName: string;
  onComplete: (responses: QuestionResponse[]) => void;
  onPriorityEscalate?: (newPriority: CasePriority) => void;
}

export function SmartQuestionFlow({
  caseId,
  category,
  priority,
  patientName,
  onComplete,
  onPriorityEscalate,
}: SmartQuestionFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(new Set());
  const [followUpQueue, setFollowUpQueue] = useState<string[]>([]);
  const [currentPriority, setCurrentPriority] = useState(priority);
  const [language, setLanguage] = useState<Language>("en");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [severityDetected, setSeverityDetected] = useState(false);

  const questions = useMemo(() => getQuestionsForCategory(category), [category]);

  const activeQuestions = useMemo(() => {
    const baseQuestions = questions.filter(
      (q) => !skippedQuestions.has(q.id) && !followUpQueue.includes(q.id)
    );
    const followUps = followUpQueue
      .map((id) => EMERGENCY_QUESTIONS.find((q) => q.id === id))
      .filter(Boolean) as EmergencyQuestion[];
    return [...baseQuestions, ...followUps];
  }, [questions, skippedQuestions, followUpQueue]);

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / activeQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex >= activeQuestions.length - 1;

  const categoryInfo = EMERGENCY_CATEGORIES.find((c) => c.value === category);

  useEffect(() => {
    if (responses.length >= 3 && !severityDetected) {
      const criticalResponses = responses.filter((r) => {
        const q = EMERGENCY_QUESTIONS.find((q) => q.id === r.questionId);
        return q?.criticalFlag && r.answer.toLowerCase().includes("yes");
      });

      if (criticalResponses.length >= 2 && currentPriority !== "critical") {
        setCurrentPriority("critical");
        setSeverityDetected(true);
        onPriorityEscalate?.("critical");
      }
    }
  }, [responses, currentPriority, severityDetected, onPriorityEscalate]);

  const handleAnswer = (answer: string, viaVoice: boolean) => {
    if (!currentQuestion) return;

    const response: QuestionResponse = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      answer,
      answeredVia: viaVoice ? "voice" : "text",
      timestamp: new Date(),
    };

    setResponses((prev) => [...prev, response]);

    const followUpId = shouldShowFollowUp(currentQuestion, answer);
    if (followUpId) {
      setFollowUpQueue((prev) => [...prev, followUpId]);
    }

    if (isLastQuestion) {
      onComplete([...responses, response]);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptions([]);
    }
  };

  const handleYesNo = (answer: "Yes" | "No") => {
    handleAnswer(answer, false);
  };

  const handleSelectOption = (option: string) => {
    handleAnswer(option, false);
  };

  const handleMultipleSelect = () => {
    if (selectedOptions.length > 0) {
      handleAnswer(selectedOptions.join(", "), false);
    }
  };

  const handleSkip = () => {
    if (!currentQuestion?.required) {
      setSkippedQuestions((prev) => new Set(prev).add(currentQuestion.id));
      if (isLastQuestion) {
        onComplete(responses);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOptions([]);
      }
    }
  };

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">All Questions Completed</h2>
          <p className="text-slate-400">Processing responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
              <span className="text-xs text-slate-500">Case</span>
              <p className="text-sm font-mono text-red-400">{caseId}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
              <span className="text-xs text-slate-500">Patient</span>
              <p className="text-sm text-white font-medium">{patientName}</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              currentPriority === "critical"
                ? "bg-red-500/20 border-red-500/50"
                : currentPriority === "urgent"
                ? "bg-amber-500/20 border-amber-500/50"
                : "bg-emerald-500/20 border-emerald-500/50"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${PRIORITY_CONFIG[currentPriority].bgColor}`}
            />
            <span className={`font-semibold ${PRIORITY_CONFIG[currentPriority].color}`}>
              {PRIORITY_CONFIG[currentPriority].label}
            </span>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{categoryInfo?.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-white">{categoryInfo?.label} Assessment</h2>
              <p className="text-slate-400 text-sm">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </p>
            </div>
          </div>

          <Progress value={progress} className="h-2 bg-slate-700" />
        </div>

        <AnimatePresence mode="wait">
          {severityDetected && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3"
            >
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-red-300 font-semibold">Severity Escalated</p>
                <p className="text-red-400/80 text-sm">
                  Critical symptoms detected. Priority upgraded automatically.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-start gap-3 mb-6">
            {currentQuestion.criticalFlag && (
              <Shield className="w-5 h-5 text-red-400 mt-1 shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="text-xl font-medium text-white mb-2">
                {currentQuestion.text}
              </h3>
              {currentQuestion.required && (
                <span className="text-xs text-red-400">* Required</span>
              )}
            </div>
          </div>

          {currentQuestion.type === "yes_no" && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                onClick={() => handleYesNo("Yes")}
                className="h-16 text-lg bg-emerald-600 hover:bg-emerald-700"
              >
                Yes
              </Button>
              <Button
                onClick={() => handleYesNo("No")}
                className="h-16 text-lg bg-slate-700 hover:bg-slate-600"
              >
                No
              </Button>
            </div>
          )}

          {currentQuestion.type === "select" && currentQuestion.options && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  variant="outline"
                  className="h-auto py-4 px-4 text-left bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700 hover:border-red-500/50"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {currentQuestion.type === "multiple" && currentQuestion.options && (
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedOptions.includes(option)
                      ? "border-red-500 bg-red-500/20"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                  }`}
                >
                  <Checkbox
                    checked={selectedOptions.includes(option)}
                    onCheckedChange={() => toggleOption(option)}
                  />
                  <span className="text-white">{option}</span>
                </label>
              ))}
              <Button
                onClick={handleMultipleSelect}
                disabled={selectedOptions.length === 0}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm Selection ({selectedOptions.length})
              </Button>
            </div>
          )}

          {currentQuestion.type === "text" && (
            <VoiceInteraction
              onTranscript={handleAnswer}
              placeholder="Speak or type your answer..."
              language={language}
              onLanguageChange={setLanguage}
            />
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-700 mt-6">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {responses.length} answered
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {activeQuestions.length - currentQuestionIndex - 1} remaining
              </div>
            </div>

            {!currentQuestion.required && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-slate-400 hover:text-white"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip Question
              </Button>
            )}
          </div>
        </motion.div>

        {responses.length > 0 && (
          <div className="mt-6 bg-slate-800/30 border border-slate-700 rounded-xl p-4">
            <h4 className="text-sm font-medium text-slate-400 mb-3">Recent Answers</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {responses.slice(-3).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm bg-slate-800/50 rounded-lg px-3 py-2"
                >
                  <span className="text-slate-400 truncate max-w-[60%]">{r.question}</span>
                  <span className="text-white font-medium">{r.answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
