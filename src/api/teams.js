import apiClient from './apiClient';

export const getTeams = async () => {
  try {
    const response = await apiClient.get('/teams');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createTeam = async (teamData) => {
  try {
    const response = await apiClient.post('/teams', teamData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateTeam = async (teamId, teamData) => {
  try {
    const response = await apiClient.put(`/teams/${teamId}`, teamData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteTeam = async (teamId) => {
  try {
    const response = await apiClient.delete(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTeamById = async (id) => {
  try {
    const response = await apiClient.get(`/teams/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};