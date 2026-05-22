import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import useStore from "../app/store";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, setUser, setToken, logout, isAuthenticated } = useStore();
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        // Clear invalid session
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [setUser, logout]);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        toast.success(`Welcome back, ${response.data.user.username}!`);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register handler
  const register = async (username, email, password) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        username,
        email,
        password,
      });
      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        toast.success(`Account created! Welcome ${username}!`);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.warn("Logout request failed, clearing local state anyway:", error);
    } finally {
      logout();
      toast.success("Logged out successfully.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
