import api from './apiClient';

export const importTeamsExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload/teams-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al importar equipos desde Excel.';
  }
};

export const importPositionsExcel = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await api.post('/upload/positions-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al importar posiciones desde Excel.';
    }
  };

export const importPlayersExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload/players-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al importar jugadores desde Excel.';
  }
};

export const importTechnicalDirectorsExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload/technical-directors-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al importar directores técnicos desde Excel.';
  }
};