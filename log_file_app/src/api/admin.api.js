import API from "./axios";

// Get logged-in admin profile
export const getAdmin = () => API.get("/admin/dashboard");

// Update logged-in admin profile
export const updateAdmin = (data) => API.put("/admin/profile", data);