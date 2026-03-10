import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Logout page
const LogoutPage = () => {
  // Hooks
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Handle logout
  React.useEffect(() => {
    const handleLogout = async () => {
      await logout();
      navigate("/login");
    };
    handleLogout();
  }, []);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default LogoutPage;
