import API from "./axios";

export const getUsers = (params) => API.get("/users", { params });

export const approveUser = (id) => API.patch(`/users/${id}/approve`);

export const markInactive = (id) => API.patch(`/users/${id}/inactive`);

export const deleteUser = (id) => API.delete(`/users/${id}`);