"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { LANGUAGES, PRIORITY_CONFIG, CasePriority } from "@/lib/emergency-types";
import {
  Heart,
  AlertTriangle,
  Clock,
  FileText,
  User,
  LogOut,
  Sun,
  Moon,
  Globe,
  Activity,
  Bell,
  ChevronRight,
  Users,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Filter,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Zap,
  MapPin,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmergencyCase {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  category: string;
  priority: CasePriority;
  status: "waiting" | "in_progress" | "completed";
  arrivalTime: string;
  hospital: string;
  ward: string;
  phone?: string;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [cases, setCases] = useState<EmergencyCase[]>([
    {
      id: "ER-X7K2M",
      patientName: "Rajesh Kumar",
      age: 45,
      gender: "Male",
      category: "Chest Pain",
      priority: "critical",
      status: "waiting",
      arrivalTime: "10:23 AM",
      hospital: "City General",
      ward: "Emergency",
      phone: "+91 98765 43210",
    },
    {
      id: "ER-P3N8Q",
      patientName: "Priya Sharma",
      age: 32,
      gender: "Female",
      category: "Accident",
      priority: "urgent",
      status: "in_progress",
      arrivalTime: "10:45 AM",
      hospital: "City General",
      ward: "Trauma",
      phone: "+91 87654 32109",
    },
    {
      id: "ER-L9M4K",
      patientName: "Suresh Patel",
      age: 28,
      gender: "Male",
      category: "Fever",
      priority: "normal",
      status: "waiting",
      arrivalTime: "11:02 AM",
      hospital: "City General",
      ward: "General",
    },
    {
      id: "ER-T5V2W",
      patientName: "Anitha Devi",
      age: 55,
      gender: "Female",
      category: "Breathing",
      priority: "critical",
      status: "in_progress",
      arrivalTime: "09:58 AM",
      hospital: "City General",
      ward: "ICU",
      phone: "+91 76543 21098",
    },
    {
      id: "ER-R8Y1Z",
      patientName: "Mohammed Ali",
      age: 38,
      gender: "Male",
      category: "Injury",
      priority: "urgent",
      status: "completed",
      arrivalTime: "08:30 AM",
      hospital: "City General",
      ward: "Emergency",
    },
  ]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    if (!isLoading && user && user.role !== "doctor") {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  const isDark = theme === "dark";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const filteredCases = cases.filter((c) => {
    const matchesPriority = filterPriority === "all" || c.priority === filterPriority;
    const matchesSearch =
      searchQuery === "" ||
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const stats = {
    critical: cases.filter((c) => c.priority === "critical").length,
    urgent: cases.filter((c) => c.priority === "urgent").length,
    normal: cases.filter((c) => c.priority === "normal").length,
    waiting: cases.filter((c) => c.status === "waiting").length,
    inProgress: cases.filter((c) => c.status === "in_progress").length,
    completed: cases.filter((c) => c.status === "completed").length,
  };

  const updateCaseStatus = (caseId: string, newStatus: "waiting" | "in_progress" | "completed") => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
    );
    if (selectedCase?.id === caseId) {
      setSelectedCase((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-slate-50 via-white to-emerald-50"
      }`}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl ${
            isDark ? "bg-emerald-500/5" : "bg-emerald-200/30"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl ${
            isDark ? "bg-blue-500/5" : "bg-blue-200/30"
          }`}
        />
      </div>

      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDark ? "bg-emerald-500/20" : "bg-emerald-100"
                }`}
              >
                <Stethoscope className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </div>
              <div>
                <span className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  MedEmergency
                </span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                    isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  Doctor Portal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className={`p-2 rounded-lg relative ${
                  isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className={`p-2 rounded-lg ${
                    isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <Globe className="w-5 h-5" />
                </button>
                {showLangMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-40 rounded-xl overflow-hidden shadow-xl z-50 ${
                      isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
                    }`}
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => {
                          setLanguage(lang.value);
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm ${
                          language === lang.value
                            ? isDark
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-emerald-50 text-emerald-600"
                            : isDark
                            ? "hover:bg-slate-700 text-slate-300"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {lang.native}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  isDark ? "hover:bg-slate-800 text-yellow-400" : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 p-2 rounded-xl ${
                    isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDark ? "bg-emerald-500/20" : "bg-emerald-100"
                    }`}
                  >
                    <Stethoscope className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                  </div>
                  <span className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                    {user.name}
                  </span>
                </button>
                {showUserMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-xl overflow-hidden shadow-xl z-50 ${
                      isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
                    }`}
                  >
                    <button
                      onClick={handleLogout}
                      className={`w-full px-4 py-3 text-left flex items-center gap-2 ${
                        isDark ? "hover:bg-slate-700 text-red-400" : "hover:bg-slate-50 text-red-600"
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Emergency Dashboard
            </h1>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>
              Real-time case management • {new Date().toLocaleDateString()}
            </p>
          </div>
          <Button
            onClick={() => router.push("/emergency")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            New Intake
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Critical", value: stats.critical, color: "red", icon: AlertTriangle },
            { label: "Urgent", value: stats.urgent, color: "amber", icon: Clock },
            { label: "Normal", value: stats.normal, color: "emerald", icon: Activity },
            { label: "Waiting", value: stats.waiting, color: "blue", icon: Users },
            { label: "In Progress", value: stats.inProgress, color: "purple", icon: RefreshCw },
            { label: "Completed", value: stats.completed, color: "slate", icon: CheckCircle2 },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border ${
                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon
                  className={`w-5 h-5 ${
                    stat.color === "red"
                      ? "text-red-500"
                      : stat.color === "amber"
                      ? "text-amber-500"
                      : stat.color === "emerald"
                      ? "text-emerald-500"
                      : stat.color === "blue"
                      ? "text-blue-500"
                      : stat.color === "purple"
                      ? "text-purple-500"
                      : "text-slate-500"
                  }`}
                />
              </div>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {stat.value}
              </p>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div
              className={`rounded-2xl border overflow-hidden ${
                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="p-4 border-b flex items-center justify-between gap-4 flex-wrap">
                <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Active Cases
                </h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className={`pl-9 h-9 w-48 ${
                        isDark
                          ? "bg-slate-700/50 border-slate-600 text-white"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    />
                  </div>
                  <div className="flex gap-1">
                    {["all", "critical", "urgent", "normal"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setFilterPriority(p)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          filterPriority === p
                            ? p === "critical"
                              ? "bg-red-500/20 text-red-400"
                              : p === "urgent"
                              ? "bg-amber-500/20 text-amber-400"
                              : p === "normal"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : isDark
                              ? "bg-slate-700 text-white"
                              : "bg-slate-200 text-slate-900"
                            : isDark
                            ? "text-slate-400 hover:bg-slate-700"
                            : "text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-700/50">
                {filteredCases.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedCase(c)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedCase?.id === c.id
                        ? isDark
                          ? "bg-slate-700/50"
                          : "bg-slate-100"
                        : isDark
                        ? "hover:bg-slate-700/30"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            c.status === "waiting"
                              ? "bg-amber-500 animate-pulse"
                              : c.status === "in_progress"
                              ? "bg-blue-500 animate-pulse"
                              : "bg-emerald-500"
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                              {c.patientName}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                PRIORITY_CONFIG[c.priority].bgColor
                              } text-white`}
                            >
                              {PRIORITY_CONFIG[c.priority].label}
                            </span>
                          </div>
                          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {c.id} • {c.category} • {c.age}y {c.gender}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {c.arrivalTime}
                        </p>
                        <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                          {c.ward}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <AnimatePresence mode="wait">
              {selectedCase ? (
                <motion.div
                  key={selectedCase.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`rounded-2xl border overflow-hidden ${
                    isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div
                    className={`p-4 border-b ${
                      selectedCase.priority === "critical"
                        ? "bg-red-500/20"
                        : selectedCase.priority === "urgent"
                        ? "bg-amber-500/20"
                        : "bg-emerald-500/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedCase.priority === "critical"
                            ? "bg-red-500 text-white"
                            : selectedCase.priority === "urgent"
                            ? "bg-amber-500 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {PRIORITY_CONFIG[selectedCase.priority].label}
                      </span>
                      <span className={`text-sm font-mono ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {selectedCase.id}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {selectedCase.patientName}
                      </h3>
                      <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {selectedCase.age} years • {selectedCase.gender}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Activity
                          className={`w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                        />
                        <div>
                          <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            Category
                          </p>
                          <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                            {selectedCase.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin
                          className={`w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                        />
                        <div>
                          <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            Location
                          </p>
                          <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                            {selectedCase.hospital} - {selectedCase.ward}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock
                          className={`w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                        />
                        <div>
                          <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            Arrival
                          </p>
                          <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                            {selectedCase.arrivalTime}
                          </p>
                        </div>
                      </div>
                      {selectedCase.phone && (
                        <div className="flex items-center gap-3">
                          <Phone
                            className={`w-5 h-5 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                          />
                          <div>
                            <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                              Contact
                            </p>
                            <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                              {selectedCase.phone}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-xl ${isDark ? "bg-slate-700/50" : "bg-slate-100"}`}
                    >
                      <p className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Update Status
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateCaseStatus(selectedCase.id, "waiting")}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCase.status === "waiting"
                              ? "bg-amber-500 text-white"
                              : isDark
                              ? "bg-slate-600 text-slate-300 hover:bg-slate-500"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          Waiting
                        </button>
                        <button
                          onClick={() => updateCaseStatus(selectedCase.id, "in_progress")}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCase.status === "in_progress"
                              ? "bg-blue-500 text-white"
                              : isDark
                              ? "bg-slate-600 text-slate-300 hover:bg-slate-500"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => updateCaseStatus(selectedCase.id, "completed")}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCase.status === "completed"
                              ? "bg-emerald-500 text-white"
                              : isDark
                              ? "bg-slate-600 text-slate-300 hover:bg-slate-500"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          Done
                        </button>
                      </div>
                    </div>

                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Details
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-2xl border p-8 text-center ${
                    isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
                  }`}
                >
                  <FileText
                    className={`w-12 h-12 mx-auto mb-3 ${
                      isDark ? "text-slate-600" : "text-slate-300"
                    }`}
                  />
                  <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                    Select a case to view details
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
