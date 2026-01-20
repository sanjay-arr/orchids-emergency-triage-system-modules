"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LANGUAGES } from "@/lib/emergency-types";
import {
  Heart,
  User,
  Stethoscope,
  Mail,
  Lock,
  ArrowRight,
  Sun,
  Moon,
  Globe,
  Sparkles,
  Shield,
  Activity,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<UserRole>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let success = false;
    if (mode === "login") {
      success = await login(email, password, role);
    } else {
      success = await signup(name, email, password, role);
    }

    if (success) {
      router.push(role === "doctor" ? "/doctor" : "/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-blue-50 via-white to-rose-50"
      }`}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl ${
            isDark ? "bg-red-500/10" : "bg-red-200/40"
          }`}
        />
        <div
          className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl ${
            isDark ? "bg-blue-500/10" : "bg-blue-200/40"
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl ${
            isDark ? "bg-purple-500/5" : "bg-purple-200/30"
          }`}
        />
      </div>

      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className={`p-3 rounded-full transition-all ${
              isDark
                ? "bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700"
                : "bg-white/80 hover:bg-white text-slate-800 border border-slate-200 shadow-lg"
            }`}
          >
            <Globe className="w-5 h-5" />
          </button>
          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute right-0 mt-2 rounded-xl overflow-hidden shadow-xl ${
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
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      language === lang.value
                        ? isDark
                          ? "bg-red-500/20 text-red-400"
                          : "bg-red-50 text-red-600"
                        : isDark
                        ? "hover:bg-slate-700 text-slate-300"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="font-medium">{lang.native}</span>
                    <span className="text-xs opacity-60">{lang.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all ${
            isDark
              ? "bg-slate-800/80 hover:bg-slate-700 text-yellow-400 border border-slate-700"
              : "bg-white/80 hover:bg-white text-slate-800 border border-slate-200 shadow-lg"
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  isDark ? "bg-red-500/20" : "bg-red-100"
                }`}
              >
                <Heart className={`w-8 h-8 ${isDark ? "text-red-400" : "text-red-500"}`} />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  MedEmergency
                </h1>
                <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  AI-Powered Triage System
                </p>
              </div>
            </div>

            <h2
              className={`text-4xl font-bold mb-6 leading-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {t("welcome")}
            </h2>

            <p className={`text-lg mb-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Smart medical intake with multi-language support, voice recognition, and real-time
              priority assessment.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Activity,
                  title: "Real-time Triage",
                  desc: "AI-powered priority assessment",
                },
                {
                  icon: Globe,
                  title: "Multi-language",
                  desc: "English, Tamil, Hindi support",
                },
                { icon: Shield, title: "Secure", desc: "HIPAA-compliant data handling" },
                {
                  icon: Sparkles,
                  title: "Voice Input",
                  desc: "Speak your responses naturally",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    isDark ? "bg-slate-800/50" : "bg-white/80 shadow-sm"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isDark ? "bg-red-500/20" : "bg-red-100"
                    }`}
                  >
                    <feature.icon className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-500"}`} />
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {feature.title}
                    </p>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`w-full max-w-md p-8 rounded-3xl ${
              isDark
                ? "bg-slate-900/80 border border-slate-800"
                : "bg-white/90 border border-slate-200 shadow-xl"
            }`}
          >
            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? "bg-red-500/20" : "bg-red-100"
                }`}
              >
                <Heart className={`w-6 h-6 ${isDark ? "text-red-400" : "text-red-500"}`} />
              </div>
              <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                MedEmergency
              </span>
            </div>

            <div className="flex mb-8">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 text-center font-semibold transition-all rounded-xl ${
                    mode === m
                      ? isDark
                        ? "bg-red-500/20 text-red-400"
                        : "bg-red-50 text-red-600"
                      : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {t(m)}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <Label className={`mb-3 block ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {t("patient")} / {t("doctor")}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "patient" as UserRole, icon: User, label: t("patient") },
                  { value: "doctor" as UserRole, icon: Stethoscope, label: t("doctor") },
                ].map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      role === r.value
                        ? isDark
                          ? "border-red-500 bg-red-500/20"
                          : "border-red-500 bg-red-50"
                        : isDark
                        ? "border-slate-700 hover:border-slate-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <r.icon
                      className={`w-6 h-6 ${
                        role === r.value
                          ? isDark
                            ? "text-red-400"
                            : "text-red-500"
                          : isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        role === r.value
                          ? isDark
                            ? "text-red-400"
                            : "text-red-600"
                          : isDark
                          ? "text-slate-300"
                          : "text-slate-700"
                      }`}
                    >
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label className={isDark ? "text-slate-300" : "text-slate-700"}>
                    {t("name")}
                  </Label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("name")}
                      className={`pl-10 h-12 ${
                        isDark
                          ? "bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                      }`}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className={isDark ? "text-slate-300" : "text-slate-700"}>{t("email")}</Label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("email")}
                    className={`pl-10 h-12 ${
                      isDark
                        ? "bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={isDark ? "text-slate-300" : "text-slate-700"}>
                  {t("password")}
                </Label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? "text-slate-500" : "text-slate-400"
                    }`}
                  />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("password")}
                    className={`pl-10 h-12 ${
                      isDark
                        ? "bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold text-lg rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? t("login") : t("signup")}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {mode === "login" && (
              <div
                className={`mt-6 p-4 rounded-xl ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}
              >
                <p className={`text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Demo Credentials:
                </p>
                <div className={`text-xs space-y-1 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                  <p>Doctor: doctor@medcare.com / doctor123</p>
                  <p>Patient: patient@example.com / patient123</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
