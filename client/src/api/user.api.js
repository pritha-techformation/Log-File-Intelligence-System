import API from "./axios";

// Get all users
export const getUsers = (params) => API.get("/users", { params });

// Approve user
export const approveUser = (id) => API.patch(`/users/${id}/approve`);

// Mark user inactive
export const markInactive = (id) => API.patch(`/users/${id}/inactive`);

// Mark user active
export const markActive = (id) => API.patch(`/users/${id}/active`);

// Delete user
export const deleteUser = (id) => API.delete(`/users/${id}`);