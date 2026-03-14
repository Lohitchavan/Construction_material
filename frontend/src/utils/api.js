import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "https://construction-material-g0zq.onrender.com";
const normalizedBase = rawBase.replace(/\/+$/, "");
const baseURL = normalizedBase;


const instance = axios.create({
  baseURL,
});

let token = null;

instance.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Ensure the client always hits the /api namespace, even if VITE_API_URL is missing it.
  if (config.url && config.url.startsWith("/") && !config.url.startsWith("/api")) {
    config.url = `/api${config.url}`;
  }

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

