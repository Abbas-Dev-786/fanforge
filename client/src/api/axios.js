import axios from "axios";

const axiosInstance = axios.create({
  //   baseURL: "",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "MLB Fan App/1.0",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add custom headers or authentication if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // The MLB Stats API typically wraps responses in a data object
    return response.data;
  },
  (error) => {
    // Handle MLB Stats API specific errors
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 404:
          console.error("Resource not found:", data);
          break;
        case 429:
          console.error("Rate limit exceeded");
          break;
        default:
          console.error("API Error:", data);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
