import axios from "axios";

const instance = axios.create({
  baseURL: "https://portfolio-generator-lf2a.onrender.com/api", // ✅ Render backend live URL
});

// auto attach token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
