"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  LogOut,
  MessageSquare,
  Mic,
  Pill,
  RefreshCw,
  Search,
  Send,
  Share2,
  Stethoscope,
  User,
  Users,
  X,
  Zap,
  Filter,
  ChevronRight,
  Phone,
  MapPin,
} from "lucide-react";

type TriageStatus = "waiting" | "in_triage" | "under_treatment" | "observation" | "discharged";
type CasePriority = "normal" | "urgent" | "critical";

interface EmergencyCase {
  id: string;
  patientName: string;
  age: number | null;
  gender: string | null;
  category: string;
  categoryIcon: string;
  priority: CasePriority;
  status: TriageStatus;
  arrivalTime: Date;
  chiefComplaint: string;
  allergies: string[];
  medications: string[];
  symptoms: string[];
  vitals?: {
    bp?: string;
    pulse?: string;
    temp?: string;
    spo2?: string;
  };
  notes: { author: string; text: string; time: Date }[];
  tasks: { id: string; task: string; completed: boolean }[];
}

const STATUS_CONFIG: Record<TriageStatus, { label: string; color: string; bgColor: string }> = {
  waiting: { label: "Waiting", color: "text-amber-400", bgColor: "bg-amber-500/20" },
  in_triage: { label: "In Triage", color: "text-blue-400", bgColor: "bg-blue-500/20" },
  under_treatment: { label: "Under Treatment", color: "text-purple-400", bgColor: "bg-purple-500/20" },
  observation: { label: "Observation", color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
  discharged: { label: "Discharged", color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
};

const PRIORITY_CONFIG: Record<CasePriority, { label: string; color: string; bgColor: string }> = {
  normal: { label: "Normal", color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  urgent: { label: "Urgent", color: "text-amber-400", bgColor: "bg-amber-500/20" },
  critical: { label: "Critical", color: "text-red-400", bgColor: "bg-red-500/20" },
};

const DEMO_CASES: EmergencyCase[] = [
  {
    id: "ER-ABC123",
    patientName: "Rajesh Kumar",
    age: 45,
    gender: "male",
    category: "Chest Pain",
    categoryIcon: "❤️",
    priority: "critical",
    status: "under_treatment",
    arrivalTime: new Date(Date.now() - 30 * 60000),
    chiefComplaint: "Severe chest pain radiating to left arm",
    allergies: ["Penicillin"],
    medications: ["Aspirin", "Metoprolol"],
    symptoms: ["Chest pain", "Shortness of breath", "Sweating"],
    vitals: { bp: "160/95", pulse: "98", temp: "98.6°F", spo2: "94%" },
    notes: [{ author: "Dr. Sharma", text: "ECG shows ST elevation. Cardiology consulted.", time: new Date() }],
    tasks: [
      { id: "1", task: "12-lead ECG", completed: true },
      { id: "2", task: "IV access established", completed: true },
      { id: "3", task: "Troponin levels", completed: false },
      { id: "4", task: "Chest X-ray", completed: false },
    ],
  },
  {
    id: "ER-DEF456",
    patientName: "Priya Sharma",
    age: 28,
    gender: "female",
    category: "Accident",
    categoryIcon: "🚗",
    priority: "urgent",
    status: "in_triage",
    arrivalTime: new Date(Date.now() - 15 * 60000),
    chiefComplaint: "Road traffic accident - multiple injuries",
    allergies: [],
    medications: [],
    symptoms: ["Head injury", "Arm pain", "Abrasions"],
    vitals: { bp: "130/85", pulse: "88", temp: "98.2°F", spo2: "98%" },
    notes: [],
    tasks: [
      { id: "1", task: "Check vital signs", completed: true },
      { id: "2", task: "CT Head", completed: false },
      { id: "3", task: "X-ray arm", completed: false },
    ],
  },
  {
    id: "ER-GHI789",
    patientName: "Mohammed Ali",
    age: 62,
    gender: "male",
    category: "Breathing",
    categoryIcon: "🫁",
    priority: "critical",
    status: "waiting",
    arrivalTime: new Date(Date.now() - 5 * 60000),
    chiefComplaint: "Severe breathing difficulty",
    allergies: ["Sulfa drugs"],
    medications: ["Salbutamol inhaler"],
    symptoms: ["Breathlessness", "Wheezing", "Cough"],
    notes: [],
    tasks: [],
  },
];

const DEPARTMENTS = [
  { id: "lab", name: "Laboratory", icon: "🧪" },
  { id: "radiology", name: "Radiology", icon: "📷" },
  { id: "icu", name: "ICU", icon: "🏥" },
  { id: "cardiology", name: "Cardiology", icon: "❤️" },
  { id: "neurology", name: "Neurology", icon: "🧠" },
  { id: "pharmacy", name: "Pharmacy", icon: "💊" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [cases, setCases] = useState<EmergencyCase[]>(DEMO_CASES);
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);
  const [filterStatus, setFilterStatus] = useState<TriageStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<CasePriority | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("emergency_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const filteredCases = cases.filter((c) => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterPriority !== "all" && c.priority !== filterPriority) return false;
    if (searchQuery && !c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !c.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const criticalCount = cases.filter((c) => c.priority === "critical" && c.status !== "discharged").length;
  const waitingCount = cases.filter((c) => c.status === "waiting").length;
  const activeCount = cases.filter((c) => c.status !== "discharged").length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleStatusChange = (caseId: string, newStatus: TriageStatus) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
    );
    if (selectedCase?.id === caseId) {
      setSelectedCase((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleTaskToggle = (caseId: string, taskId: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              tasks: c.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : c
      )
    );
    if (selectedCase?.id === caseId) {
      setSelectedCase((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : null
      );
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedCase) return;
    const note = {
      author: user?.name || "Staff",
      text: newNote,
      time: new Date(),
    };
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id ? { ...c, notes: [...c.notes, note] } : c
      )
    );
    setSelectedCase((prev) => prev ? { ...prev, notes: [...prev.notes, note] } : null);
    setNewNote("");
  };

  const handleLogout = () => {
    localStorage.removeItem("emergency_user");
    router.push("/login");
  };

  const getTimeSince = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 dot-pattern opacity-10" />
      </div>

      <header className="sticky top-0 z-40 glass-card border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Emergency Dashboard</h1>
                <p className="text-sm text-slate-400">{user?.name || "Staff"} • {user?.role || "Doctor"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {criticalCount > 0 && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="status-critical rounded-xl px-4 py-2 flex items-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-bold">{criticalCount} Critical</span>
                </motion.div>
              )}

              <Button
                onClick={handleRefresh}
                variant="outline"
                className="glass-card border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              <div className="relative">
                <Bell className="w-6 h-6 text-slate-400 cursor-pointer hover:text-white transition-colors" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {criticalCount}
                </span>
              </div>

              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-slate-400 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Active Cases", value: activeCount, icon: Activity, color: "blue" },
            { label: "Critical", value: criticalCount, icon: AlertTriangle, color: "red" },
            { label: "Waiting", value: waitingCount, icon: Clock, color: "amber" },
            { label: "Treated Today", value: 12, icon: CheckCircle2, color: "emerald" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-5 card-hover"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <stat.icon className={`w-7 h-7 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="p-5 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Case Queue
                </h2>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patients..."
                    className="pl-10 glass-card-light border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as TriageStatus | "all")}
                    className="px-3 py-2 glass-card-light border border-slate-700 rounded-xl text-sm text-white bg-transparent"
                  >
                    <option value="all">All Status</option>
                    {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as CasePriority | "all")}
                    className="px-3 py-2 glass-card-light border border-slate-700 rounded-xl text-sm text-white bg-transparent"
                  >
                    <option value="all">All Priority</option>
                    {Object.entries(PRIORITY_CONFIG).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {filteredCases.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No cases found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700/50">
                    {filteredCases.map((c) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedCase(c)}
                        className={`p-4 cursor-pointer hover:bg-slate-800/30 transition-all ${
                          selectedCase?.id === c.id ? "bg-slate-800/50 border-l-4 border-blue-500" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{c.categoryIcon}</span>
                            <div>
                              <p className="text-white font-semibold">{c.patientName}</p>
                              <p className="text-xs text-slate-500">{c.id}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${PRIORITY_CONFIG[c.priority].bgColor} ${PRIORITY_CONFIG[c.priority].color}`}>
                            {PRIORITY_CONFIG[c.priority].label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-lg text-xs ${STATUS_CONFIG[c.status].bgColor} ${STATUS_CONFIG[c.status].color}`}>
                            {STATUS_CONFIG[c.status].label}
                          </span>
                        </div>

                        {c.allergies.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-red-400 mb-2">
                            <AlertTriangle className="w-3 h-3" />
                            Allergies: {c.allergies.join(", ")}
                          </div>
                        )}

                        <p className="text-xs text-slate-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {getTimeSince(c.arrivalTime)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedCase ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-3xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center">
                        <User className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedCase.patientName}</h2>
                        <p className="text-slate-400">
                          {selectedCase.age}y • {selectedCase.gender} • {selectedCase.id}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedCase(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <select
                      value={selectedCase.status}
                      onChange={(e) => handleStatusChange(selectedCase.id, e.target.value as TriageStatus)}
                      className="px-4 py-2 glass-card border border-slate-700 rounded-xl text-white bg-transparent"
                    >
                      {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                    <Button
                      onClick={() => setShowShareModal(true)}
                      variant="outline"
                      className="glass-card border-slate-700 text-slate-300"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share to Dept
                    </Button>
                  </div>
                </div>

                {selectedCase.allergies.length > 0 && (
                  <div className="mx-6 mt-4 status-critical rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-red-400 font-semibold">Allergy Alert</p>
                        <p className="text-red-300 text-sm">{selectedCase.allergies.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="glass-card-light rounded-2xl p-4">
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">Chief Complaint</h3>
                      <p className="text-white">{selectedCase.chiefComplaint}</p>
                    </div>

                    <div className="glass-card-light rounded-2xl p-4">
                      <h3 className="text-sm font-semibold text-slate-400 mb-3">Symptoms</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCase.symptoms.map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-700 rounded-lg text-sm text-white">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedCase.medications.length > 0 && (
                      <div className="glass-card-light rounded-2xl p-4">
                        <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-3">
                          <Pill className="w-4 h-4 text-cyan-400" />
                          Current Medications
                        </h3>
                        <p className="text-white">{selectedCase.medications.join(", ")}</p>
                      </div>
                    )}

                    {selectedCase.vitals && (
                      <div className="glass-card-light rounded-2xl p-4">
                        <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-3">
                          <Heart className="w-4 h-4 text-red-400" />
                          Vital Signs
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">BP:</span>
                            <span className="text-white font-mono">{selectedCase.vitals.bp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Pulse:</span>
                            <span className="text-white font-mono">{selectedCase.vitals.pulse}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Temp:</span>
                            <span className="text-white font-mono">{selectedCase.vitals.temp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">SpO2:</span>
                            <span className="text-white font-mono">{selectedCase.vitals.spo2}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="glass-card-light rounded-2xl p-4">
                      <h3 className="text-sm font-semibold text-slate-400 mb-3">Task Checklist</h3>
                      <div className="space-y-2">
                        {selectedCase.tasks.length === 0 ? (
                          <p className="text-slate-500 text-sm">No tasks assigned</p>
                        ) : (
                          selectedCase.tasks.map((task) => (
                            <label
                              key={task.id}
                              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                                task.completed
                                  ? "bg-emerald-500/10 border border-emerald-500/30"
                                  : "bg-slate-800/50 border border-slate-700"
                              }`}
                            >
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => handleTaskToggle(selectedCase.id, task.id)}
                                className="data-[state=checked]:bg-emerald-500"
                              />
                              <span className={`text-sm ${task.completed ? "text-emerald-400 line-through" : "text-white"}`}>
                                {task.task}
                              </span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="glass-card-light rounded-2xl p-4">
                      <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        Clinical Notes
                      </h3>
                      <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
                        {selectedCase.notes.length === 0 ? (
                          <p className="text-slate-500 text-sm">No notes yet</p>
                        ) : (
                          selectedCase.notes.map((note, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-blue-400 text-xs font-medium">{note.author}</span>
                                <span className="text-slate-500 text-xs">
                                  {note.time.toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-white text-sm">{note.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add a note..."
                          className="flex-1 glass-card border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
                          onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                        />
                        <Button
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                          className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center min-h-[500px]"
              >
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Select a Case</h3>
                <p className="text-slate-400 text-center max-w-md">
                  Click on a case from the queue to view patient details, manage tasks, and add clinical notes
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showShareModal && selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-3xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Share to Department</h3>
              <div className="grid grid-cols-2 gap-3">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setShowShareModal(false);
                    }}
                    className="p-4 glass-card-light rounded-2xl hover:ring-2 hover:ring-blue-500/50 transition-all text-left"
                  >
                    <span className="text-2xl block mb-2">{dept.icon}</span>
                    <span className="text-white text-sm font-medium">{dept.name}</span>
                  </button>
                ))}
              </div>
              <Button
                onClick={() => setShowShareModal(false)}
                variant="ghost"
                className="w-full mt-4 text-slate-400"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
