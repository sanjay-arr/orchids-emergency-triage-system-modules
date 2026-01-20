"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/emergency-types";
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
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

interface CaseHistory {
  id: string;
  date: string;
  category: string;
  priority: string;
  status: string;
}

export default function PatientDashboard() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [caseHistory] = useState<CaseHistory[]>([
    { id: "ER-ABC123", date: "2024-01-15", category: "Fever", priority: "normal", status: "completed" },
    { id: "ER-DEF456", date: "2024-01-10", category: "Injury", priority: "urgent", status: "completed" },
  ]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
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

  const quickActions = [
    {
      icon: AlertTriangle,
      label: "New Emergency",
      desc: "Start emergency intake",
      color: "red",
      action: () => router.push("/emergency"),
    },
    {
      icon: FileText,
      label: "My Records",
      desc: "View medical history",
      color: "blue",
      action: () => {},
    },
    {
      icon: Calendar,
      label: "Appointments",
      desc: "Schedule visit",
      color: "emerald",
      action: () => {},
    },
    {
      icon: Phone,
      label: "Emergency Hotline",
      desc: "24/7 Support",
      color: "amber",
      action: () => {},
    },
  ];

  const stats = [
    { label: "Total Visits", value: "12", icon: Activity, trend: "+2 this month" },
    { label: "Active Cases", value: "0", icon: FileText, trend: "All resolved" },
    { label: "Next Checkup", value: "Feb 15", icon: Calendar, trend: "In 25 days" },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-slate-50 via-white to-blue-50"
      }`}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl ${
            isDark ? "bg-blue-500/5" : "bg-blue-200/30"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl ${
            isDark ? "bg-purple-500/5" : "bg-purple-200/30"
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
                  isDark ? "bg-red-500/20" : "bg-red-100"
                }`}
              >
                <Heart className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-500"}`} />
              </div>
              <span className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                MedEmergency
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                className={`p-2 rounded-lg relative ${
                  isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
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
                            ? isDark ? "bg-red-500/20 text-red-400" : "bg-red-50 text-red-600"
                            : isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-50 text-slate-700"
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
                      isDark ? "bg-blue-500/20" : "bg-blue-100"
                    }`}
                  >
                    <User className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
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

      <main className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            Welcome back, {user.name}! 👋
          </h1>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            How are you feeling today? We&apos;re here to help.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-8 p-6 rounded-2xl border ${
            isDark
              ? "bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20"
              : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isDark ? "bg-red-500/20" : "bg-red-100"}`}>
                <AlertTriangle className={`w-8 h-8 ${isDark ? "text-red-400" : "text-red-500"}`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Need Emergency Help?
                </h2>
                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Start an emergency intake now with AI-assisted triage
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/emergency")}
              className="bg-red-500 hover:bg-red-600 text-white h-12 px-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Emergency
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`p-6 rounded-2xl border ${
                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
                >
                  <stat.icon className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                </div>
                <TrendingUp className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
              </div>
              <p className={`text-3xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                {stat.value}
              </p>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {stat.label}
              </p>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                {stat.trend}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                    isDark
                      ? "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      action.color === "red"
                        ? isDark ? "bg-red-500/20" : "bg-red-100"
                        : action.color === "blue"
                        ? isDark ? "bg-blue-500/20" : "bg-blue-100"
                        : action.color === "emerald"
                        ? isDark ? "bg-emerald-500/20" : "bg-emerald-100"
                        : isDark ? "bg-amber-500/20" : "bg-amber-100"
                    }`}
                  >
                    <action.icon
                      className={`w-5 h-5 ${
                        action.color === "red"
                          ? isDark ? "text-red-400" : "text-red-500"
                          : action.color === "blue"
                          ? isDark ? "text-blue-400" : "text-blue-500"
                          : action.color === "emerald"
                          ? isDark ? "text-emerald-400" : "text-emerald-500"
                          : isDark ? "text-amber-400" : "text-amber-500"
                      }`}
                    />
                  </div>
                  <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {action.label}
                  </p>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {action.desc}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Recent Cases
            </h3>
            <div
              className={`rounded-xl border overflow-hidden ${
                isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              {caseHistory.length > 0 ? (
                caseHistory.map((c, i) => (
                  <div
                    key={c.id}
                    className={`p-4 flex items-center justify-between ${
                      i !== caseHistory.length - 1
                        ? isDark ? "border-b border-slate-700" : "border-b border-slate-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          c.priority === "urgent"
                            ? isDark ? "bg-amber-500/20" : "bg-amber-100"
                            : isDark ? "bg-emerald-500/20" : "bg-emerald-100"
                        }`}
                      >
                        <Activity
                          className={`w-5 h-5 ${
                            c.priority === "urgent"
                              ? isDark ? "text-amber-400" : "text-amber-500"
                              : isDark ? "text-emerald-400" : "text-emerald-500"
                          }`}
                        />
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                          {c.category}
                        </p>
                        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          {c.id} • {c.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        c.status === "completed"
                          ? isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                          : isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Shield className={`w-12 h-12 mx-auto mb-3 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
                  <p className={isDark ? "text-slate-400" : "text-slate-600"}>No recent cases</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
