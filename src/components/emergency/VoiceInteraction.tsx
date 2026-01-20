"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, LANGUAGES } from "@/lib/emergency-types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  MicOff,
  Pause,
  Play,
  Volume2,
  Languages,
  AlertCircle,
  RefreshCw,
  Keyboard,
  Check,
  Waves,
} from "lucide-react";

interface VoiceInteractionProps {
  onTranscript: (text: string, viaVoice: boolean) => void;
  placeholder?: string;
  confirmationText?: string;
  autoStart?: boolean;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function VoiceInteraction({
  onTranscript,
  placeholder = "Speak or type your answer...",
  confirmationText,
  autoStart = false,
  language = "en",
  onLanguageChange,
}: VoiceInteractionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTextMode, setIsTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [showLangSelector, setShowLangSelector] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const languageMap: Record<Language, string> = {
    en: "en-US",
    ta: "ta-IN",
    hi: "hi-IN",
  };

  const initRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageMap[selectedLang];

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
        setTranscript((prev) => prev + " " + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else if (event.error === "audio-capture") {
        setError("Microphone not found. Please check your device.");
      } else if (event.error === "not-allowed") {
        setError("Microphone access denied. Please enable permissions.");
      } else {
        setError(`Error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening && !isPaused) {
        recognition.start();
      }
    };

    return recognition;
  }, [selectedLang, isListening, isPaused]);

  useEffect(() => {
    recognitionRef.current = initRecognition();
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [initRecognition]);

  useEffect(() => {
    if (autoStart && !isTextMode) {
      startListening();
    }
  }, [autoStart, isTextMode]);

  const startListening = () => {
    setError(null);
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setIsPaused(false);
      } catch {
        setError("Failed to start voice recognition");
      }
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
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsPaused(true);
  };

  const resumeListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
    setIsPaused(false);
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageMap[selectedLang];
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const handleConfirm = () => {
    const finalText = isTextMode ? textInput : transcript.trim();
    if (finalText) {
      if (confirmationText) {
        speakText(`You said: ${finalText}`);
      }
      onTranscript(finalText, !isTextMode);
      setTranscript("");
      setTextInput("");
      setInterimTranscript("");
    }
  };

  const handleRetry = () => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
    if (!isTextMode) {
      startListening();
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
    onLanguageChange?.(lang);
    setShowLangSelector(false);
    if (recognitionRef.current && isListening) {
      stopListening();
      setTimeout(() => {
        recognitionRef.current = initRecognition();
        startListening();
      }, 100);
    }
  };

  const toggleInputMode = () => {
    if (!isTextMode) {
      stopListening();
    }
    setIsTextMode(!isTextMode);
    setTranscript("");
    setTextInput("");
    setInterimTranscript("");
  };

  const currentText = isTextMode ? textInput : transcript + interimTranscript;

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLangSelector(!showLangSelector)}
            className="glass-card border-slate-700 text-slate-300 hover:bg-slate-700 rounded-xl px-4"
          >
            <Languages className="w-4 h-4 mr-2 text-purple-400" />
            {LANGUAGES.find((l) => l.value === selectedLang)?.native}
          </Button>
          <AnimatePresence>
            {showLangSelector && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 glass-card rounded-xl overflow-hidden z-10 min-w-[180px]"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleLanguageChange(lang.value)}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors flex items-center justify-between ${
                      selectedLang === lang.value
                        ? "bg-red-500/20 text-red-400"
                        : "text-slate-300"
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-xs text-slate-500">({lang.label})</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleInputMode}
          className="glass-card border-slate-700 text-slate-300 hover:bg-slate-700 rounded-xl px-4"
        >
          {isTextMode ? (
            <>
              <Mic className="w-4 h-4 mr-2 text-red-400" />
              Voice Mode
            </>
          ) : (
            <>
              <Keyboard className="w-4 h-4 mr-2 text-blue-400" />
              Text Mode
            </>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="status-critical rounded-2xl p-4 flex items-center gap-4"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 text-sm flex-1">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {isTextMode ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={placeholder}
            className="min-h-[140px] glass-card border-slate-700 text-white placeholder:text-slate-500 resize-none rounded-2xl text-lg p-5 focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
          />
          <Button
            onClick={handleConfirm}
            disabled={!textInput.trim()}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/30"
          >
            <Check className="w-5 h-5 mr-2" />
            Submit Answer
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="relative">
            <div
              className={`min-h-[140px] p-6 rounded-3xl border-2 transition-all duration-300 ${
                isListening
                  ? "border-red-500 bg-red-500/5 shadow-lg shadow-red-500/20"
                  : "border-slate-700 glass-card"
              }`}
            >
              {currentText ? (
                <p className="text-white text-lg leading-relaxed">
                  {transcript}
                  <span className="text-red-400/70 italic">{interimTranscript}</span>
                </p>
              ) : (
                <p className="text-slate-500 text-lg">{placeholder}</p>
              )}

              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-4 right-4 flex items-center gap-3 bg-red-500/20 px-4 py-2 rounded-full"
                >
                  <div className="flex gap-1 items-end h-5">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: [8, 20, 8],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }}
                        className="w-1 bg-red-500 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-red-400 font-medium">Listening...</span>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-5">
            {!isListening ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startListening}
                className="relative h-20 w-20 rounded-full bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/40 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                <Mic className="w-10 h-10 text-white relative z-10" />
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isPaused ? resumeListening : pauseListening}
                  className="h-14 w-14 rounded-full glass-card border border-slate-700 flex items-center justify-center"
                >
                  {isPaused ? (
                    <Play className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Pause className="w-6 h-6 text-amber-400" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopListening}
                  className="relative h-20 w-20 rounded-full bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/40 flex items-center justify-center"
                >
                  <MicOff className="w-10 h-10 text-white" />
                </motion.button>
              </>
            )}

            {currentText && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => speakText(currentText)}
                disabled={isSpeaking}
                className="h-14 w-14 rounded-full glass-card border border-slate-700 flex items-center justify-center"
              >
                <Volume2
                  className={`w-6 h-6 ${
                    isSpeaking ? "text-blue-400 animate-pulse" : "text-slate-400"
                  }`}
                />
              </motion.button>
            )}
          </div>

          {transcript.trim() && !isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <Button
                onClick={handleRetry}
                variant="outline"
                className="flex-1 h-14 glass-card border-slate-700 text-slate-300 hover:bg-slate-700 rounded-2xl"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Re-record
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/30"
              >
                <Check className="w-5 h-5 mr-2" />
                Confirm
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
