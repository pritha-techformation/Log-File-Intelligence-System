// components/admin/UserTable.jsx

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/UserTable.css";
import { getUsers } from "../../api/user.api";
import { markInactive } from "../../api/user.api";
import { approveUser } from "../../api/user.api";
import { deleteUser } from "../../api/user.api";
// import { fetchStats } from "../../pages/admin/AdminDashboard";
import ConfirmationDialog from "../common/ConfirmationDialog";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");

  const [pagination, setPagination] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await getUsers({
        page,
        limit: 5,
        search,
      });

      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const delay = setTimeout(() => {
    fetchUsers();
  }, 400);

  return () => clearTimeout(delay);
}, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleApprove = async (id) => {
    try {
      await approveUser(id);
      toast.success("User approved");
      fetchUsers(); // refresh
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const handleInactive = (id) => {
    setDialogConfig({
      title: "Mark User Inactive",
      message: "This user will no longer be able to log in.",
      onConfirm: async () => {
        try {
          await markInactive(id);
          toast.success("User marked inactive");
          fetchUsers();
        } catch {
          toast.error("Action failed");
        }
        setDialogOpen(false);
      },
    });

    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    setDialogConfig({
      title: "Delete User",
      message:
        "This action cannot be undone. Are you sure you want to delete this user?",
      onConfirm: async () => {
        try {
          await deleteUser(id);
          toast.success("User deleted");
          fetchUsers();
        } catch {
          toast.error("Delete failed");
        }
        setDialogOpen(false);
      },
    });

    setDialogOpen(true);
  };

  return (
    <div className="user-table-wrapper">
      <div className="table-header">
        <h2>👥 Registered Users</h2>

        <input
          type="text"
          placeholder="Search users by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th>Activity</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="name-cell">{user.name}</td>
                <td>{user.email}</td>

                <td>
                  <span className={`badge ${user.status}`}>{user.status}</span>
                </td>

                <td>
                  <span className="role">{user.role}</span>
                </td>

                <td>
                  <span className="activity">{user.activity}</span>
                </td>

                <td className="actions">
                  {user.status === "pending" && (
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </button>
                  )}

                  {user.status === "approved" && user.activity === "active" && (
                    <button
                      className="inactive-btn"
                      onClick={() => handleInactive(user._id)}
                    >
                      Inactivate
                    </button>
                  )}

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button
          disabled={!pagination.previousPage}
          onClick={() => setPage(pagination.previousPage)}
        >
          ← Prev
        </button>

        <span>
          Page {pagination.currentPage} / {pagination.totalPages}
        </span>

        <button
          disabled={!pagination.nextPage}
          onClick={() => setPage(pagination.nextPage)}
        >
          Next →
        </button>
      </div>

      <ConfirmationDialog
        isOpen={dialogOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        onConfirm={dialogConfig.onConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default UserTable;
