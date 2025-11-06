import { HttpHandler, IHttpResponse } from "@/core/data/interfaces/HttpHandler";
import { InventoryItem, ItemColor } from "../data/interfaces/inventory.interface";
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

export class ItemColorService {
    private static instance: ItemColorService;
    private static readonly url = 'item-colors';
    private static readonly urlItem = 'items';
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
            // Use the specific item-colors endpoint with allRecords=true
            const response = await this.httpClient.get<IHttpResponse<{ records: ItemColor[], total: number, limit: number, page: number, pages: number }>>(
                `${ItemColorService.url}?allRecords=true&itemId=${itemId}`
            );

            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }

            const colors = response.data?.data?.records || [];

            // The data already has the correct structure, just ensure itemId is set
            const mappedColors = colors.map((color: any) => ({
                id: color.id || 0,
                itemId: color.itemId || itemId,
                colorId: color.color?.id || 0,
                isMainColor: color.isMainColor || false,
                color: color.color
            }));

            return mappedColors;
        } catch (error) {
            console.error('Error fetching item colors:', error);
            throw error;
        }
    }

    public async removeAllColorsFromItem(itemId: number): Promise<void> {
        try {

            // First, get all colors for this item
            const colors = await this.getItemColors(itemId);

            // Remove each color individually
            const removePromises = colors.map(color => {
                if (color.id && color.id > 0) {
                    return this.removeColorFromItem(color.id);
                } else {
                    console.warn('Color has no valid ID:', color);
                    return Promise.resolve();
                }
            });

            // Execute all removals in parallel
            await Promise.all(removePromises);
        } catch (error) {
            console.error('Error removing all colors from item:', error);
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