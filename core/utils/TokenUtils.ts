import axios from "axios";

const TOKEN_KEY = 'auth_token';

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
}

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export const removeToken = async () => {
  localStorage.removeItem(TOKEN_KEY);
  
  try {
    (await axios.post('/api/auth/remove-cookie', {}, {
        headers: {
            "Content-Type": "application/json"
        }
    }));
  } catch (error) {
    console.error('Error al eliminar la cookie:', error);
  }
}