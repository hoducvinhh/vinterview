'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, User, UpdateProfilePayload } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = api.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res?.data) {
          setUser(res.data);
        }
      } catch (err) {
        // Token invalid or expired
        api.setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    api.setToken(res.accessToken);
    setUser(res.user);
  };

  const googleLogin = async (idToken: string) => {
    const res = await api.googleLogin(idToken);
    api.setToken(res.accessToken);
    setUser(res.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await api.register({ email, password, name });
    api.setToken(res.accessToken);
    setUser(res.user);
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    const res = await api.updateProfile(payload);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        login,
        googleLogin,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
