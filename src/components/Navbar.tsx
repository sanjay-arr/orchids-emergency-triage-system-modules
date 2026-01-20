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
      className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Emergency</h1>
              <p className="text-xs text-slate-400">Triage System</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">{t("nav_dashboard")}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/emergency")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{t("nav_emergency")}</span>
            </motion.button>

            {/* Language Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm uppercase font-semibold">{language}</span>
              </motion.button>

              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50"
                >
                  <div className="p-2 grid grid-cols-1 gap-1">
                    {LANGUAGES.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ scale: 1.02, x: 4 }}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          language === lang.code
                            ? "bg-red-500/20 text-red-300 border border-red-500/50"
                            : "text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
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
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* User Profile */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                {userName.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-slate-400">{userRole}</p>
                <p className="text-sm text-white font-semibold">{userName}</p>
              </div>
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">{t("nav_logout")}</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800/50"
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
            className="md:hidden mt-4 pt-4 border-t border-slate-700 space-y-2"
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="w-4 h-4 mr-2" />
              {t("nav_dashboard")}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300"
              onClick={() => router.push("/emergency")}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              {t("nav_emergency")}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-300"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 mr-2" />
              ) : (
                <Moon className="w-4 h-4 mr-2" />
              )}
              {t("nav_theme")}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("nav_logout")}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
