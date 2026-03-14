import axios from 'axios';

// Vite exposes env vars via import.meta.env and prefixes must be VITE_
const baseURL =
  import.meta.env.VITE_SUPPLIER_API || 'http://localhost:5001/api/supplier';

const api = axios.create({ baseURL });

export default api;
