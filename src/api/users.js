import apiClient from './apiClient';

const USERS_ENDPOINT = '/users';

export const getUsers = async () => {
  try {
    const response = await apiClient.get(USERS_ENDPOINT);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`${USERS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post(USERS_ENDPOINT, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`${USERS_ENDPOINT}/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`${USERS_ENDPOINT}/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};