import { RegisterFormData } from "../data/interfaces/register.interface";
import { AxiosClient } from "@/core/infrestucture/AxiosClient";
import { IHttpResponse } from "@/core/data/interfaces/HttpHandler";
import { HTTP_STATUS_CODE } from "@/core/data/HttpStatus";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = AxiosClient.getInstance();

function getAuthHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
}
export class RegisterService {

  
  static async registerItem(data: RegisterFormData): Promise<boolean> {
    if (!API_URL) {
      throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
    }

    try {
      const response = await apiClient.post<IHttpResponse<void>>("/inventory/register", data
        ,getAuthHeaders()

      );
      if (!response.success) {
        throw new Error(response.message.content[0] || "Error al registrar el ítem");
      }
      return response.statusCode === HTTP_STATUS_CODE.CREATED;
    } catch (error) {
      const axiosError = error as any;
      console.error("Error en registro:", axiosError.message);
      if (axiosError.response?.data?.message?.content) {
        throw new Error(axiosError.response.data.message.content[0]);
      }
      if (axiosError.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
        throw new Error("No autorizado: Verifique el token de autenticación.");
      }
      return false;
    }
  }
}