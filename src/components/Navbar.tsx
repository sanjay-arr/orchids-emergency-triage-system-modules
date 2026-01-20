"use client";

import { useTheme } from "@/lib/theme-context";
import { useTranslation } from "@/lib/use-translation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Globe,
  LogOut,
  Home,
  AlertCircle,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  userRole?: string;
  userName?: string;
}

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
] as const;

export function Navbar({ userRole = "user", userName = "User" }: NavbarProps) {
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("emergency_user");
    router.push("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-md dark:bg-slate-950/90 bg-white/90 dark:border-slate-800 border-b border-slate-200 shadow-sm"
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                EmergencyAI
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Medical Triage</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </motion.button>
              <span className="text-sm">{t("nav_dashboard")}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/emergency")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Emergency</span>
            </motion.button>

            {/* Divider */}
            <div className="w-px h-6 dark:bg-slate-700 bg-slate-300" />

            {/* Language Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all font-medium text-sm"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase tracking-wide">{language}</span>
              </motion.button>

              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 border dark:border-slate-700 border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur"
                >
                  <div className="p-2 grid grid-cols-1 gap-1 max-h-80 overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ scale: 1.02, x: 4 }}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                          language === lang.code
                            ? "bg-red-500/20 dark:bg-red-500/20 text-red-700 dark:text-red-400 border dark:border-red-500/50 border-red-500/50"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 20 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-lg dark:text-yellow-400 dark:hover:bg-slate-800 text-yellow-600 hover:bg-slate-100 transition-all dark:hover:text-yellow-300 hover:text-yellow-700"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* User Profile */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg dark:bg-slate-800/50 bg-slate-200/50 dark:border-slate-700/50 border border-slate-300/50">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide font-semibold">{userRole}</p>
                <p className="text-sm text-slate-900 dark:text-white font-bold">{userName}</p>
              </div>
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/10 transition-all font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 dark:border-slate-700 border-slate-300 border-t space-y-2"
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 hover:bg-slate-100"
              onClick={() => {
                router.push("/dashboard");
                setIsMenuOpen(false);
              }}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 hover:bg-slate-100"
              onClick={() => {
                router.push("/emergency");
                setIsMenuOpen(false);
              }}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Emergency
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 hover:bg-slate-100"
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 mr-2" />
              ) : (
                <Moon className="w-4 h-4 mr-2" />
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 hover:bg-red-100"
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
