import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/auth.api";
import {jwtDecode} from "jwt-decode";

// Create context
const AuthContext = createContext();

// Create provider
export const AuthProvider = ({ children }) => {
  // State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect to check if user is logged in
  useEffect(() => {
  const token = localStorage.getItem("token");

  // Check if token exists
  if (token) {
    try {
      // Decode token
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      // If token is invalid, remove it from local storage
      console.error("Invalid token");
      localStorage.removeItem("token");
      setUser(null);
    }
  }

  // Set loading to false
  setLoading(false);
}, []);


// Functions to login and logout
  const login = async (data) => {
  try {
    // Login user
    const res = await loginUser(data);

    // Set token in local storage
    const token = res.data.token;
    localStorage.setItem("token", token);

    // Decode token
    const decoded = jwtDecode(token);
    
    // Set user
    setUser(decoded);

    console.log("Decoded JWT:", decoded);
  } catch (error) {
    // Throw error
    console.error(error);
    throw error;
  }
};

// Function to logout
  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    // Provide context
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

// Hook to access context
export const useAuth = () => useContext(AuthContext);