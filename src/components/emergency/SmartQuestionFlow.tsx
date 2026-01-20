"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  CheckCircle2,
  SkipForward,
  Shield,
  Clock,
  FileText,
  Mic,
  MicOff,
  Activity,
  Sparkles,
  Zap,
  Volume2,
  Languages,
  Pause,
  Play,
} from "lucide-react";

interface SmartQuestionFlowProps {
  caseId: string;
  category: EmergencyCategory;
  priority: CasePriority;
  patientName: string;
  onComplete: (responses: QuestionResponse[]) => void;
  onPriorityEscalate?: (newPriority: CasePriority) => void;
}

const LANGUAGES = [
  { value: "en" as Language, label: "English", native: "English" },
  { value: "ta" as Language, label: "Tamil", native: "தமிழ்" },
  { value: "hi" as Language, label: "Hindi", native: "हिन्दी" },
];

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
  const [showLangSelector, setShowLangSelector] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSpokenQuestion, setHasSpokenQuestion] = useState(false);
  const [autoListenEnabled, setAutoListenEnabled] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const languageMap: Record<Language, string> = {
    en: "en-US",
    ta: "ta-IN",
    hi: "hi-IN",
  };

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

  const initRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageMap[language];

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript((prev) => (prev + " " + final).trim());
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening && !isPaused) {
        try {
          recognition.start();
        } catch {}
      }
    };

    return recognition;
  }, [language, isListening, isPaused]);

  useEffect(() => {
    synthRef.current = typeof window !== "undefined" ? window.speechSynthesis : null;
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    if (currentQuestion && !hasSpokenQuestion && autoListenEnabled) {
      speakQuestion(currentQuestion.text);
    }
  }, [currentQuestion, hasSpokenQuestion, autoListenEnabled]);

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

  const speakQuestion = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageMap[language];
    utterance.rate = 0.9;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setHasSpokenQuestion(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      if (autoListenEnabled && currentQuestion?.type === "text") {
        setTimeout(() => startListening(), 500);
      }
    };
    
    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setIsPaused(false);
      } catch {}
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsPaused(false);
  };

  const pauseListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsPaused(true);
  };

  const resumeListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {}
    }
    setIsPaused(false);
  };

  const handleAnswer = (answer: string, viaVoice: boolean) => {
    if (!currentQuestion) return;

    stopListening();

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
      setTranscript("");
      setInterimTranscript("");
      setHasSpokenQuestion(false);
    }
  };

  const handleVoiceConfirm = () => {
    if (transcript.trim()) {
      handleAnswer(transcript.trim(), true);
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
      stopListening();
      setSkippedQuestions((prev) => new Set(prev).add(currentQuestion.id));
      if (isLastQuestion) {
        onComplete(responses);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOptions([]);
        setTranscript("");
        setInterimTranscript("");
        setHasSpokenQuestion(false);
      }
    }
  };

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLangSelector(false);
    if (isListening) {
      stopListening();
      recognitionRef.current = null;
    }
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

          <div className="flex items-center gap-3">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLangSelector(!showLangSelector)}
                className="glass-card border-slate-700 text-slate-300 hover:bg-slate-700 rounded-xl"
              >
                <Languages className="w-4 h-4 mr-2 text-purple-400" />
                {LANGUAGES.find((l) => l.value === language)?.native}
              </Button>
              <AnimatePresence>
                {showLangSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 glass-card rounded-xl overflow-hidden z-20 min-w-[160px]"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => handleLanguageChange(lang.value)}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors ${
                          language === lang.value ? "bg-red-500/20 text-red-400" : "text-slate-300"
                        }`}
                      >
                        {lang.native}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
            </motion.div>
          </div>
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
                <span className={`flex items-center gap-1 ${autoListenEnabled ? "text-emerald-400" : "text-slate-500"}`}>
                  <Mic className="w-4 h-4" />
                  Voice {autoListenEnabled ? "ON" : "OFF"}
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
                  <p className="text-red-400/80 text-sm">Critical symptoms detected.</p>
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
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-semibold text-white leading-relaxed">
                  {currentQuestion.text}
                </h3>
                {isSpeaking && (
                  <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                    <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span className="text-xs text-blue-400">Speaking...</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {currentQuestion.required && (
                  <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Required
                  </span>
                )}
                <button
                  onClick={() => speakQuestion(currentQuestion.text)}
                  disabled={isSpeaking}
                  className="inline-flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full hover:bg-blue-500/20 transition-colors"
                >
                  <Volume2 className="w-3 h-3" />
                  Repeat Question
                </button>
              </div>
            </div>
          </div>

          {currentQuestion.type === "yes_no" && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleYesNo("Yes")}
                className="h-24 text-2xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl shadow-lg shadow-emerald-500/30 transition-all"
              >
                Yes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleYesNo("No")}
                className="h-24 text-2xl font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-2xl transition-all"
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
                  className="h-auto py-5 px-5 text-left glass-card-light rounded-2xl text-white hover:ring-2 hover:ring-red-500/50 transition-all text-lg"
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
            <div className="space-y-6">
              <div className="relative">
                <div
                  className={`min-h-[160px] p-6 rounded-3xl border-2 transition-all duration-300 ${
                    isListening
                      ? "border-red-500 bg-red-500/5 shadow-lg shadow-red-500/20"
                      : "border-slate-700 glass-card"
                  }`}
                >
                  {(transcript || interimTranscript) ? (
                    <p className="text-white text-xl leading-relaxed">
                      {transcript}
                      <span className="text-red-400/70 italic">{interimTranscript}</span>
                    </p>
                  ) : (
                    <p className="text-slate-500 text-xl">
                      {isListening ? "Listening... speak now" : "Click the microphone to answer"}
                    </p>
                  )}

                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-4 right-4 flex items-center gap-3 bg-red-500/20 px-4 py-2 rounded-full"
                    >
                      <div className="flex gap-1 items-end h-6">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [8, 24, 8] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                              ease: "easeInOut",
                            }}
                            className="w-1.5 bg-red-500 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-red-400 font-semibold">Recording...</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-6">
                {!isListening ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startListening}
                    className="relative h-24 w-24 rounded-full bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/40 flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                    <Mic className="w-12 h-12 text-white relative z-10" />
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isPaused ? resumeListening : pauseListening}
                      className="h-16 w-16 rounded-full glass-card border border-slate-700 flex items-center justify-center"
                    >
                      {isPaused ? (
                        <Play className="w-7 h-7 text-emerald-400" />
                      ) : (
                        <Pause className="w-7 h-7 text-amber-400" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={stopListening}
                      className="relative h-24 w-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 shadow-lg flex items-center justify-center"
                    >
                      <MicOff className="w-12 h-12 text-white" />
                    </motion.button>
                  </>
                )}
              </div>

              {transcript.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <Button
                    onClick={() => {
                      setTranscript("");
                      setInterimTranscript("");
                    }}
                    variant="outline"
                    className="flex-1 h-14 glass-card border-slate-700 text-slate-300 hover:bg-slate-700 rounded-2xl text-lg"
                  >
                    Clear & Retry
                  </Button>
                  <Button
                    onClick={handleVoiceConfirm}
                    className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/30"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Confirm Answer
                  </Button>
                </motion.div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-slate-700/50 mt-8">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2 glass-card-light px-3 py-2 rounded-xl">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>{responses.length} answered</span>
              </div>
              <div className="flex items-center gap-2 glass-card-light px-3 py-2 rounded-xl">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{activeQuestions.length - currentQuestionIndex - 1} left</span>
              </div>
            </div>

            {!currentQuestion.required && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
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
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {responses.slice(-4).map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between text-sm glass-card-light rounded-xl px-4 py-3"
                >
                  <span className="text-slate-400 truncate max-w-[55%]">{r.question}</span>
                  <div className="flex items-center gap-2">
                    {r.answeredVia === "voice" && <Mic className="w-3 h-3 text-red-400" />}
                    <span className="text-white font-semibold bg-slate-700/50 px-3 py-1 rounded-lg">{r.answer}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
