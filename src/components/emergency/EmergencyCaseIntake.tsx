"use client";

import { useState } from "react";
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
import {
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Phone,
  Ambulance,
  CheckCircle2,
  Zap,
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
      hospitalName,
      ward,
    });
  };

  const canSubmit = 
    (name.trim() !== "" || isAmbulanceMode) &&
    hospitalName.trim() !== "" &&
    ward.trim() !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute top-1/2 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl" 
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/30 to-orange-500/20 border border-red-500/50 rounded-full px-8 py-4 mb-6 backdrop-blur-sm shadow-lg shadow-red-500/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-6 h-6 text-red-400" />
            </motion.div>
            <span className="text-red-300 font-mono text-sm tracking-widest font-semibold">
              CASE ID: {caseId}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white mb-3 tracking-tight bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent"
          >
            Emergency Intake
          </motion.h1>
          <p className="text-slate-400 text-lg">Quick patient registration system</p>
        </motion.div>

        {/* Info Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {/* Location Card */}
          <motion.div 
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
            }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-blue-500/30 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md cursor-pointer transition-all hover:border-blue-500/60"
          >
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Location</p>
              <p className="text-base text-white font-bold mt-1 truncate">{hospitalName || "Enter hospital..."}</p>
            </div>
          </motion.div>

          {/* Ward Card */}
          <motion.div 
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(217, 119, 6, 0.3)"
            }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-amber-500/30 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md cursor-pointer transition-all hover:border-amber-500/60"
          >
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Ward</p>
              <p className="text-base text-white font-bold mt-1 truncate">{ward || "Enter ward..."}</p>
            </div>
          </motion.div>

          {/* Arrival Time Card */}
          <motion.div 
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)"
            }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-emerald-500/30 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md cursor-pointer transition-all hover:border-emerald-500/60"
          >
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Arrival Time</p>
              <p className="text-base text-white font-bold mt-1">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {priority !== "normal" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`mb-8 p-5 rounded-2xl border backdrop-blur-md ${
              priority === "critical"
                ? "bg-gradient-to-r from-red-500/30 to-red-600/20 border-red-500/60"
                : "bg-gradient-to-r from-amber-500/30 to-amber-600/20 border-amber-500/60"
            }`}
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className={`w-4 h-4 rounded-full ${
                  priority === "critical" ? "bg-red-500" : "bg-amber-500"
                } shadow-lg ${
                  priority === "critical" ? "shadow-red-500" : "shadow-amber-500"
                }`}
              />
              <span
                className={`font-bold text-xl tracking-wider ${
                  priority === "critical" ? "text-red-300" : "text-amber-300"
                }`}
              >
                {PRIORITY_CONFIG[priority].label.toUpperCase()} PRIORITY
              </span>
            </div>
          </motion.div>
        )}

        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <motion.div
              key={s}
              layoutId={`progress-${s}`}
              initial={{ scaleX: 0 }}
              animate={{ 
                scaleX: s <= step ? 1 : 0,
                opacity: s <= step ? 1 : 0.3
              }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              className={`h-1.5 flex-1 rounded-full origin-left transition-all duration-500 ${
                s <= step 
                  ? `${s === step ? "bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/50" : "bg-gradient-to-r from-red-600 to-red-500"}` 
                  : "bg-slate-700"
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
              className="space-y-6"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-8 tracking-tight"
              >
                Who is providing information?
              </motion.h2>
              <div className="grid grid-cols-3 gap-6">
                {PATIENT_TYPES.map((type, idx) => (
                  <motion.button
                    key={type.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePatientTypeSelect(type.value)}
                    className={`p-8 rounded-2xl border-2 transition-all backdrop-blur-sm group ${
                      patientType === type.value
                        ? "border-red-500 bg-gradient-to-br from-red-500/30 to-red-600/20 shadow-xl shadow-red-500/40"
                        : "border-slate-600 bg-slate-800/40 hover:border-red-400 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-red-500/20"
                    }`}
                  >
                    <span className="text-6xl mb-4 block group-hover:scale-110 transition-transform">{type.icon}</span>
                    <span className="text-white font-bold text-lg">{type.label}</span>
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
              className="space-y-6"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-8 tracking-tight"
              >
                How did the patient arrive?
              </motion.h2>
              <div className="grid grid-cols-2 gap-6">
                {ARRIVAL_MODES.map((mode, idx) => (
                  <motion.button
                    key={mode.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleArrivalModeSelect(mode.value)}
                    className={`p-8 rounded-2xl border-2 transition-all backdrop-blur-sm group ${
                      arrivalMode === mode.value
                        ? "border-red-500 bg-gradient-to-br from-red-500/30 to-red-600/20 shadow-xl shadow-red-500/40"
                        : `border-slate-600 bg-slate-800/40 hover:border-${mode.value === "ambulance" ? "red" : "green"}-400 hover:bg-slate-800/60`
                    } ${mode.value === "ambulance" ? "ring-2 ring-red-500/30" : ""}`}
                  >
                    <span className="text-6xl mb-4 block group-hover:scale-110 transition-transform">{mode.icon}</span>
                    <span className="text-white font-bold text-lg">{mode.label}</span>
                    {mode.value === "ambulance" && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-red-300 mt-3 font-semibold tracking-widest uppercase"
                      >
                        ⚡ Fast Track Mode
                      </motion.p>
                    )}
                  </motion.button>
                ))}
              </div>
              <motion.div
                whileHover={{ x: -5 }}
                className="pt-2"
              >
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-slate-300 transition-colors"
                >
                  ← Back
                </Button>
              </motion.div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-8 tracking-tight"
              >
                Select Emergency Type
              </motion.h2>
              <div className="grid grid-cols-3 gap-4">
                {EMERGENCY_CATEGORIES.map((cat, idx) => (
                  <motion.button
                    key={cat.value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`p-6 rounded-2xl border-2 transition-all backdrop-blur-sm group ${
                      category === cat.value
                        ? "border-red-500 bg-gradient-to-br from-red-500/30 to-red-600/20 shadow-xl shadow-red-500/40"
                        : "border-slate-600 bg-slate-800/40 hover:border-red-400 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-red-500/20"
                    }`}
                  >
                    <span className="text-5xl mb-3 block group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="text-white text-sm font-bold">{cat.label}</span>
                  </motion.button>
                ))}
              </div>
              <motion.div
                whileHover={{ x: -5 }}
                className="pt-2"
              >
                <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="text-slate-400 hover:text-slate-300 transition-colors"
                >
                  ← Back
                </Button>
              </motion.div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <motion.div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  Basic Patient Information
                </h2>
                {isAmbulanceMode && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-amber-300 font-semibold"
                  >
                    ⚡ Optional - Fast Track Mode
                  </motion.p>
                )}
              </motion.div>

              <div className="grid grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <Label className="text-slate-300 font-bold flex items-center gap-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-400" />
                    </div>
                    Hospital Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g., City General Hospital"
                    className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all backdrop-blur-sm rounded-xl"
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-3"
                >
                  <Label className="text-slate-300 font-bold flex items-center gap-2">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    </div>
                    Ward <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="e.g., Emergency Room - Ward A"
                    className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all backdrop-blur-sm rounded-xl"
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <Label className="text-slate-300 font-bold flex items-center gap-2">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <User className="w-4 h-4 text-green-400" />
                    </div>
                    Patient Name {!isAmbulanceMode && <span className="text-red-400">*</span>}
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter patient name"
                    className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 border-slate-600 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-all backdrop-blur-sm rounded-xl"
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-3"
                >
                  <Label className="text-slate-300 font-bold">Age</Label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age in years"
                    className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all backdrop-blur-sm rounded-xl"
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <Label className="text-slate-300 font-bold">Gender</Label>
                  <div className="flex gap-3">
                    {(["male", "female", "other"] as Gender[]).map((g) => (
                      <motion.button
                        key={g}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all border-2 ${
                          gender === g
                            ? "bg-gradient-to-r from-red-500 to-orange-500 border-red-400 text-white shadow-lg shadow-red-500/40"
                            : "bg-slate-800/50 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800/70"
                        }`}
                      >
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-3"
                >
                  <Label className="text-slate-300 font-bold flex items-center gap-2">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                      <Phone className="w-4 h-4 text-pink-400" />
                    </div>
                    Contact Phone
                  </Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 border-slate-600 text-white placeholder:text-slate-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all backdrop-blur-sm rounded-xl"
                  />
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 pt-6 border-t border-slate-700"
              >
                <motion.div whileHover={{ x: -5 }}>
                  <Button
                    variant="ghost"
                    onClick={() => setStep(3)}
                    className="text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    ← Back
                  </Button>
                </motion.div>
                <motion.button
                  whileHover={{ scale: canSubmit ? 1.02 : 1 }}
                  whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  className={`flex-1 h-14 text-lg font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    !canSubmit
                      ? "opacity-50 cursor-not-allowed bg-slate-700 text-slate-400"
                      : priority === "critical"
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/50"
                      : priority === "urgent"
                      ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-500/50"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/50"
                  }`}
                >
                  {isAmbulanceMode ? (
                    <>
                      <Ambulance className="w-5 h-5" />
                      Fast Track - Start Questions
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Continue to Questions
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
