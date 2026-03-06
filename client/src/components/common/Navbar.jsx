import { useAuth } from "../../../../client/src/context/AuthContext";
import AdminNavbar from "../../pages/admin/AdminNavbar";
import UserNavbar from "../../pages/user/UserNavbar";

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <>
      {user?.role === "admin" ? <AdminNavbar /> : <UserNavbar />}
      {children}
    </>
  );
};

export default Layout;