import axios from "axios";

const http = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// 请求拦截器：自动注入 token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一解包 data
http.interceptors.response.use(
  (response) => {
    return response.data.data ?? response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
