import axios from 'axios';
const axiosInstance = axios.create({
  // baseURL: ROOT_URL,
});
const logout = () => {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href('http://localhost:5173')
}
// Request interceptor to add custom header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      // If token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error(error)
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // If response is successful, just return the data
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      const { status, data } = error.response;
       if (status === 403) {
        console.log(data.status)
        data.status=='Token is Expired'?logout():null
      }
    } 

    return Promise.reject(error); // Reject the promise to propagate the error to the caller
  }
);

export default axiosInstance;