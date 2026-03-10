import API from "./axios";

// Upload log
export const uploadLog = (formData) =>
  API.post("/logs/upload", formData, {
    // Set the content type to multipart/form-data
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Get own logs
export const getMyLogs = () => API.get("/logs/my");

// Get log by id
export const getLogById = (id) => API.get(`/logs/${id}`);
// Get all logs
export const getAllLogs = (params) =>
  API.get(`/logs/alllogs`, { params });

