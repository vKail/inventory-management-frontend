import { HttpHandler, IHttpResponse } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { IWarehouse, IWarehouseResponse, PaginatedWarehouses } from "../data/interfaces/warehouse.interface";

interface WarehouseServiceProps {
  getWarehouses: (page?: number, limit?: number) => Promise<PaginatedWarehouses>;
  getWarehouseById: (id: number) => Promise<IWarehouseResponse | undefined>;
  createWarehouse: (warehouse: IWarehouse) => Promise<IWarehouseResponse | undefined>;
  updateWarehouse: (id: number, warehouse: IWarehouse) => Promise<IWarehouseResponse | undefined>;
  deleteWarehouse: (id: number) => Promise<void>;
}

export class WarehouseService implements WarehouseServiceProps {
  private static instance: WarehouseService;
  private httpClient: HttpHandler;
  private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}warehouses`;

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  public static getInstance(): WarehouseService {
    if (!WarehouseService.instance) {
      WarehouseService.instance = new WarehouseService();
    }
    return WarehouseService.instance;
  }

  async getWarehouses(page: number = 1, limit: number = 10): Promise<PaginatedWarehouses> {
    try {
      const { data } = await this.httpClient.get<PaginatedWarehouses>(
        `${WarehouseService.url}?page=${page}&limit=${limit}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      return {
        records: [],
        total: 0,
        pages: 0,
        page: page,
        limit: limit,
      };
    }
  }

  async getWarehouseById(id: number): Promise<IWarehouseResponse | undefined> {
    try {
      const { data } = await this.httpClient.get<IWarehouseResponse>(
        `${WarehouseService.url}/${id}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching warehouse:', error);
      return undefined;
    }
  }

  async createWarehouse(warehouse: IWarehouse): Promise<IWarehouseResponse | undefined> {
    try {
      const { data } = await this.httpClient.post<IWarehouseResponse>(
        WarehouseService.url,
        warehouse
      );
      return data;
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  }

  async updateWarehouse(id: number, warehouse: IWarehouse): Promise<IWarehouseResponse | undefined> {
    try {
      const { data } = await this.httpClient.patch<IWarehouseResponse>(
        `${WarehouseService.url}/${id}`,
        warehouse
      );
      return data;
    } catch (error) {
      console.error('Error updating warehouse:', error);
      throw error;
    }
  }

  async deleteWarehouse(id: number): Promise<void> {
    try {
      await this.httpClient.delete<void>(`${WarehouseService.url}/${id}`);
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      throw error;
    }
  }
}

export const warehouseService = WarehouseService.getInstance();