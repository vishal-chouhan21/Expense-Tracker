import { createContext, useContext, useState, useEffect } from "react";
import Api from "../../Api/Api";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOGIN =================
  const login = async (phone, password) => {
    try {
      const res = await Api.post("/api/user/login", { phone, password });

      const userData = {
        token: res.data.token.trim(),
        phone: res.data.phone,
        role: res.data.role,
      };

      localStorage.setItem("token", userData.token); // ✅ consistent key
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // ========= RESTORE SESSION ============
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        await Api.get("/api/user/verify"); // backend verifies JWT
        setUser({ token });
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
