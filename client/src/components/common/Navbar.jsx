import { useAuth } from "../../../../client/src/context/AuthContext";
import AdminNavbar from "../../pages/admin/AdminNavbar";
import UserNavbar from "../../pages/user/UserNavbar";

// Navbar component
const Layout = ({ children }) => {
  // Access user data
  const { user } = useAuth();

  return (
    <>
    {/* If user is admin, show admin navbar, else show user navbar */}
      {user?.role === "admin" ? <AdminNavbar /> : <UserNavbar />}
      {children}
    </>
  );
};

export default Layout;