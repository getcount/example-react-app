/* eslint-disable no-param-reassign */
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'https://pi-hive.uk/api';

// Create an Axios instance
const AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    accept: 'application/json',
  },
});

// Request interceptor to handle token expiration and refresh
AxiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Token ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
AxiosInstance.interceptors.response.use(
  (response) =>
    // Return the response if it's successful
    response,
  // eslint-disable-next-line consistent-return
  (error) => {
    if (error.response.status === 401) {
      toast.error('Unauthorized');
      localStorage.clear();
      setTimeout(() => {
        window.location.replace('/signin');
      }, 3500);
    } else {
      // Return a rejected Promise with the error for further handling
      return Promise.reject(error);
    }
  },
);

export default AxiosInstance;
