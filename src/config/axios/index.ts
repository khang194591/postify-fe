import axios from "axios";

const apiClient = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_SERVER_BASE_API}/api/v1`,
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    "accessToken"
  )}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return { ...response, success: true };
  },
  (error) => {
    const response = error.response;
    if (response) {
      const message = response.data.message;
      return { ...error.response, message, success: false };
    } else {
      return { ...error, message: error.message };
    }
  }
);

export default apiClient;
