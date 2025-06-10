import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { IColor, IColorResponse, PaginatedColors } from '../data/interfaces/color.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

interface ColorFilters {
  name?: string;
  hexCode?: string;
  description?: string;
}

interface ColorServiceProps {
  getColors: (page?: number, limit?: number, filters?: ColorFilters) => Promise<PaginatedColors>;
  getColorById: (id: number) => Promise<IColorResponse | undefined>;
  createColor: (color: IColor) => Promise<IColorResponse | undefined>;
  updateColor: (id: number, color: IColor) => Promise<IColorResponse | undefined>;
  deleteColor: (id: number) => Promise<void>;
}


//// This service provides methods to interact with the color API, including fetching, creating, updating, and deleting colors.
// It uses Axios for HTTP requests and handles pagination for color data.
export class ColorService implements ColorServiceProps {
  private static instance: ColorService;
  private httpClient: HttpHandler;
  private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}/colors`;


  // Private constructor to enforce singleton pattern
  // This ensures that only one instance of ColorService is created throughout the application.
  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }


  // This method returns the singleton instance of ColorService.
  // If the instance does not exist, it creates a new one.
  public static getInstance(): ColorService {
    if (!ColorService.instance) {
      ColorService.instance = new ColorService();
    }
    return ColorService.instance;
  }


  // This method fetches a paginated list of colors from the API.
  // It accepts optional parameters for pagination (page and limit) and returns a promise that resolves to PaginatedColors.
  public async getColors(page = 1, limit = 10, filters?: ColorFilters): Promise<PaginatedColors> {
    try {
      let url = `${ColorService.url}?page=${page}&limit=${limit}`;
      if (filters) {
        if (filters.name) url += `&name=${encodeURIComponent(filters.name)}`;
        if (filters.hexCode) url += `&hexCode=${encodeURIComponent(filters.hexCode)}`;
        if (filters.description) url += `&description=${encodeURIComponent(filters.description)}`;
      }
      const response = await this.httpClient.get<PaginatedColors>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching colors:', error);
      return {
        records: [],
        total: 0,
        pages: 0,
        page: page,
        limit: limit,
      };
    }
  }


  // This method fetches a color by its ID from the API.
  // It returns a promise that resolves to IColorResponse or undefined if the color is not found.
  public async getColorById(id: number): Promise<IColorResponse | undefined> {
    try {
      const { data } = await this.httpClient.get<IColorResponse>(`${ColorService.url}/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching color by ID:', error);
      throw error;
    }
  }


  // This method creates a new color in the API.
  // It accepts an IColor object and returns a promise that resolves to IColorResponse or undefined if the creation fails.
  public async createColor(color: IColor): Promise<IColorResponse | undefined> {
    try {
      const { data } = await this.httpClient.post<IColorResponse>(ColorService.url, color);
      return data;
    } catch (error) {
      console.error('Error creating color:', error);
      throw error;
    }
  }


  // This method updates an existing color in the API.
  // It accepts the color ID and an IColor object, and returns a promise that resolves to IColorResponse or undefined if the update fails.
  public async updateColor(id: number, color: IColor): Promise<IColorResponse | undefined> {
    try {
      const { data } = await this.httpClient.patch<IColorResponse>(
        `${ColorService.url}/${id}`,
        color
      );
      return data;
    } catch (error) {
      console.error('Error updating color:', error);
      throw error;
    }
  }


  // This method deletes a color by its ID from the API.
  // It returns a promise that resolves to void or throws an error if the deletion fails.
  public async deleteColor(id: number): Promise<void> {
    try {
      await this.httpClient.delete(`${ColorService.url}/${id}`);
    } catch (error) {
      console.error('Error deleting color:', error);
      throw error;
    }
  }
}
