import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "CUSTOMER";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const response = await api.get("/auth/me");
          if (response.data && response.data.success) {
            setUser(response.data.data);
            setToken(storedToken);
          } else {
            // If response is not success, clear token
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          console.error("Failed to restore session:", error);
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data && response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data.data;
      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    // 1. Send signup request to the correct route (/auth/register)
    const signupResponse = await api.post("/auth/register", { fullName, email, password });
    
    if (signupResponse.data && signupResponse.data.success) {
      // 2. Automatically log in the user immediately to establish token and session
      const loginResponse = await api.post("/auth/login", { email, password });
      
      if (loginResponse.data && loginResponse.data.success) {
        const { token: receivedToken, user: receivedUser } = loginResponse.data.data;
        localStorage.setItem("token", receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
