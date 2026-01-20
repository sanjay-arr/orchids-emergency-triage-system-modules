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
  Users,
  ArrowRight,
  Zap,
  FileText,
  Stethoscope,
  Activity,
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
      description: "Speak naturally to fill forms - no typing required",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: Zap,
      title: "AI-Powered Processing",
      description: "Smart extraction of symptoms, allergies & medications",
      color: "from-amber-500 to-yellow-500",
    },
    {
      icon: Clock,
      title: "80% Faster",
      description: "Reduce emergency paperwork time dramatically",
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
    { value: "24/7", label: "Available" },
    { value: "100%", label: "Paperless" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(220,38,38,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,88,12,0.1),transparent_50%)]" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px]" />

      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">EmergencyAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Login
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 rounded-xl shadow-lg shadow-red-500/30">
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
            className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-6 py-2 mb-6"
          >
            <Activity className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">AI-Powered Healthcare Solution</span>
          </motion.div>

          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Emergency Medical Form
            <br />
            <span className="text-gradient">Automation System</span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Voice-powered intelligent system that simplifies emergency documentation 
            by asking only necessary questions and auto-filling medical forms in real-time.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <Button className="h-14 px-8 text-lg bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 rounded-2xl shadow-lg shadow-red-500/30">
                <Mic className="w-5 h-5 mr-2" />
                Start Voice Intake
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="h-14 px-8 text-lg glass-card border-slate-700 text-white hover:bg-slate-800 rounded-2xl">
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
          className="grid grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold text-gradient mb-2">{stat.value}</p>
              <p className="text-slate-400">{stat.label}</p>
            </div>
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
              className="glass-card rounded-3xl p-6 card-hover"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="glass-card rounded-3xl p-8 mb-20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Patient Arrives", desc: "Quick registration with basic details" },
              { step: "2", title: "Voice Interview", desc: "AI asks relevant questions via voice" },
              { step: "3", title: "Auto Form Fill", desc: "Medical forms filled automatically" },
              { step: "4", title: "Staff Review", desc: "Doctor reviews and approves" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Emergency Care?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join hospitals that are reducing emergency paperwork time by 80% while improving patient care quality.
          </p>
          <Link href="/login">
            <Button className="h-16 px-12 text-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 rounded-2xl shadow-lg shadow-red-500/30">
              Get Started Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </motion.div>
      </main>

      <footer className="relative z-10 container mx-auto px-4 py-8 mt-20 border-t border-slate-800">
        <div className="flex items-center justify-between text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span>EmergencyAI - AI-Powered Medical Form Automation</span>
          </div>
          <div className="flex items-center gap-6">
            <span>HIPAA Compliant</span>
            <span>256-bit Encryption</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
