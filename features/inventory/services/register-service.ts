import { RegisterFormData } from "../data/interfaces/register.interface";
import { HTTP_STATUS_CODE } from "@/core/data/HttpStatus";
import { HttpHandler } from "@/core/data/interfaces/HttpHandler";
import { AxiosClient } from "@/core/infrestucture/AxiosClient";
import { InventoryItem } from "../data/interfaces/inventory.interface";


export class RegisterService {
  private static instance: RegisterService;
  private httpClient: HttpHandler;
  private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}inventory`;

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  public static getInstance(): RegisterService {
    if (!RegisterService.instance) {
      RegisterService.instance = new RegisterService();
    }
    return RegisterService.instance;
  }

  async registerItem(item: RegisterFormData): Promise<InventoryItem> {
    try {
      const response = await this.httpClient.post<InventoryItem>(`${RegisterService.url}/register`, item);

      if (!response.success) {
        throw new Error(response.message.content[0] || "Error al registrar el ítem");
      }
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      console.error("Error en registro:", axiosError.message);

      if (axiosError.response?.data?.message?.content) {
        throw new Error(axiosError.response.data.message.content[0]);
      }

      if (axiosError.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
        throw new Error("No autorizado: Verifique el token de autenticación");
      }

      throw new Error("Error al registrar el ítem");
    }
  }
}