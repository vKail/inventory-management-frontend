import axios from 'axios';

export const getToken = async () => {
  try {
    const response = await axios.get('/api/auth/get-token');
    return response.data.token || null;
  } catch {
    return null;
  }
};

export const removeToken = async () => {
  try {
    await axios.post(
      '/api/auth/remove-cookie',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error al eliminar la cookie:', error);
  }
};
