import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "https://construction-material-g0zq.onrender.com/api";

function resolveApiBase(base) {
  const trimmed = String(base || "").trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    return `${url.protocol}//${url.host}/api`;
  } catch {
    // If it's not a full URL, fall back to a safe normalized path.
    const normalized = trimmed.replace(/\/+$|\/products(\/.*)?$/i, "");
    return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
  }
}

const baseURL = resolveApiBase(rawBase);

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

