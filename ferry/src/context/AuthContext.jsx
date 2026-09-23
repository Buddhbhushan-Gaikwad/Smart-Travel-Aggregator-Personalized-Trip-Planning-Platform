import { createContext, useContext, useState, useCallback } from "react";
import * as authApi from "../services/authApi";
import { getAuthToken, setAuthToken } from "../services/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getAuthToken());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      const nextToken = res?.token || res?.accessToken;
      setUser(res?.user || res?.data?.user || res?.data || null);
      setAuthToken(nextToken);
      setToken(nextToken);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await authApi.register(data);
      const nextToken = res?.token || res?.accessToken;
      setUser(res?.user || res?.data?.user || res?.data || null);
      setAuthToken(nextToken);
      setToken(nextToken);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
