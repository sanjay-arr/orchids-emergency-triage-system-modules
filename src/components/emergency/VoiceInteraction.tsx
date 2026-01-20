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
  const [isConfirming, setIsConfirming] = useState(false);
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
      setIsConfirming(false);
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
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLangSelector(!showLangSelector)}
            className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <Languages className="w-4 h-4 mr-2" />
            {LANGUAGES.find((l) => l.value === selectedLang)?.native}
          </Button>
          <AnimatePresence>
            {showLangSelector && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-10"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleLanguageChange(lang.value)}
                    className={`w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors ${
                      selectedLang === lang.value
                        ? "bg-red-500/20 text-red-400"
                        : "text-slate-300"
                    }`}
                  >
                    {lang.native} ({lang.label})
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
          className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700"
        >
          {isTextMode ? (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Switch to Voice
            </>
          ) : (
            <>
              <Keyboard className="w-4 h-4 mr-2" />
              Switch to Text
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
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {isTextMode ? (
        <div className="space-y-3">
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
          />
          <Button
            onClick={handleConfirm}
            disabled={!textInput.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Submit Answer
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <div
              className={`min-h-[100px] p-4 rounded-xl border-2 transition-all ${
                isListening
                  ? "border-red-500 bg-red-500/10"
                  : "border-slate-700 bg-slate-800/50"
              }`}
            >
              {currentText ? (
                <p className="text-white">
                  {transcript}
                  <span className="text-slate-400 italic">{interimTranscript}</span>
                </p>
              ) : (
                <p className="text-slate-500">{placeholder}</p>
              )}

              {isListening && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: [12, 24, 12],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                        className="w-1 bg-red-500 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-red-400">Listening...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            {!isListening ? (
              <Button
                onClick={startListening}
                className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700"
              >
                <Mic className="w-8 h-8" />
              </Button>
            ) : (
              <>
                <Button
                  onClick={isPaused ? resumeListening : pauseListening}
                  variant="outline"
                  className="h-12 w-12 rounded-full bg-slate-800/50 border-slate-700"
                >
                  {isPaused ? (
                    <Play className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Pause className="w-5 h-5 text-amber-400" />
                  )}
                </Button>
                <Button
                  onClick={stopListening}
                  className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700"
                >
                  <MicOff className="w-8 h-8" />
                </Button>
              </>
            )}

            {currentText && (
              <Button
                onClick={() => speakText(currentText)}
                variant="outline"
                disabled={isSpeaking}
                className="h-12 w-12 rounded-full bg-slate-800/50 border-slate-700"
              >
                <Volume2
                  className={`w-5 h-5 ${
                    isSpeaking ? "text-blue-400 animate-pulse" : "text-slate-400"
                  }`}
                />
              </Button>
            )}
          </div>

          {transcript.trim() && !isListening && (
            <div className="flex gap-3">
              <Button
                onClick={handleRetry}
                variant="outline"
                className="flex-1 bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-record
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
