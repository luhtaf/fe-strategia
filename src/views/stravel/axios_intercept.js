import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: ROOT_URL,
});

// Request interceptor to add custom header
axiosInstance.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;