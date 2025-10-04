// services/api.js
import axios from "axios";

// Configuración base de Axios
const api = axios.create({
  baseURL: "https://kanban-v1.up.railway.app/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
