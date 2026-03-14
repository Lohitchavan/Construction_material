/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

const STORAGE_KEY = "cm_auth";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStored()?.token || null);
  const [user, setUser] = useState(() => readStored()?.user || null);

  useEffect(() => {
    try {
      if (token && user) localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [token, user]);

  useEffect(() => {
    api.setToken(token);
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed: Boolean(token && user),
      async login(email, password) {
        const { data } = await api.post("/auth/login", { email, password });
        setToken(data.token);
        setUser(data.user);
        return data;
      },
      async register(name, email, password) {
        const { data } = await api.post("/auth/register", { name, email, password });
        setToken(data.token);
        setUser(data.user);
        return data;
      },
      logout() {
        setToken(null);
        setUser(null);
      },
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

