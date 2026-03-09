import API from "./axios";

export const uploadLog = (formData) =>
  API.post("/logs/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMyLogs = () => API.get("/logs/my");

export const getLogById = (id) => API.get(`/logs/${id}`);
export const getAllLogs = (params) =>
  API.get(`/logs/alllogs`, { params });


export const getPublicReport = (id) => {
  return axios.get(`/api/logs/report/${id}`);
};