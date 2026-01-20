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

  const canSubmit = name.trim() !== "" || isAmbulanceMode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-red-500/20 border border-red-500/30 rounded-full px-6 py-3 mb-4">
            <Zap className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-red-300 font-mono text-sm tracking-wider">
              CASE ID: {caseId}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Emergency Intake
          </h1>
          <p className="text-slate-400">Quick patient registration system</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xs text-slate-500">Location</p>
              <p className="text-sm text-white font-medium">{hospitalName}</p>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-xs text-slate-500">Ward</p>
              <p className="text-sm text-white font-medium">{ward}</p>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-500">Arrival Time</p>
              <p className="text-sm text-white font-medium">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

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
