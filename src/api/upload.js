import apiClient from './apiClient';

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};