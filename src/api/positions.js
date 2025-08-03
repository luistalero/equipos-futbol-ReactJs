import apiClient from './apiClient';

export const getPositions = async () => {
  try {
    const response = await apiClient.get('/positions');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createPosition = async (positionData) => {
  try {
    const response = await apiClient.post('/positions', positionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updatePosition = async (positionId, positionData) => {
  try {
    const response = await apiClient.put(`/positions/${positionId}`, positionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletePosition = async (positionId) => {
  try {
    const response = await apiClient.delete(`/positions/${positionId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};