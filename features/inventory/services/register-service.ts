import { RegisterFormData } from "../data/interfaces/register.interface";
import axios from "axios";

// Obtenemos la URL del backend desde las variables de entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Creamos una instancia de axios con la base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export class RegisterService {
  static async registerItem(data: RegisterFormData): Promise<boolean> {
    try {
      // Llamada real al backend
      const response = await apiClient.post("/inventory/register", data);

      // Si la respuesta es exitosa (ej. 201 Created)
      return response.status === 201;
    } catch (error) {
      console.error("Error en registro:", error);

      // Manejo de errores más específico
      if (axios.isAxiosError(error)) {
        console.error("Respuesta del servidor:", error.response?.data);
      }

      return false;
    }
  }
}