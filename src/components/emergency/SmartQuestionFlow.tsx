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
  Shield,
  Clock,
  FileText,
  Mic,
  Activity,
  Sparkles,
  Zap,
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
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Assessment Complete</h2>
          <p className="text-slate-400 text-lg">Processing your responses...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,88,12,0.08),transparent_50%)]" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      <div className="absolute top-1/4 left-10 w-64 h-64 bg-red-500/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="glass-card rounded-2xl px-5 py-3">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Case ID</span>
              <p className="text-sm font-mono text-red-400 font-bold">{caseId}</p>
            </div>
            <div className="glass-card rounded-2xl px-5 py-3">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Patient</span>
              <p className="text-sm text-white font-semibold">{patientName}</p>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl ${
              currentPriority === "critical"
                ? "status-critical"
                : currentPriority === "urgent"
                ? "status-urgent"
                : "status-normal"
            }`}
          >
            <div className={`w-3 h-3 rounded-full animate-pulse ${PRIORITY_CONFIG[currentPriority].bgColor}`} />
            <span className={`font-bold ${PRIORITY_CONFIG[currentPriority].color}`}>
              {PRIORITY_CONFIG[currentPriority].label}
            </span>
            <Activity className={`w-5 h-5 ${PRIORITY_CONFIG[currentPriority].color}`} />
          </motion.div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-6 mb-8"
        >
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/20">
              <span className="text-4xl">{categoryInfo?.icon}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{categoryInfo?.label} Assessment</h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-400">
                  Question <span className="text-white font-semibold">{currentQuestionIndex + 1}</span> of {activeQuestions.length}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  Voice enabled
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gradient">{Math.round(progress)}%</div>
              <span className="text-xs text-slate-500">Complete</span>
            </div>
          </div>

          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
            />
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {severityDetected && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-8 status-critical rounded-2xl p-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/30 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-red-300 font-bold text-lg">Priority Escalated</p>
                  <p className="text-red-400/80 text-sm">
                    Critical symptoms detected. Case has been upgraded to highest priority.
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-3xl p-8 mb-8"
        >
          <div className="flex items-start gap-4 mb-8">
            {currentQuestion.criticalFlag && (
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-white mb-2 leading-relaxed">
                {currentQuestion.text}
              </h3>
              {currentQuestion.required && (
                <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Required
                </span>
              )}
            </div>
          </div>

          {currentQuestion.type === "yes_no" && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleYesNo("Yes")}
                className="h-20 text-xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl shadow-lg shadow-emerald-500/30 transition-all"
              >
                Yes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleYesNo("No")}
                className="h-20 text-xl font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-2xl transition-all"
              >
                No
              </motion.button>
            </div>
          )}

          {currentQuestion.type === "select" && currentQuestion.options && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option, idx) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOption(option)}
                  className="h-auto py-5 px-5 text-left glass-card-light rounded-2xl text-white hover:ring-2 hover:ring-red-500/50 transition-all"
                >
                  {option}
                </motion.button>
              ))}
            </div>
          )}

          {currentQuestion.type === "multiple" && currentQuestion.options && (
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, idx) => (
                <motion.label
                  key={option}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all ${
                    selectedOptions.includes(option)
                      ? "ring-2 ring-red-500 bg-red-500/10"
                      : "glass-card-light hover:ring-1 hover:ring-slate-600"
                  }`}
                >
                  <Checkbox
                    checked={selectedOptions.includes(option)}
                    onCheckedChange={() => toggleOption(option)}
                    className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                  />
                  <span className="text-white text-lg">{option}</span>
                </motion.label>
              ))}
              <Button
                onClick={handleMultipleSelect}
                disabled={selectedOptions.length === 0}
                className="w-full mt-6 h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/30"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
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

          <div className="flex items-center justify-between pt-6 border-t border-slate-700/50 mt-8">
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2 glass-card-light px-3 py-2 rounded-xl">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>{responses.length} answered</span>
              </div>
              <div className="flex items-center gap-2 glass-card-light px-3 py-2 rounded-xl">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{activeQuestions.length - currentQuestionIndex - 1} remaining</span>
              </div>
            </div>

            {!currentQuestion.required && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip Question
              </Button>
            )}
          </div>
        </motion.div>

        {responses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-5"
          >
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Recent Answers</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {responses.slice(-3).map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between text-sm glass-card-light rounded-xl px-4 py-3"
                >
                  <span className="text-slate-400 truncate max-w-[60%]">{r.question}</span>
                  <span className="text-white font-semibold bg-slate-700/50 px-3 py-1 rounded-lg">{r.answer}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
