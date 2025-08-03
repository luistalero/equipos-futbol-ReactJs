import apiClient from './apiClient';

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    const { token, role } = response.data;
    return { token, role };
  } catch (error) {
    throw error.response.data;
  }
};