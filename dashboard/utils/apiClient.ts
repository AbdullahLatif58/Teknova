import axios from "axios";

const BASE_URL = "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});


axiosClient.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem("api_key");
  if (apiKey) {
    config.headers["x-api-key"] = apiKey;
  }
  return config;
});


axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default axiosClient;