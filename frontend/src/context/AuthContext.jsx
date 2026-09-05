import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("autoprice_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  function persist(token, user) {
    localStorage.setItem("autoprice_token", token);
    localStorage.setItem("autoprice_user", JSON.stringify(user));
    setUser(user);
  }

  async function register(name, email, password) {
    const { data } = await client.post("/auth/register", { name, email, password });
    persist(data.token, data.user);
    return data.user;
  }

  async function login(email, password) {
    const { data } = await client.post("/auth/login", { email, password });
    persist(data.token, data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("autoprice_token");
    localStorage.removeItem("autoprice_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
