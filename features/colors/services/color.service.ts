import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { IColor, IColorResponse, PaginatedColors } from '../data/interfaces/color.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

// Funciones de utilidad para formatear texto
const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const capitalizeWords = (text: string): string => {
  if (!text) return '';
  return text.split(' ').map(word => capitalizeFirstLetter(word)).join(' ');
};

const formatNullValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return 'No Aplica';
  }
  return value;
};

interface ColorServiceProps {
  getColors: (page?: number, limit?: number, search?: string, allRecords?: boolean) => Promise<PaginatedColors>;
  getColorById: (id: number) => Promise<IColorResponse | undefined>;
  createColor: (color: IColor) => Promise<IColorResponse | undefined>;
  updateColor: (id: number, color: IColor) => Promise<IColorResponse | undefined>;
  deleteColor: (id: number) => Promise<void>;
}

export class ColorService implements ColorServiceProps {
  private static instance: ColorService;
  private httpClient: HttpHandler;
  private static readonly url = 'colors';

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  public static getInstance(): ColorService {
    if (!ColorService.instance) {
      ColorService.instance = new ColorService();
    }
    return ColorService.instance;
  }

  public async getColors(page = 1, limit = 10, search = '', allRecords = false): Promise<PaginatedColors> {
    try {
      let url = `${ColorService.url}?page=${page}&limit=${limit}`;
      if (search && search.trim() !== '') url += `&name=${encodeURIComponent(search)}`;

      if (allRecords) {
        url += `&allRecords=true`;
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

  public async getColorById(id: number): Promise<IColorResponse | undefined> {
    try {
      const { data } = await this.httpClient.get<IColorResponse>(`${ColorService.url}/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching color by ID:', error);
      throw error;
    }
  }

  public async createColor(color: IColor): Promise<IColorResponse | undefined> {
    try {
      // Aplicar formato de texto
      const formattedColor = {
        ...color,
        name: color.name ? capitalizeWords(color.name.trim()) : '',
        description: color.description ? capitalizeWords(color.description.trim()) : ''
      };

      const { data } = await this.httpClient.post<IColorResponse>(ColorService.url, formattedColor);
      return data;
    } catch (error) {
      console.error('Error creating color:', error);
      throw error;
    }
  }

  public async updateColor(id: number, color: IColor): Promise<IColorResponse | undefined> {
    try {
      // Aplicar formato de texto
      const formattedColor = {
        ...color,
        name: color.name ? capitalizeWords(color.name.trim()) : '',
        description: color.description ? capitalizeWords(color.description.trim()) : ''
      };

      const { data } = await this.httpClient.patch<IColorResponse>(
        `${ColorService.url}/${id}`,
        formattedColor
      );
      return data;
    } catch (error) {
      console.error('Error updating color:', error);
      throw error;
    }
  }

  public async deleteColor(id: number): Promise<void> {
    try {
      await this.httpClient.delete(`${ColorService.url}/${id}`);
    } catch (error) {
      console.error('Error deleting color:', error);
      throw error;
    }
  }
}
