import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL_DOCKER = 'http://localhost:1640/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL_DOCKER,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a cada petición
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;