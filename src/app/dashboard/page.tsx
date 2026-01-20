"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PRIORITY_CONFIG, EMERGENCY_CATEGORIES } from "@/lib/emergency-types";
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
  ChevronRight,
  Phone,
  MapPin,
  Plus,
} from "lucide-react";
import Link from "next/link";

type TriageStatus = "waiting" | "in_triage" | "under_treatment" | "observation" | "discharged";
type CasePriority = "normal" | "urgent" | "critical";

interface EmergencyCase {
  caseId: string;
  patient: {
    name: string;
    age: number | null;
    gender: string | null;
    phone?: string;
  };
  category: string;
  priority: CasePriority;
  status: TriageStatus;
  arrivalTime: string;
  hospitalName: string;
  ward: string;
  responses: Array<{
    questionId: string;
    question: string;
    answer: string;
    answeredVia: string;
    timestamp: string;
  }>;
  notes?: { author: string; text: string; time: string }[];
  tasks?: { id: string; task: string; completed: boolean }[];
}

const STATUS_CONFIG: Record<TriageStatus, { label: string; color: string; bgColor: string }> = {
  waiting: { label: "Waiting", color: "text-amber-400", bgColor: "bg-amber-500/20" },
  in_triage: { label: "In Triage", color: "text-blue-400", bgColor: "bg-blue-500/20" },
  under_treatment: { label: "Under Treatment", color: "text-purple-400", bgColor: "bg-purple-500/20" },
  observation: { label: "Observation", color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
  discharged: { label: "Discharged", color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
};

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
  const [cases, setCases] = useState<EmergencyCase[]>([]);
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
    loadCases();
  }, []);

  const loadCases = () => {
    const storedCases = localStorage.getItem("emergency_cases");
    if (storedCases) {
      const parsed = JSON.parse(storedCases);
      const casesWithStatus = parsed.map((c: EmergencyCase) => ({
        ...c,
        status: c.status || "waiting",
        notes: c.notes || [],
        tasks: c.tasks || generateDefaultTasks(c.category),
      }));
      setCases(casesWithStatus);
    }
  };

  const generateDefaultTasks = (category: string) => {
    const baseTasks = [
      { id: "1", task: "Check vital signs", completed: false },
      { id: "2", task: "Review medical history", completed: false },
      { id: "3", task: "Document allergies", completed: false },
    ];
    
    if (category === "chest_pain" || category === "heart") {
      baseTasks.push(
        { id: "4", task: "12-lead ECG", completed: false },
        { id: "5", task: "Troponin levels", completed: false }
      );
    } else if (category === "accident" || category === "injury") {
      baseTasks.push(
        { id: "4", task: "X-ray affected area", completed: false },
        { id: "5", task: "Wound care", completed: false }
      );
    }
    return baseTasks;
  };

  const filteredCases = cases.filter((c) => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterPriority !== "all" && c.priority !== filterPriority) return false;
    if (searchQuery && !c.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !c.caseId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const criticalCount = cases.filter((c) => c.priority === "critical" && c.status !== "discharged").length;
  const waitingCount = cases.filter((c) => c.status === "waiting").length;
  const activeCount = cases.filter((c) => c.status !== "discharged").length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadCases();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleStatusChange = (caseId: string, newStatus: TriageStatus) => {
    const updatedCases = cases.map((c) => 
      c.caseId === caseId ? { ...c, status: newStatus } : c
    );
    setCases(updatedCases);
    localStorage.setItem("emergency_cases", JSON.stringify(updatedCases));
    
    if (selectedCase?.caseId === caseId) {
      setSelectedCase({ ...selectedCase, status: newStatus });
    }
  };

  const handleTaskToggle = (caseId: string, taskId: string) => {
    const updatedCases = cases.map((c) =>
      c.caseId === caseId
        ? {
            ...c,
            tasks: c.tasks?.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          }
        : c
    );
    setCases(updatedCases);
    localStorage.setItem("emergency_cases", JSON.stringify(updatedCases));
    
    if (selectedCase?.caseId === caseId) {
      setSelectedCase({
        ...selectedCase,
        tasks: selectedCase.tasks?.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      });
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedCase) return;
    const note = {
      author: user?.name || "Staff",
      text: newNote,
      time: new Date().toISOString(),
    };
    
    const updatedCases = cases.map((c) =>
      c.caseId === selectedCase.caseId 
        ? { ...c, notes: [...(c.notes || []), note] } 
        : c
    );
    setCases(updatedCases);
    localStorage.setItem("emergency_cases", JSON.stringify(updatedCases));
    
    setSelectedCase({ ...selectedCase, notes: [...(selectedCase.notes || []), note] });
    setNewNote("");
  };

  const handleLogout = () => {
    localStorage.removeItem("emergency_user");
    router.push("/login");
  };

  const getTimeSince = (dateStr: string) => {
    const date = new Date(dateStr);
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
  };

  const getCategoryInfo = (categoryValue: string) => {
    return EMERGENCY_CATEGORIES.find((c) => c.value === categoryValue) || { icon: "🏥", label: categoryValue };
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

              <Link href="/emergency">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500">
                  <Plus className="w-4 h-4 mr-2" />
                  New Case
                </Button>
              </Link>

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
                {criticalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {criticalCount}
                  </span>
                )}
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
            { label: "Active Cases", value: activeCount, icon: Activity, color: "blue", bgClass: "bg-blue-500/20" },
            { label: "Critical", value: criticalCount, icon: AlertTriangle, color: "red", bgClass: "bg-red-500/20" },
            { label: "Waiting", value: waitingCount, icon: Clock, color: "amber", bgClass: "bg-amber-500/20" },
            { label: "Total Today", value: cases.length, icon: CheckCircle2, color: "emerald", bgClass: "bg-emerald-500/20" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-5 card-hover"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${stat.bgClass} flex items-center justify-center`}>
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
                    <Link href="/emergency">
                      <Button className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Case
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700/50">
                    {filteredCases.map((c) => {
                      const catInfo = getCategoryInfo(c.category);
                      return (
                        <motion.div
                          key={c.caseId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setSelectedCase(c)}
                          className={`p-4 cursor-pointer hover:bg-slate-800/30 transition-all ${
                            selectedCase?.caseId === c.caseId ? "bg-slate-800/50 border-l-4 border-blue-500" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{catInfo.icon}</span>
                              <div>
                                <p className="text-white font-semibold">{c.patient.name}</p>
                                <p className="text-xs text-slate-500">{c.caseId}</p>
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

                          <p className="text-xs text-slate-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {getTimeSince(c.arrivalTime)}
                          </p>
                        </motion.div>
                      );
                    })}
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
                        <h2 className="text-2xl font-bold text-white">{selectedCase.patient.name}</h2>
                        <p className="text-slate-400">
                          {selectedCase.patient.age}y • {selectedCase.patient.gender} • {selectedCase.caseId}
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
                      onChange={(e) => handleStatusChange(selectedCase.caseId, e.target.value as TriageStatus)}
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

                <div className="p-6 grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="glass-card-light rounded-2xl p-4">
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">Emergency Type</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryInfo(selectedCase.category).icon}</span>
                        <span className="text-white font-medium">{getCategoryInfo(selectedCase.category).label}</span>
                      </div>
                    </div>

                    <div className="glass-card-light rounded-2xl p-4">
                      <h3 className="text-sm font-semibold text-slate-400 mb-3">Assessment Responses</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedCase.responses.slice(0, 5).map((r, idx) => (
                          <div key={idx} className="text-sm">
                            <p className="text-slate-500 text-xs">{r.question}</p>
                            <p className="text-white flex items-center gap-2">
                              {r.answer}
                              {r.answeredVia === "voice" && <Mic className="w-3 h-3 text-red-400" />}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card-light rounded-2xl p-4">
                      <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        Location
                      </h3>
                      <p className="text-white">{selectedCase.hospitalName}</p>
                      <p className="text-slate-400 text-sm">{selectedCase.ward}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="glass-card-light rounded-2xl p-4">
                      <h3 className="text-sm font-semibold text-slate-400 mb-3">Task Checklist</h3>
                      <div className="space-y-2">
                        {(selectedCase.tasks || []).map((task) => (
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
                              onCheckedChange={() => handleTaskToggle(selectedCase.caseId, task.id)}
                              className="data-[state=checked]:bg-emerald-500"
                            />
                            <span className={`text-sm ${task.completed ? "text-emerald-400 line-through" : "text-white"}`}>
                              {task.task}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card-light rounded-2xl p-4">
                      <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        Clinical Notes
                      </h3>
                      <div className="space-y-3 max-h-32 overflow-y-auto mb-4">
                        {(selectedCase.notes || []).length === 0 ? (
                          <p className="text-slate-500 text-sm">No notes yet</p>
                        ) : (
                          (selectedCase.notes || []).map((note, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-blue-400 text-xs font-medium">{note.author}</span>
                                <span className="text-slate-500 text-xs">
                                  {new Date(note.time).toLocaleTimeString()}
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
                <p className="text-slate-400 text-center max-w-md mb-6">
                  Click on a case from the queue to view patient details, manage tasks, and add clinical notes
                </p>
                <Link href="/emergency">
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Case
                  </Button>
                </Link>
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
