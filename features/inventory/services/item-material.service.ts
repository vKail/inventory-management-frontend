import { HttpHandler, IHttpResponse } from "@/core/data/interfaces/HttpHandler";
import { InventoryItem, ItemMaterial } from "../data/interfaces/inventory.interface";
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

export class ItemMaterialService {
    private static instance: ItemMaterialService;
    private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}item-materials`;
    private static readonly urlItem = `${process.env.NEXT_PUBLIC_API_URL}items`;
    private httpClient: HttpHandler;

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): ItemMaterialService {
        if (!ItemMaterialService.instance) {
            ItemMaterialService.instance = new ItemMaterialService();
        }
        return ItemMaterialService.instance;
    }

    public async getItemMaterials(itemId: number): Promise<ItemMaterial[]> {
        try {
            const response = await this.httpClient.get<InventoryItem>(`${ItemMaterialService.urlItem}/${itemId}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data?.materials || [];
        } catch (error) {
            console.error('Error fetching item materials:', error);
            throw error;
        }
    }

    public async addMaterialToItem(data: { itemId: number; materialId: number; isMainMaterial: boolean }): Promise<ItemMaterial> {
        try {
            const response = await this.httpClient.post<IHttpResponse<ItemMaterial>>(ItemMaterialService.url, data);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data.data;
        } catch (error) {
            console.error('Error adding material to item:', error);
            throw error;
        }
    }

    public async removeMaterialFromItem(id: number): Promise<void> {
        try {
            const response = await this.httpClient.delete<IHttpResponse<void>>(`${ItemMaterialService.url}/${id}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
        } catch (error) {
            console.error('Error removing material from item:', error);
            throw error;
        }
    }

    public async updateItemMaterial(id: number, data: { isMainMaterial: boolean }): Promise<ItemMaterial> {
        try {
            const response = await this.httpClient.patch<IHttpResponse<ItemMaterial>>(`${ItemMaterialService.url}/${id}`, data);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data.data;
        } catch (error) {
            console.error('Error updating item material:', error);
            throw error;
        }
    }
} 