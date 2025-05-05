import { RegisterFormData } from "../data/interfaces/register.interface";

export class RegisterService {
  static async registerItem(data: RegisterFormData): Promise<boolean> {
    try {
      // Simulación de llamada API
      console.log("Enviando datos al backend:", data);
      
      // En una implementación real:
      // const response = await axios.post('/api/inventory/register', data);
      // return response.status === 201;
      
      return true; // Simulación de éxito
    } catch (error) {
      console.error("Error en registro:", error);
      return false;
    }
  }
}