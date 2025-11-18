import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Update this URL based on your backend deployment
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api' 
  : 'https://api.rgipt-hub.com/api';

export const SOCKET_URL = __DEV__
  ? 'http://localhost:3001'
  : 'https://api.rgipt-hub.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userData');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
