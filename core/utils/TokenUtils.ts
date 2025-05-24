import axios from 'axios';

export const getToken = () => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];
  return token ? decodeURIComponent(token) : null;
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
