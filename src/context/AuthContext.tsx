"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserRole = "patient" | "doctor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  hospital?: string;
  specialization?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  updateProfile: () => {},
});

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "doctor@medcare.com": {
    password: "doctor123",
    user: {
      id: "doc-1",
      name: "Dr. Sarah Johnson",
      email: "doctor@medcare.com",
      role: "doctor",
      hospital: "City General Hospital",
      specialization: "Emergency Medicine",
    },
  },
  "patient@example.com": {
    password: "patient123",
    user: {
      id: "pat-1",
      name: "John Doe",
      email: "patient@example.com",
      role: "patient",
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser && demoUser.password === password && demoUser.user.role === role) {
      setUser(demoUser.user);
      localStorage.setItem("user", JSON.stringify(demoUser.user));
      setIsLoading(false);
      return true;
    }

    if (email && password.length >= 6) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0],
        email,
        role,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (name && email && password.length >= 6) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
