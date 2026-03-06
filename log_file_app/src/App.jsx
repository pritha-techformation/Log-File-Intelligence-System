import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import "./global.css";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import Layout from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { useAuth } from "./context/AuthContext";
import Signup from "./pages/auth/Signup";
import LogoutPage from "./pages/auth/Logout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import FileMonitoring from "./pages/admin/FileMonitoring";
import HistoryPage from "./pages/user/HistoryPage";
import LogResults from "./components/LogResults";
import LogUpload from "./components/LogUpload";


const App = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  // Hide Navbar & Footer on login page
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideLayout && <Layout />}

      <Toaster position="top-center" />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin/dashboard" rolerequires="admin"
          element={
            isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin/users" rolerequires="admin"
          element={
            isAuthenticated ? <UserManagement /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin/files" rolerequires="admin"
          element={
            isAuthenticated ? <FileMonitoring /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          }
        />
        <Route
          path="/history"
          element={
            isAuthenticated ? <HistoryPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/upload"
          element={
            isAuthenticated ? <LogUpload /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/logs/:id" element={<LogResults />} />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/login" replace /> : <Signup />
          }
        />
        <Route
          path="/logout"
          element={
            isAuthenticated ? <LogoutPage /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>


      {!hideLayout && <Footer />}
    </>
  );
};

export default App;