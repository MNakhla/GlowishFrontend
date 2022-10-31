import axios from "axios";

import axiosRetry from "axios-retry";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API,
  timeout: 10000,
  headers: {
    common: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
});

instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosRetry(instance, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

const api = () => {
  return instance;
};

export default api;
