import axios from "axios";

let inMemoryToken: string | null = null;

export const setToken = (token: string) => {
  inMemoryToken = token;
}

export const getToken = () => {
  if (inMemoryToken) {
    return inMemoryToken;
  }
  
  return null;
}

export const removeToken = async () => {
  inMemoryToken = null;
  
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