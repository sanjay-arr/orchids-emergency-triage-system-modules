"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push(user.role === "doctor" ? "/doctor" : "/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6"
        >
          <Heart className="w-10 h-10 text-red-400" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">MedEmergency</h1>
        <p className="text-slate-400 mb-6">AI-Powered Triage System</p>
        <Loader2 className="w-6 h-6 text-red-400 animate-spin mx-auto" />
      </motion.div>
    </div>
  );
}
