const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

import axios from "axios";
const instance = axios.create({
  baseURL: API_BASE_URL,
});

export default instance;
