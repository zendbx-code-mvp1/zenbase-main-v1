"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await api.getCurrentUser();
        setUser(userData);
      }
    } catch {
      // Token invalid or backend unreachable — clear it and continue
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Step 1: get token
    await api.login(email, password);

    // Step 2: fetch user profile
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch {
      // If /auth/me fails for some reason, still proceed — token is stored
      setUser({ id: '', email, username: email.split('@')[0], avatar_url: undefined });
    }

    // Step 3: navigate
    router.push('/dashboard');
  };

  const register = async (email: string, username: string, password: string) => {
    await api.register(email, username, password);
    // register already calls login internally in api.ts, so just fetch user
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch {
      setUser({ id: '', email, username, avatar_url: undefined });
    }
    router.push('/dashboard');
  };

  // Logout is synchronous — clear local state immediately, no network call needed
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Fire-and-forget the server logout — don't await it
    api.logout().catch(() => {});
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
