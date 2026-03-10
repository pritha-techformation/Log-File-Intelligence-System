import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./global.css";

// ----- Auth Context -----
import { useAuth } from "./context/AuthContext";

// ----- Layout Components -----
import Layout from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// ----- Route Protection -----
import ProtectedRoute from "./components/common/ProtectedRoute";

// ----- Public Pages -----
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import LogoutPage from "./pages/auth/Logout";
import NotFound from "./pages/NotFound";
import WaitingApproval from "./pages/auth/Waiting";


// ----- User Pages -----
import HistoryPage from "./pages/user/HistoryPage";

// ----- Admin Pages -----
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import FileMonitoring from "./pages/admin/FileMonitoring";

// ----- Log Components -----
import LogUpload from "./components/LogUpload";
import LogResults from "./components/LogResults";

const App = () => {
  // Get authentication state
  const { isAuthenticated, loading } = useAuth();

  // Get current route location
  const location = useLocation();

  // Show loading screen while checking authentication
  if (loading) return <div>Loading...</div>;

  // Hide Navbar and Footer on login and signup pages
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/waitingforapproval";

  return (
    <>
      {/* Navbar */}
      {!hideLayout && <Layout />}

      {/* Global Toast Notifications */}
      <Toaster position="top-right" />

      {/* Application Routes */}
      <Routes>

        {/* ---------------- Public Routes ---------------- */}

        {/* Login Page */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          }
        />

        {/* Signup Page */}
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Signup />
          }
        />

        {/* Page shown when user is waiting for admin approval */}
        <Route path="/waitingforapproval" element={<WaitingApproval />} />

        {/* ---------------- Protected Routes ---------------- */}

        {/* Home Page */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Upload Log File */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <LogUpload />
            </ProtectedRoute>
          }
        />

        {/* User Upload History */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Log Analysis Result */}
        <Route
          path="/logs/:id"
          element={
            <ProtectedRoute>
              <LogResults />
            </ProtectedRoute>
          }
        />

        {/* Logout */}
        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <LogoutPage />
            </ProtectedRoute>
          }
        />

        {/* ---------------- Admin Routes ---------------- */}

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin User Management */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Admin File Monitoring */}
        <Route
          path="/admin/files"
          element={
            <ProtectedRoute role="admin">
              <FileMonitoring />
            </ProtectedRoute>
          }
        />

        {/* ---------------- 404 Route ---------------- */}

        {/* Catch all undefined routes */}
        <Route path="*" element={<NotFound />} />

      </Routes>

      {/* Footer */}
      {!hideLayout && <Footer />}
    </>
  );
};

export default App;