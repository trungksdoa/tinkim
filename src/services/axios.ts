import axios, { AxiosStatic, AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  // Skip adding token for auth routes
  if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
    return config;
  }
// Get token from cookies instead of session storage
const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('authToken='))
  ?.split('=')[1];
  
  console.log('Token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;