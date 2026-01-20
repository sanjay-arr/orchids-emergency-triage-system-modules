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
  Heart,
  Shield,
  Activity,
  ArrowRight,
  Sparkles,
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
  const [hospitalName] = useState("City General Hospital");
  const [ward] = useState("Emergency Room - Ward A");

  const isAmbulanceMode = arrivalMode === "ambulance";

  const handlePatientTypeSelect = (type: PatientType) => {
    setPatientType(type);
    setStep(2);
  };

  const handleArrivalModeSelect = (mode: ArrivalMode) => {
    setArrivalMode(mode);
    if (mode === "ambulance") {
      setPriority("critical");
    }
    setStep(3);
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

  const canSubmit = name.trim() !== "" || isAmbulanceMode;

  return (
    <div className="min-h-screen bg-[#0a0f1a] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(220,38,38,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,88,12,0.1),transparent_50%)]" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 rotate-3">
                <Heart className="w-10 h-10 text-white animate-heartbeat" />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 glass-card rounded-full px-6 py-3 mb-6"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-mono text-sm tracking-widest">
              CASE ID: {caseId}
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </motion.div>

          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Emergency <span className="text-gradient">Intake</span>
          </h1>
          <p className="text-slate-400 text-lg">Rapid patient registration and triage system</p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { icon: MapPin, label: "Location", value: hospitalName, color: "blue" },
            { icon: Shield, label: "Ward", value: ward, color: "amber" },
            { icon: Clock, label: "Arrival Time", value: new Date().toLocaleTimeString(), color: "emerald" },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="glass-card rounded-2xl p-4 flex items-center gap-4 card-hover"
            >
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 text-${item.color}-400`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-white font-semibold">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {priority !== "normal" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`mb-8 p-5 rounded-2xl ${
                priority === "critical" ? "status-critical" : "status-urgent"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full animate-pulse ${PRIORITY_CONFIG[priority].bgColor}`} />
                <div className="flex-1">
                  <span className={`font-bold text-xl ${PRIORITY_CONFIG[priority].color}`}>
                    {PRIORITY_CONFIG[priority].label.toUpperCase()} PRIORITY
                  </span>
                  <p className={`text-sm mt-1 ${priority === "critical" ? "text-red-300/70" : "text-amber-300/70"}`}>
                    {priority === "critical" ? "Immediate medical attention required" : "Urgent care needed"}
                  </p>
                </div>
                <Activity className={`w-8 h-8 ${PRIORITY_CONFIG[priority].color} animate-pulse`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`relative flex-1 h-1.5 rounded-full overflow-hidden ${s <= step ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-slate-800'}`}>
                  {s <= step && (
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '0%' }}
                      transition={{ duration: 0.5, delay: s * 0.1 }}
                      className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500"
                    />
                  )}
                </div>
                {s < 4 && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    s < step ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' : 
                    s === step ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500' : 
                    'bg-slate-800 text-slate-500'
                  }`}>
                    {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 px-1">
            <span>Info Source</span>
            <span>Arrival Mode</span>
            <span>Emergency Type</span>
            <span>Patient Details</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Who is providing information?</h2>
                <p className="text-slate-400">Select the person giving patient details</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {PATIENT_TYPES.map((type, idx) => (
                  <motion.button
                    key={type.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePatientTypeSelect(type.value)}
                    className={`relative p-8 rounded-3xl transition-all duration-300 ${
                      patientType === type.value
                        ? "glass-card ring-2 ring-red-500 shadow-lg shadow-red-500/20"
                        : "glass-card hover:ring-1 hover:ring-slate-600"
                    }`}
                  >
                    <div className="text-6xl mb-4">{type.icon}</div>
                    <span className="text-white font-semibold text-lg">{type.label}</span>
                    <div className={`absolute top-4 right-4 w-3 h-3 rounded-full transition-all ${
                      patientType === type.value ? 'bg-red-500' : 'bg-slate-700'
                    }`} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">How did the patient arrive?</h2>
                <p className="text-slate-400">Select the mode of arrival</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {ARRIVAL_MODES.map((mode, idx) => (
                  <motion.button
                    key={mode.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleArrivalModeSelect(mode.value)}
                    className={`relative p-8 rounded-3xl transition-all duration-300 ${
                      mode.value === "ambulance"
                        ? "glass-card ring-2 ring-red-500/50 bg-red-500/5"
                        : "glass-card"
                    } ${
                      arrivalMode === mode.value
                        ? "ring-2 ring-red-500 shadow-lg shadow-red-500/20"
                        : "hover:ring-1 hover:ring-slate-600"
                    }`}
                  >
                    {mode.value === "ambulance" && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 rounded-full text-xs text-white font-bold animate-pulse">
                        FAST TRACK
                      </div>
                    )}
                    <div className="text-6xl mb-4">{mode.icon}</div>
                    <span className="text-white font-semibold text-lg">{mode.label}</span>
                    {mode.value === "ambulance" && (
                      <p className="text-red-400 text-sm mt-2">Priority escalation enabled</p>
                    )}
                  </motion.button>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-slate-400 hover:text-white mt-6"
              >
                ← Back to previous step
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Select Emergency Type</h2>
                <p className="text-slate-400">Choose the primary reason for emergency</p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {EMERGENCY_CATEGORIES.map((cat, idx) => (
                  <motion.button
                    key={cat.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`relative p-5 rounded-2xl transition-all duration-300 ${
                      category === cat.value
                        ? "glass-card ring-2 ring-red-500 shadow-lg shadow-red-500/20"
                        : "glass-card hover:ring-1 hover:ring-slate-600"
                    }`}
                  >
                    <div className="text-4xl mb-3">{cat.icon}</div>
                    <span className="text-white text-sm font-medium block">{cat.label}</span>
                  </motion.button>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="text-slate-400 hover:text-white mt-6"
              >
                ← Back to previous step
              </Button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Patient Information
                  {isAmbulanceMode && (
                    <span className="ml-3 text-sm bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-normal">
                      Optional - Fast Track
                    </span>
                  )}
                </h2>
                <p className="text-slate-400">Enter basic patient details</p>
              </div>

              <div className="glass-card rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-slate-300 flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-blue-400" />
                      Patient Name {!isAmbulanceMode && <span className="text-red-400">*</span>}
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter patient name"
                      className="h-12 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-300 flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-purple-400" />
                      Age
                    </Label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age in years"
                      className="h-12 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-300 text-sm">Gender</Label>
                    <div className="flex gap-3">
                      {(["male", "female", "other"] as Gender[]).map((g) => (
                        <Button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`flex-1 h-12 rounded-xl font-medium transition-all duration-300 ${
                            gender === g
                              ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30"
                              : "bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50"
                          }`}
                        >
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-300 flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      Contact Phone
                    </Label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="h-12 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(3)}
                  className="text-slate-400 hover:text-white px-6"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`flex-1 h-16 text-lg font-bold rounded-2xl transition-all duration-300 ${
                    priority === "critical"
                      ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/40"
                      : priority === "urgent"
                      ? "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-500/40"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/40"
                  }`}
                >
                  {isAmbulanceMode ? (
                    <>
                      <Ambulance className="w-6 h-6 mr-3" />
                      Fast Track - Start Assessment
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-6 h-6 mr-3" />
                      Continue to Assessment
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
