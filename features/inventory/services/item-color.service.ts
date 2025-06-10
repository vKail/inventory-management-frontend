import { HttpHandler, IHttpResponse } from "@/core/data/interfaces/HttpHandler";
import { InventoryItem, ItemColor } from "../data/interfaces/inventory.interface";
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

export class ItemColorService {
    private static instance: ItemColorService;
    private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}item-colors`;
    private static readonly urlItem = `${process.env.NEXT_PUBLIC_API_URL}items`;
    private httpClient: HttpHandler;

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): ItemColorService {
        if (!ItemColorService.instance) {
            ItemColorService.instance = new ItemColorService();
        }
        return ItemColorService.instance;
    }

    public async getItemColors(itemId: number): Promise<ItemColor[]> {
        try {
            const response = await this.httpClient.get<InventoryItem>(`${ItemColorService.urlItem}/${itemId}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data?.colors || [];
        } catch (error) {
            console.error('Error fetching item colors:', error);
            throw error;
        }
    }

    public async addColorToItem(data: { itemId: number; colorId: number; isMainColor: boolean }): Promise<ItemColor> {
        try {
            const response = await this.httpClient.post<IHttpResponse<ItemColor>>(ItemColorService.url, data);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data.data;
        } catch (error) {
            console.error('Error adding color to item:', error);
            throw error;
        }
    }

    public async removeColorFromItem(id: number): Promise<void> {
        try {
            const response = await this.httpClient.delete<IHttpResponse<void>>(`${ItemColorService.url}/${id}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
        } catch (error) {
            console.error('Error removing color from item:', error);
            throw error;
        }
    }

    public async updateItemColor(id: number, data: { isMainColor: boolean }): Promise<ItemColor> {
        try {
            const response = await this.httpClient.patch<IHttpResponse<ItemColor>>(`${ItemColorService.url}/${id}`, data);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data.data;
        } catch (error) {
            console.error('Error updating item color:', error);
            throw error;
        }
    }
} 