import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { ApiResponse, ItemType, PaginatedItemTypes } from '../data/interfaces/item-type.interface';

interface ItemTypeServiceProps {
  getItemTypes: (page?: number, limit?: number) => Promise<PaginatedItemTypes>;
  getItemTypeById: (id: string) => Promise<ItemType | undefined>;
  createItemType: (itemType: Omit<ItemType, 'id' | 'active'>) => Promise<ItemType | undefined>;
  updateItemType: (id: string, itemType: Partial<Omit<ItemType, 'id' | 'active'>>) => Promise<ItemType | undefined>;
  deleteItemType: (id: string) => Promise<void>;
}

export class ItemTypeService implements ItemTypeServiceProps {
  private static instance: ItemTypeService;
  private httpClient: HttpHandler;
  private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}item-types`;

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  public static getInstance(): ItemTypeService {
    if (!ItemTypeService.instance) {
      ItemTypeService.instance = new ItemTypeService();
    }
    return ItemTypeService.instance;
  }

  public async getItemTypes(page = 1, limit = 10): Promise<PaginatedItemTypes> {
    try {
      const response = await this.httpClient.get<PaginatedItemTypes>(
        `${ItemTypeService.url}?page=${page}&limit=${limit}`
      );
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error fetching item types:', error);
      throw error;
    }
  }

  public async getItemTypeById(id: string): Promise<ItemType | undefined> {
    try {
      const response = await this.httpClient.get<ItemType>(`${ItemTypeService.url}/${id}`);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error fetching item type:', error);
      return undefined;
    }
  }

  public async createItemType(itemType: Omit<ItemType, 'id' | 'active'>): Promise<ItemType | undefined> {
    try {
      const response = await this.httpClient.post<ItemType>(
        ItemTypeService.url,
        itemType
      );
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error creating item type:', error);
      throw error;
    }
  }

  public async updateItemType(id: string, itemType: Partial<Omit<ItemType, 'id' | 'active'>>): Promise<ItemType | undefined> {
    try {
      const response = await this.httpClient.patch<ItemType>(
        `${ItemTypeService.url}/${id}`,
        itemType
      );
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error updating item type:', error);
      throw error;
    }
  }

  public async deleteItemType(id: string): Promise<void> {
    try {
      const response = await this.httpClient.delete<ApiResponse<void>>(`${ItemTypeService.url}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message.content.join(', '));
      }
    } catch (error) {
      console.error('Error deleting item type:', error);
      throw error;
    }
  }
}

export const itemTypeService = ItemTypeService.getInstance();
