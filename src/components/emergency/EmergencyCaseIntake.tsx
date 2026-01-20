"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EmergencyCategory,
  PatientType,
  ArrivalMode,
  Gender,
  CasePriority,
  EMERGENCY_CATEGORIES,
  PATIENT_TYPES,
  ARRIVAL_MODES,
  PRIORITY_CONFIG,
  generateCaseId,
  determinePriority,
  PatientInfo,
} from "@/lib/emergency-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Phone,
  Ambulance,
  CheckCircle2,
  Zap,
  Edit3,
  Building2,
  Heart,
  Activity,
} from "lucide-react";

interface EmergencyCaseIntakeProps {
  onCaseCreated: (caseData: {
    caseId: string;
    patientType: PatientType;
    category: EmergencyCategory;
    priority: CasePriority;
    arrivalMode: ArrivalMode;
    patient: PatientInfo;
    hospitalName: string;
    ward: string;
  }) => void;
}

export function EmergencyCaseIntake({ onCaseCreated }: EmergencyCaseIntakeProps) {
  const themeContext = useTheme();
  const langContext = useLanguage();
  const theme = themeContext?.theme ?? "dark";
  const language = langContext?.language ?? "en";
  const isDark = theme === "dark";

  const [step, setStep] = useState(1);
  const [caseId] = useState(() => generateCaseId());
  const [patientType, setPatientType] = useState<PatientType | null>(null);
  const [arrivalMode, setArrivalMode] = useState<ArrivalMode | null>(null);
  const [category, setCategory] = useState<EmergencyCategory | null>(null);
  const [priority, setPriority] = useState<CasePriority>("normal");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [phone, setPhone] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [ward, setWard] = useState("");
  const [arrivalTime, setArrivalTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const isAmbulanceMode = arrivalMode === "ambulance";

  const handlePatientTypeSelect = (type: PatientType) => {
    setPatientType(type);
    setStep(2);
  };

  const handleArrivalModeSelect = (mode: ArrivalMode) => {
    setArrivalMode(mode);
    if (mode === "ambulance") {
      setPriority("critical");
      setStep(3);
    } else {
      setStep(3);
    }
  };

  const handleCategorySelect = (cat: EmergencyCategory) => {
    setCategory(cat);
    const newPriority = determinePriority(cat, arrivalMode || "walk_in");
    setPriority(newPriority);
    setStep(4);
  };

  const handleSubmit = () => {
    if (!patientType || !category || !arrivalMode) return;

    onCaseCreated({
      caseId,
      patientType,
      category,
      priority,
      arrivalMode,
      patient: {
        name: name || "Unknown",
        age: age ? parseInt(age) : null,
        gender,
        phone: phone || undefined,
      },
      hospitalName: hospitalName || "Not specified",
      ward: ward || "Not specified",
    });
  };

  const canSubmit = name.trim() !== "" || isAmbulanceMode;

  return (
    <div className={`min-h-screen ${isDark ? "bg-gradient-to-br from-slate-900 via-red-950 to-slate-900" : "bg-gradient-to-br from-slate-50 via-rose-50 to-white"}`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-red-500/10" : "bg-red-200/40"}`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-orange-500/10" : "bg-orange-200/40"}`} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl pt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border ${isDark ? "bg-red-500/20 border-red-500/30" : "bg-red-100 border-red-200"}`}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-500"}`} />
              </motion.div>
              <span className={`font-mono text-sm tracking-wider ${isDark ? "text-red-300" : "text-red-600"}`}>
                CASE ID: {caseId}
              </span>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-full border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"}`}>
              <Activity className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-500"} animate-pulse`} />
              <span className={`font-mono text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                {formatElapsedTime(elapsedTime)}
              </span>
            </div>
          </div>
          <h1 className={`text-4xl font-bold mb-2 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            {language === "ta" ? "அவசர பதிவு" : language === "hi" ? "आपातकालीन प्रवेश" : "Emergency Intake"}
          </h1>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            {language === "ta" ? "விரைவான நோயாளி பதிவு அமைப்பு" : language === "hi" ? "त्वरित रोगी पंजीकरण प्रणाली" : "Quick patient registration system"}
          </p>
        </motion.div>

          <div className="grid grid-cols-3 gap-2 mb-8">
            <button
              onClick={() => setShowLocationEdit(true)}
              className={`rounded-lg p-3 flex items-center gap-3 transition-colors group text-left border ${
                isDark 
                  ? "bg-slate-800/50 border-slate-700 hover:border-blue-500/50"
                  : "bg-white border-slate-200 hover:border-blue-400"
              }`}
            >
              <MapPin className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-500"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Location</p>
                <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                  {hospitalName || <span className={`italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>Click to enter</span>}
                </p>
              </div>
              <Edit3 className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            </button>
            <button
              onClick={() => setShowLocationEdit(true)}
              className={`rounded-lg p-3 flex items-center gap-3 transition-colors group text-left border ${
                isDark 
                  ? "bg-slate-800/50 border-slate-700 hover:border-amber-500/50"
                  : "bg-white border-slate-200 hover:border-amber-400"
              }`}
            >
              <AlertTriangle className={`w-5 h-5 ${isDark ? "text-amber-400" : "text-amber-500"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Ward</p>
                <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                  {ward || <span className={`italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>Click to enter</span>}
                </p>
              </div>
              <Edit3 className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            </button>
            <button
              onClick={() => setShowLocationEdit(true)}
              className={`rounded-lg p-3 flex items-center gap-3 transition-colors group text-left border ${
                isDark 
                  ? "bg-slate-800/50 border-slate-700 hover:border-emerald-500/50"
                  : "bg-white border-slate-200 hover:border-emerald-400"
              }`}
            >
              <Clock className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Arrival Time</p>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{arrivalTime}</p>
              </div>
              <Edit3 className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            </button>
          </div>

          <AnimatePresence>
            {showLocationEdit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
                onClick={() => setShowLocationEdit(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    Location Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Hospital / Clinic Name
                      </Label>
                      <Input
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        placeholder="Enter hospital name"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        Ward / Department
                      </Label>
                      <Input
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        placeholder="e.g., Emergency Room - Ward A"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Arrival Time
                      </Label>
                      <Input
                        type="time"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="ghost"
                      onClick={() => setShowLocationEdit(false)}
                      className="flex-1 text-slate-400"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setShowLocationEdit(false)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        {priority !== "normal" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-6 p-4 rounded-lg border ${
              priority === "critical"
                ? "bg-red-500/20 border-red-500/50"
                : "bg-amber-500/20 border-amber-500/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${PRIORITY_CONFIG[priority].bgColor}`}
              />
              <span
                className={`font-bold text-lg ${PRIORITY_CONFIG[priority].color}`}
              >
                {PRIORITY_CONFIG[priority].label.toUpperCase()} PRIORITY
              </span>
            </div>
          </motion.div>
        )}

        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-red-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-white mb-6">
                Who is providing information?
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {PATIENT_TYPES.map((type) => (
                  <motion.button
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePatientTypeSelect(type.value)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      patientType === type.value
                        ? "border-red-500 bg-red-500/20"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-4xl mb-3 block">{type.icon}</span>
                    <span className="text-white font-medium">{type.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-white mb-6">
                How did the patient arrive?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {ARRIVAL_MODES.map((mode) => (
                  <motion.button
                    key={mode.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleArrivalModeSelect(mode.value)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      arrivalMode === mode.value
                        ? "border-red-500 bg-red-500/20"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    } ${mode.value === "ambulance" ? "ring-2 ring-red-500/50" : ""}`}
                  >
                    <span className="text-4xl mb-3 block">{mode.icon}</span>
                    <span className="text-white font-medium">{mode.label}</span>
                    {mode.value === "ambulance" && (
                      <p className="text-xs text-red-400 mt-2">Fast Track Mode</p>
                    )}
                  </motion.button>
                ))}
              </div>
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-slate-400 mt-4"
              >
                ← Back
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-white mb-6">
                Select Emergency Type
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {EMERGENCY_CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      category === cat.value
                        ? "border-red-500 bg-red-500/20"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{cat.icon}</span>
                    <span className="text-white text-sm font-medium">
                      {cat.label}
                    </span>
                  </motion.button>
                ))}
              </div>
              <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="text-slate-400 mt-4"
              >
                ← Back
              </Button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6">
                Basic Patient Information
                {isAmbulanceMode && (
                  <span className="ml-3 text-sm text-amber-400 font-normal">
                    (Optional - Fast Track)
                  </span>
                )}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    <User className="w-4 h-4 inline mr-2" />
                    Patient Name {!isAmbulanceMode && <span className="text-red-400">*</span>}
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter patient name"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Age</Label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age in years"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Gender</Label>
                  <div className="flex gap-2">
                    {(["male", "female", "other"] as Gender[]).map((g) => (
                      <Button
                        key={g}
                        type="button"
                        variant={gender === g ? "default" : "outline"}
                        onClick={() => setGender(g)}
                        className={`flex-1 ${
                          gender === g
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Contact Phone
                  </Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(3)}
                  className="text-slate-400"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`flex-1 h-14 text-lg font-semibold ${
                    priority === "critical"
                      ? "bg-red-600 hover:bg-red-700"
                      : priority === "urgent"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {isAmbulanceMode ? (
                    <>
                      <Ambulance className="w-5 h-5 mr-2" />
                      Fast Track - Start Questions
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Continue to Questions
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
