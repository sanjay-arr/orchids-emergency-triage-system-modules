"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Heart,
  User,
  Lock,
  Stethoscope,
  UserCog,
  Users,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Shield,
} from "lucide-react";

type UserRole = "patient" | "caregiver" | "nurse" | "doctor" | "admin";

const DEMO_USERS = [
  { role: "doctor" as UserRole, name: "Dr. Sharma", id: "DOC001", icon: Stethoscope, color: "from-blue-600 to-cyan-500" },
  { role: "nurse" as UserRole, name: "Nurse Priya", id: "NUR001", icon: Users, color: "from-pink-600 to-rose-500" },
  { role: "admin" as UserRole, name: "Admin User", id: "ADM001", icon: UserCog, color: "from-purple-600 to-violet-500" },
  { role: "caregiver" as UserRole, name: "Family Member", id: "CAR001", icon: User, color: "from-emerald-600 to-teal-500" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = (role: UserRole, name: string, id: string) => {
    setIsLoading(true);
    localStorage.setItem("emergency_user", JSON.stringify({ role, name, id }));
    setTimeout(() => {
      if (role === "doctor" || role === "nurse" || role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/emergency");
      }
    }, 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }
    setIsLoading(true);
    localStorage.setItem("emergency_user", JSON.stringify({ 
      role: selectedRole || "caregiver", 
      name: username, 
      id: `USR${Date.now().toString(36).toUpperCase()}` 
    }));
    setTimeout(() => {
      router.push("/emergency");
    }, 800);
  };

  const handleGuestAccess = () => {
    setIsLoading(true);
    localStorage.setItem("emergency_user", JSON.stringify({ 
      role: "patient", 
      name: "Guest User", 
      id: `GST${Date.now().toString(36).toUpperCase()}` 
    }));
    setTimeout(() => {
      router.push("/emergency");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(220,38,38,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(234,88,12,0.1),transparent_50%)]" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-red-500/30 rotate-3">
                <Heart className="w-12 h-12 text-white animate-heartbeat" />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-6 py-2 mb-4"
          >
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Secure Healthcare Portal</span>
          </motion.div>

          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Emergency <span className="text-gradient">Medical System</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            AI-powered voice-based emergency form automation for faster, safer medical response
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Quick Access
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Select your role for instant demo access
            </p>

            <div className="grid grid-cols-2 gap-4">
              {DEMO_USERS.map((user, idx) => (
                <motion.button
                  key={user.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickLogin(user.role, user.name, user.id)}
                  disabled={isLoading}
                  className={`relative p-5 rounded-2xl bg-gradient-to-br ${user.color} text-white shadow-lg transition-all overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <user.icon className="w-8 h-8 mb-3" />
                  <p className="font-bold text-lg">{user.name}</p>
                  <p className="text-white/70 text-xs">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                </motion.button>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={handleGuestAccess}
              disabled={isLoading}
              className="w-full mt-6 h-14 glass-card-light rounded-2xl text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              Continue as Guest (Patient)
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Lock className="w-5 h-5 text-blue-400" />
              Staff Login
            </h2>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="status-critical rounded-xl p-4 flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 text-sm">{error}</span>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Role</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["doctor", "nurse", "admin"] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        selectedRole === role
                          ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30"
                          : "glass-card-light text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Username / Employee ID</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="h-14 pl-12 glass-card border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-14 pl-12 glass-card border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 rounded-xl shadow-lg shadow-red-500/30 transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-slate-500 text-xs text-center">
                Demo credentials: Any username/password works for testing
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
