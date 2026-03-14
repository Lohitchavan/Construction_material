import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "https://construction-material-g0zq.onrender.com/api";
const normalizedBase = rawBase.replace(/\/+$/, "");
const baseURL = normalizedBase.endsWith("/api")
  ? normalizedBase
  : `${normalizedBase}/api`;

const instance = axios.create({
  baseURL,
});

let token = null;

instance.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  setToken(nextToken) {
    token = nextToken || null;
  },
  get: instance.get,
  post: instance.post,
  put: instance.put,
  delete: instance.delete,
};

