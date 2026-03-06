import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/auth.api";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      setUser(null);
    }
  }

  setLoading(false);
}, []);


  const login = async (data) => {
  try {
    const res = await loginUser(data);

    const token = res.data.token;
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);
    
    setUser(decoded);

    console.log("Decoded JWT:", decoded);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        role: user?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);