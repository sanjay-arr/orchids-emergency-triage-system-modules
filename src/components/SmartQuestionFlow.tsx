"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/use-translation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Zap,
  Volume2,
} from "lucide-react";

export interface Question {
  id: string;
  text: string;
  type: "multiple-choice" | "text" | "number" | "yes-no";
  options?: string[];
  placeholder?: string;
  priority: "low" | "medium" | "high";
}

interface SmartQuestionFlowProps {
  questions: Question[];
  onComplete: (responses: Record<string, string>) => void;
  onCancel?: () => void;
}

export function SmartQuestionFlow({
  questions,
  onComplete,
  onCancel,
}: SmartQuestionFlowProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [showTypedAnswer, setShowTypedAnswer] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (option: string) => {
    setResponses({
      ...responses,
      [currentQuestion.id]: option,
    });
    moveNext();
  };

  const handleTextSubmit = () => {
    if (inputValue.trim()) {
      setResponses({
        ...responses,
        [currentQuestion.id]: inputValue,
      });
      setInputValue("");
      setShowTypedAnswer(false);
      moveNext();
    }
  };

  const moveNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(responses);
    }
  };

  const movePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowTypedAnswer(false);
      setInputValue("");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-red-600";
      case "medium":
        return "from-amber-500 to-amber-600";
      default:
        return "from-emerald-500 to-emerald-600";
    }
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl min-h-screen flex flex-col justify-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">
              {t("questions_title")}
            </h1>
          </div>
          <p className="text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="h-1.5 bg-slate-700 rounded-full mb-8 overflow-hidden"
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full bg-gradient-to-r ${getPriorityColor(
              currentQuestion.priority
            )}`}
          />
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm mb-8"
          >
            {/* Priority Badge */}
            <div className="flex items-center justify-between mb-6">
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getPriorityColor(
                  currentQuestion.priority
                )}`}
              >
                {currentQuestion.priority.charAt(0).toUpperCase() +
                  currentQuestion.priority.slice(1)}{" "}
                Priority
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 20 }}
                whileTap={{ scale: 0.95 }}
                onClick={speakQuestion}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all"
                title="Speak question"
              >
                <Volume2 className="w-5 h-5 text-blue-400" />
              </motion.button>
            </div>

            {/* Question Text */}
            <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
              {currentQuestion.text}
            </h2>

            {/* Answer Options */}
            {currentQuestion.type === "multiple-choice" && !showTypedAnswer && (
              <div className="space-y-3 mb-6">
                {currentQuestion.options?.map((option, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full p-4 rounded-xl border-2 border-slate-600 bg-slate-800/50 text-white hover:border-purple-500 hover:bg-slate-800 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-500 group-hover:border-purple-500" />
                      <span className="font-medium">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Yes/No Buttons */}
            {currentQuestion.type === "yes-no" && !showTypedAnswer && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {["Yes", "No"].map((option, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOptionSelect(option)}
                    className={`p-4 rounded-xl font-bold text-lg transition-all ${
                      idx === 0
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    } text-white`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Text Input */}
            {(currentQuestion.type === "text" || showTypedAnswer) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 mb-6"
              >
                {currentQuestion.type === "number" ? (
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentQuestion.placeholder || "Enter number"}
                    className="bg-slate-800/50 border-slate-600 text-white h-12 text-lg"
                    autoFocus
                  />
                ) : (
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      currentQuestion.placeholder || t("questions_type_answer")
                    }
                    className="bg-slate-800/50 border-slate-600 text-white min-h-24"
                    autoFocus
                  />
                )}
              </motion.div>
            )}

            {/* Type Answer Button */}
            {currentQuestion.type === "multiple-choice" &&
              !showTypedAnswer && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setShowTypedAnswer(true)}
                  className="text-sm text-slate-400 hover:text-slate-300 flex items-center gap-2 transition-colors mb-6"
                >
                  <MessageSquare className="w-4 h-4" />
                  {t("questions_type_answer")}
                </motion.button>
              )}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={movePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-lg text-slate-300 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (showTypedAnswer || currentQuestion.type === "text") {
                handleTextSubmit();
              }
            }}
            disabled={
              (showTypedAnswer || currentQuestion.type === "text") &&
              !inputValue.trim()
            }
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
              (showTypedAnswer || currentQuestion.type === "text") &&
              !inputValue.trim()
                ? "opacity-50 cursor-not-allowed bg-slate-700"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            }`}
          >
            {currentIndex === questions.length - 1 ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {t("questions_complete")}
              </>
            ) : (
              <>
                {t("questions_next")}
                <Zap className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {onCancel && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="px-6 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              Cancel
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
