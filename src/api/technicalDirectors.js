import apiClient from './apiClient';

export const getTechnicalDirectors = async () => {
  try {
    const response = await apiClient.get('/technical-directors');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTechnicalDirectorById = async (id) => {
  try {
    const response = await apiClient.get(`/technical-directors/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createTechnicalDirector = async (directorData) => {
  try {
    const response = await apiClient.post('/technical-directors', directorData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateTechnicalDirector = async (directorId, directorData) => {
  try {
    const response = await apiClient.put(`/technical-directors/${directorId}`, directorData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteTechnicalDirector = async (directorId) => {
  try {
    const response = await apiClient.delete(`/technical-directors/${directorId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};