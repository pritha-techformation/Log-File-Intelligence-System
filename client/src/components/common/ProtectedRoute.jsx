import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ProtectedRoute component
const ProtectedRoute = ({ children, role }) => {
  // Access user data
  const { isAuthenticated, loading, user } = useAuth();

  // If loading, show loading
  if (loading) return <div>Loading...</div>;

  // If not authenticated, redirect to login
  if (!isAuthenticated) return <Navigate to="/login" />;

  // If role is specified and user role does not match, redirect to home
  if (role && user.role !== role)
    return <Navigate to="/" />;

  // Otherwise, render children
  return children;
};

export default ProtectedRoute;