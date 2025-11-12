import { createContext, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signin", { email, password });
      const { token, user: userData } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { ok: true, user: userData };
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ name, email, password, role }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });
      const { token, user: userData } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { ok: true, user: userData };
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
