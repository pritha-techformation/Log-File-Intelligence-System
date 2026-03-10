// components/admin/UserTable.jsx

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/UserTable.css";
import { getUsers, markInactive, markActive, approveUser, deleteUser } from "../../api/user.api";
import ConfirmationDialog from "../common/ConfirmationDialog";


// User table component
const UserTable = () => {

  // states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({});

  // fetch users from api
  const fetchUsers = async () => {

    // Get all users
    try {
      setLoading(true);

      // Get users from api with pagination and search
      const res = await getUsers({
        page,
        limit: 5,
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      // Filter out admin
      const filteredUsers = res.data.users.filter(
        (user) => user.role !== "admin",
      );

      // Set users and pagination
      setUsers(filteredUsers);
      setPagination(res.data.pagination || {});
    } catch (err) {
      // Handle error
      toast.error("Failed to fetch users");
    } finally {
      // Set loading to false
      setLoading(false);
    }
  };

  // fetch users when search or status filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // fetch users when page changes
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(delay);
  }, [page, search, statusFilter]);

  // handle approve
  const handleApprove = async (id) => {
    try {
      await approveUser(id);
      toast.success("User approved");
      fetchUsers(); // refresh
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  // handle inactive
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

  // handle activate
  const handleActivate = (id) => {
    setDialogConfig({
      title: "Activate User",
      message: "This user will regain access to the system.",
      onConfirm: async () => {
        try {
          await markActive(id);
          toast.success("User activated");
          fetchUsers();
        } catch {
          toast.error("Action failed");
        }
        setDialogOpen(false);
      },
    });

    setDialogOpen(true);
  };

  // handle delete
  const handleDelete = (id) => {

    // set dialog config for delete
    setDialogConfig({
      title: "Delete User",
      message:
        "This action cannot be undone. Are you sure you want to delete this user?",

        // on confirm delete user by id
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
    <div className="user-table-layout">

      {/* FILTER TOPBAR */}
      <div className="filter-sidebar">
        <h1>Filters</h1>

        <button
          className={statusFilter === "all" ? "active-filter" : ""}
          onClick={() => setStatusFilter("all")}
        >
          All Users
        </button>

        <button
          className={statusFilter === "pending" ? "active-filter" : ""}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </button>

        <button
          className={statusFilter === "approved" ? "active-filter" : ""}
          onClick={() => setStatusFilter("approved")}
        >
          Approved
        </button>

        <button
          className={statusFilter === "inactive" ? "active-filter" : ""}
          onClick={() => setStatusFilter("inactive")}
        >
          Inactive
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* TABLE */}
      <div className="user-table-wrapper">
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
                    <span className={`badge ${user.status}`}>
                      {user.status}
                    </span>
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

                    {user.status === "approved" &&
                      user.activity === "active" && (
                        <button
                          className="inactive-btn"
                          onClick={() => handleInactive(user._id)}
                        >
                          Inactivate
                        </button>
                      )}

                    {user.status === "approved" &&
                      user.activity === "inactive" && (
                        <button
                          className="approve-btn"
                          onClick={() => handleActivate(user._id)}
                        >
                          Activate
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
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={!pagination?.previousPage}
          onClick={() => setPage(pagination.previousPage)}
        >
          ← Prev
        </button>

        <span>
          Page {pagination?.currentPage || 1} / {pagination?.totalPages || 1}
        </span>

        <button
          disabled={!pagination?.nextPage}
          onClick={() => setPage(pagination.nextPage)}
        >
          Next →
        </button>
      </div>

      {/* CONFIRMATION DIALOG */}
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
