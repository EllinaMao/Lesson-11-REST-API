import React, { createContext, useContext, useEffect, useState } from "react";

import { authApi } from "@/lib/auth-api";
import {
  clearPin,
  clearToken,
  getPin,
  getToken,
  savePin as savePinToStorage,
  saveToken,
} from "@/lib/storage";

interface AuthContextType {
  token: string | null;
  hasPin: boolean;
  isUnlocked: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setupPin: (pin: string) => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [hasPin, setHasPin] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [storedToken, storedPin] = await Promise.all([getToken(), getPin()]);
        if (storedToken) {
          setToken(storedToken);
        }
        setHasPin(!!storedPin);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await authApi.post("/auth/login", {
      username,
      password,
      expiresInMins: 30,
    });
    const { accessToken } = res.data;
    await saveToken(accessToken);
    setToken(accessToken);
  };

  const logout = async () => {
    await clearToken();
    await clearPin();
    setToken(null);
    setHasPin(false);
    setIsUnlocked(false);
  };

  const setupPin = async (pin: string) => {
    await savePinToStorage(pin);
    setHasPin(true);
    setIsUnlocked(true);
  };

  const unlock = async (pin: string) => {
    const storedPin = await getPin();
    const success = !!storedPin && storedPin === pin;
    if (success) {
      setIsUnlocked(true);
    }
    return success;
  };

  const lock = () => {
    setIsUnlocked(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, hasPin, isUnlocked, isLoading, login, logout, setupPin, unlock, lock }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
