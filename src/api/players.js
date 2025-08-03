import apiClient from './apiClient';

export const getPlayers = async () => {
  try {
    const response = await apiClient.get('/players');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createPlayer = async (playerData) => {
  try {
    const response = await apiClient.post('/players', playerData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updatePlayer = async (playerId, playerData) => {
  try {
    const response = await apiClient.put(`/players/${playerId}`, playerData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletePlayer = async (playerId) => {
  try {
    const response = await apiClient.delete(`/players/${playerId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};