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
            // Use the specific item-materials endpoint with allRecords=true
            const response = await this.httpClient.get<IHttpResponse<{ records: ItemMaterial[], total: number, limit: number, page: number, pages: number }>>(
                `${ItemMaterialService.url}?allRecords=true&itemId=${itemId}`
            );

            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }

            const materials = response.data?.data?.records || [];

            // The data already has the correct structure, just ensure itemId is set
            const mappedMaterials = materials.map((material: any) => ({
                id: material.id || 0,
                itemId: material.itemId || itemId,
                materialId: material.material?.id || 0,
                isMainMaterial: material.isMainMaterial || false,
                material: material.material
            }));

            return mappedMaterials;
        } catch (error) {
            console.error('Error fetching item materials:', error);
            throw error;
        }
    }

    public async removeAllMaterialsFromItem(itemId: number): Promise<void> {
        try {

            // First, get all materials for this item
            const materials = await this.getItemMaterials(itemId);

            // Remove each material individually
            const removePromises = materials.map(material => {
                if (material.id && material.id > 0) {
                    return this.removeItemMaterial(material.id);
                } else {
                    console.warn('Material has no valid ID:', material);
                    return Promise.resolve();
                }
            });

            // Execute all removals in parallel
            await Promise.all(removePromises);
        } catch (error) {
            console.error('Error removing all materials from item:', error);
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

    public async removeItemMaterial(id: number): Promise<void> {
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