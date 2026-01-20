"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Mic,
  Shield,
  Clock,
  ArrowRight,
  Zap,
  Stethoscope,
  Activity,
  FileText,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("emergency_user");
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === "doctor" || userData.role === "nurse" || userData.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/emergency");
      }
    }
  }, [router]);

  const features = [
    {
      icon: Mic,
      title: "Voice-Based Input",
      description: "AI speaks questions and captures voice responses automatically",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: Zap,
      title: "AI-Powered Processing",
      description: "Smart extraction of symptoms, allergies & medications",
      color: "from-amber-500 to-yellow-500",
    },
    {
      icon: Download,
      title: "PDF Forms Ready",
      description: "5 hospital-ready forms generated instantly",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Secure, encrypted patient data handling",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const stats = [
    { value: "10+", label: "Modules" },
    { value: "3", label: "Languages" },
    { value: "5", label: "PDF Forms" },
    { value: "80%", label: "Faster" },
  ];

  return (
    <div className="min-h-screen dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dark mode backgrounds */}
        <div className="absolute top-0 left-0 w-full h-full dark:bg-[radial-gradient(ellipse_at_top_left,rgba(239,68,68,0.15),transparent_50%)] opacity-0 dark:opacity-100" />
        <div className="absolute bottom-0 right-0 w-full h-full dark:bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,88,12,0.1),transparent_50%)] opacity-0 dark:opacity-100" />
        
        {/* Light mode backgrounds */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(239,68,68,0.08),transparent_50%)] dark:opacity-0" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,88,12,0.05),transparent_50%)] dark:opacity-0" />
      </div>

      <div className="absolute top-20 left-20 w-72 h-72 dark:bg-red-500/10 bg-red-500/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 dark:bg-orange-500/10 bg-orange-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] dark:bg-blue-500/5 bg-blue-500/3 rounded-full blur-[150px]" />

      <header className="relative z-10 container mx-auto px-4 py-6 border-b dark:border-slate-800 border-slate-200">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30"
            >
              <Heart className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent dark:from-red-400 dark:to-orange-400">
                EmergencyAI
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Medical Form Automation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              >
                Login
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg shadow-lg shadow-red-500/30">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-red-500/20 dark:bg-red-500/10 border dark:border-red-500/30 border-red-500/50 rounded-full px-6 py-2 mb-6"
          >
            <Activity className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-400 text-sm font-semibold">🚀 AI-Powered Healthcare Solution</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Emergency Medical Form
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
              Automation System
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Voice-powered intelligent system that asks questions aloud, captures voice responses, 
            and generates hospital-ready PDF forms <span className="font-semibold text-slate-700 dark:text-slate-300">80% faster</span>.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/login">
              <Button className="h-14 px-8 text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl shadow-lg shadow-red-500/30 font-semibold">
                <Mic className="w-5 h-5 mr-2" />
                Start Voice Intake
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                variant="outline" 
                className="h-14 px-8 text-lg dark:border-slate-600 dark:text-white dark:hover:bg-slate-800 border-slate-300 text-slate-900 hover:bg-slate-100 rounded-xl font-semibold"
              >
                <Stethoscope className="w-5 h-5 mr-2" />
                Staff Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ translateY: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity" />
              <div className="relative bg-white dark:bg-slate-800 border dark:border-slate-700 border-slate-200 rounded-2xl p-6 text-center backdrop-blur">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              whileHover={{ translateY: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity blur-xl`} />
              <div className="relative bg-white dark:bg-slate-800 border dark:border-slate-700 border-slate-200 rounded-3xl p-7 backdrop-blur transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border dark:border-slate-700 border-slate-200 rounded-3xl p-8 md:p-12 mb-20 backdrop-blur"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6 md:gap-4">
            {[
              { step: "1", title: "Patient Arrives", desc: "Quick registration with basic details", icon: "🏥" },
              { step: "2", title: "AI Voice Interview", desc: "System speaks questions, captures voice", icon: "🎤" },
              { step: "3", title: "Auto Form Fill", desc: "5 hospital forms generated as PDF", icon: "📋" },
              { step: "4", title: "Staff Review", desc: "Doctor reviews on dashboard", icon: "👨‍⚕️" },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.85 + idx * 0.1 }}
                className="relative text-center group"
              >
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-1 bg-gradient-to-r from-red-600 to-orange-600 -translate-y-1/2 group-last:hidden" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl shadow-lg shadow-red-500/30">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border dark:border-slate-700 border-slate-200 rounded-3xl p-8 md:p-12 mb-20 backdrop-blur"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-10 text-center">
            Generated PDF Forms
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {[
              { name: "Emergency Intake", icon: "📋", color: "from-red-500 to-orange-500" },
              { name: "Triage Assessment", icon: "🩺", color: "from-amber-500 to-yellow-500" },
              { name: "Allergy & Medication", icon: "💊", color: "from-pink-500 to-rose-500" },
              { name: "Accident/Symptom", icon: "🚑", color: "from-blue-500 to-cyan-500" },
              { name: "Doctor Summary", icon: "👨‍⚕️", color: "from-emerald-500 to-teal-500" },
            ].map((form, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.95 + idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${form.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity blur-lg`} />
                <div className="relative bg-white dark:bg-slate-700 border dark:border-slate-600 border-slate-200 rounded-2xl p-4 text-center backdrop-blur transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${form.color} flex items-center justify-center mx-auto mb-3 text-white shadow-lg`}>
                    <span className="text-xl">{form.icon}</span>
                  </div>
                  <p className="text-slate-900 dark:text-white text-xs md:text-sm font-semibold">{form.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
              Emergency Care?
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hospitals that are reducing emergency paperwork time by <span className="font-bold text-slate-900 dark:text-white">80%</span> while improving patient care quality.
          </p>
          <Link href="/login">
            <Button className="h-16 px-12 text-lg md:text-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl shadow-lg shadow-red-500/30 font-bold">
              Get Started Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </motion.div>
      </main>

      <footer className="relative z-10 container mx-auto px-4 py-12 mt-20 border-t dark:border-slate-800 border-slate-200">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-bold text-slate-900 dark:text-white">EmergencyAI</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              AI-Powered Medical Form Automation for Emergency Care
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>✓ Voice-Powered Intake</li>
              <li>✓ Multi-Language Support</li>
              <li>✓ PDF Form Generation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Security</h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t dark:border-slate-800 border-slate-200 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>© 2026 EmergencyAI. All rights reserved. | Made with ❤️ for emergency care professionals</p>
        </div>
      </footer>
    </div>
  );
}
