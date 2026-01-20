"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EmergencyCategory,
  CasePriority,
  QuestionResponse,
  PRIORITY_CONFIG,
  EMERGENCY_CATEGORIES,
} from "@/lib/emergency-types";
import { EmergencyQuestion, getQuestionsForCategory, shouldShowFollowUp, EMERGENCY_QUESTIONS } from "@/lib/emergency-questions";
import { VoiceInteraction } from "./VoiceInteraction";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import {
  AlertTriangle,
  CheckCircle2,
  SkipForward,
  Shield,
  Clock,
  FileText,
  Keyboard,
  Mic,
  Send,
  Type,
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
  const { language, t, getQuestionText } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(new Set());
  const [followUpQueue, setFollowUpQueue] = useState<string[]>([]);
  const [currentPriority, setCurrentPriority] = useState(priority);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [severityDetected, setSeverityDetected] = useState(false);
  const [inputMode, setInputMode] = useState<"buttons" | "text" | "voice">("buttons");
  const [textInput, setTextInput] = useState("");

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

  const translatedQuestionText = currentQuestion
    ? getQuestionText(currentQuestion.id, currentQuestion.text)
    : "";

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
      question: translatedQuestionText,
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
      setTextInput("");
      setInputMode("buttons");
    }
  };

  const handleYesNo = (answer: "Yes" | "No") => {
    const translatedAnswer = language === "ta" 
      ? (answer === "Yes" ? "ஆம்" : "இல்லை")
      : language === "hi"
      ? (answer === "Yes" ? "हाँ" : "नहीं")
      : answer;
    handleAnswer(translatedAnswer, false);
  };

  const handleSelectOption = (option: string) => {
    handleAnswer(option, false);
  };

  const handleMultipleSelect = () => {
    if (selectedOptions.length > 0) {
      handleAnswer(selectedOptions.join(", "), false);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleAnswer(textInput.trim(), false);
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
        setTextInput("");
        setInputMode("buttons");
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
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            {language === "ta" ? "அனைத்து கேள்விகளும் முடிந்தது" : language === "hi" ? "सभी प्रश्न पूर्ण" : "All Questions Completed"}
          </h2>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            {language === "ta" ? "பதில்களை செயலாக்குகிறது..." : language === "hi" ? "प्रतिक्रियाएं संसाधित हो रही हैं..." : "Processing responses..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gradient-to-br from-slate-900 via-red-950 to-slate-900" : "bg-gradient-to-br from-slate-50 via-rose-50 to-white"}`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-red-500/10" : "bg-red-200/40"}`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-orange-500/10" : "bg-orange-200/40"}`} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl pt-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"}`}>
              <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Case</span>
              <p className="text-sm font-mono text-red-400">{caseId}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"}`}>
              <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Patient</span>
              <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{patientName}</p>
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
            <div className={`w-2 h-2 rounded-full animate-pulse ${PRIORITY_CONFIG[currentPriority].bgColor}`} />
            <span className={`font-semibold ${PRIORITY_CONFIG[currentPriority].color}`}>
              {PRIORITY_CONFIG[currentPriority].label}
            </span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border mb-6 ${isDark ? "bg-slate-800/30 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{categoryInfo?.icon}</span>
            <div>
              <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                {categoryInfo?.label} {language === "ta" ? "மதிப்பீடு" : language === "hi" ? "मूल्यांकन" : "Assessment"}
              </h2>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {language === "ta" ? `கேள்வி ${currentQuestionIndex + 1} / ${activeQuestions.length}` : 
                 language === "hi" ? `प्रश्न ${currentQuestionIndex + 1} / ${activeQuestions.length}` :
                 `Question ${currentQuestionIndex + 1} of ${activeQuestions.length}`}
              </p>
            </div>
          </div>
          <Progress value={progress} className={`h-2 ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
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
                <p className="text-red-300 font-semibold">
                  {language === "ta" ? "தீவிரம் அதிகரிக்கப்பட்டது" : language === "hi" ? "गंभीरता बढ़ी" : "Severity Escalated"}
                </p>
                <p className="text-red-400/80 text-sm">
                  {language === "ta" ? "முக்கியமான அறிகுறிகள் கண்டறியப்பட்டன. முன்னுரிமை தானாக மேம்படுத்தப்பட்டது." : 
                   language === "hi" ? "गंभीर लक्षण पाए गए। प्राथमिकता स्वचालित रूप से बढ़ाई गई।" :
                   "Critical symptoms detected. Priority upgraded automatically."}
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
          className={`p-6 rounded-xl border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}
        >
          <div className="flex items-start gap-3 mb-6">
            {currentQuestion.criticalFlag && (
              <Shield className="w-5 h-5 text-red-400 mt-1 shrink-0" />
            )}
            <div className="flex-1">
              <h3 className={`text-xl font-medium mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                {translatedQuestionText}
              </h3>
              {currentQuestion.required && (
                <span className="text-xs text-red-400">* {t("required") || "Required"}</span>
              )}
            </div>
          </div>

          <div className={`flex gap-2 mb-6 p-1 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}>
            <button
              onClick={() => setInputMode("buttons")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                inputMode === "buttons"
                  ? isDark ? "bg-slate-600 text-white" : "bg-white text-slate-900 shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {language === "ta" ? "தேர்வுகள்" : language === "hi" ? "विकल्प" : "Options"}
            </button>
            <button
              onClick={() => setInputMode("text")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                inputMode === "text"
                  ? isDark ? "bg-slate-600 text-white" : "bg-white text-slate-900 shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Type className="w-4 h-4" />
              {language === "ta" ? "தட்டச்சு" : language === "hi" ? "टाइप करें" : "Type"}
            </button>
            <button
              onClick={() => setInputMode("voice")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                inputMode === "voice"
                  ? isDark ? "bg-slate-600 text-white" : "bg-white text-slate-900 shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Mic className="w-4 h-4" />
              {language === "ta" ? "பேச்சு" : language === "hi" ? "बोलें" : "Voice"}
            </button>
          </div>

          {inputMode === "buttons" && (
            <>
              {currentQuestion.type === "yes_no" && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    onClick={() => handleYesNo("Yes")}
                    className="h-16 text-lg bg-emerald-600 hover:bg-emerald-700"
                  >
                    {t("yes")}
                  </Button>
                  <Button
                    onClick={() => handleYesNo("No")}
                    className={`h-16 text-lg ${isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300 text-slate-900"}`}
                  >
                    {t("no")}
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
                      className={`h-auto py-4 px-4 text-left ${
                        isDark 
                          ? "bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700 hover:border-red-500/50"
                          : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-red-500"
                      }`}
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
                          : isDark 
                            ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                            : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <Checkbox
                        checked={selectedOptions.includes(option)}
                        onCheckedChange={() => toggleOption(option)}
                      />
                      <span className={isDark ? "text-white" : "text-slate-900"}>{option}</span>
                    </label>
                  ))}
                  <Button
                    onClick={handleMultipleSelect}
                    disabled={selectedOptions.length === 0}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t("submit")} ({selectedOptions.length})
                  </Button>
                </div>
              )}

              {currentQuestion.type === "text" && (
                <div className="space-y-4 mb-6">
                  <Textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={t("type_your_answer")}
                    className={`min-h-[100px] ${
                      isDark 
                        ? "bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                  <Button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {t("submit")}
                  </Button>
                </div>
              )}
            </>
          )}

          {inputMode === "text" && (
            <div className="space-y-4 mb-6">
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={t("type_your_answer")}
                className={`min-h-[120px] ${
                  isDark 
                    ? "bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                }`}
              />
              <Button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {t("submit")}
              </Button>
            </div>
          )}

          {inputMode === "voice" && (
            <VoiceInteraction
              onTranscript={handleAnswer}
              placeholder={t("speak_or_type")}
              language={language}
              onLanguageChange={() => {}}
            />
          )}

          <div className={`flex items-center justify-between pt-4 border-t mt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
            <div className={`flex items-center gap-4 text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {responses.length} {language === "ta" ? "பதில்கள்" : language === "hi" ? "उत्तर" : "answered"}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {activeQuestions.length - currentQuestionIndex - 1} {language === "ta" ? "மீதமுள்ளவை" : language === "hi" ? "शेष" : "remaining"}
              </div>
            </div>

            {!currentQuestion.required && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className={isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}
              >
                <SkipForward className="w-4 h-4 mr-2" />
                {t("skip")}
              </Button>
            )}
          </div>
        </motion.div>

        {responses.length > 0 && (
          <div className={`mt-6 p-4 rounded-xl border ${isDark ? "bg-slate-800/30 border-slate-700" : "bg-white border-slate-200"}`}>
            <h4 className={`text-sm font-medium mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {language === "ta" ? "சமீபத்திய பதில்கள்" : language === "hi" ? "हाल के उत्तर" : "Recent Answers"}
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {responses.slice(-3).map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between text-sm rounded-lg px-3 py-2 ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}
                >
                  <span className={`truncate max-w-[60%] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{r.question}</span>
                  <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{r.answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
