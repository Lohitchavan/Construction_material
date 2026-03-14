import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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

