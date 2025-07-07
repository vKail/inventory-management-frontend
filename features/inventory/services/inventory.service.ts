import { HttpHandler, IHttpResponse } from '@/core/data/interfaces/HttpHandler';
import { InventoryItem, PaginatedInventoryResponse } from '../data/interfaces/inventory.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import axios from "axios";

interface ImageUploadData {
    type?: 'PRIMARY' | 'SECONDARY' | 'DETAIL';
    isPrimary?: boolean;
    description?: string;
    photoDate?: string;
}

interface InventoryServiceProps {
    getInventoryItems: (page?: number, limit?: number, queryParams?: string) => Promise<PaginatedInventoryResponse>;
    getInventoryItemById: (id: string) => Promise<InventoryItem | undefined>;
    createInventoryItem: (item: FormData) => Promise<IHttpResponse<InventoryItem>>;
    updateInventoryItem: (id: string, item: Record<string, any>) => Promise<IHttpResponse<InventoryItem>>;
    deleteInventoryItem: (id: string) => Promise<void>;
    addImageToId: (itemId: number, file: File, imageData?: ImageUploadData) => Promise<void>;
    getInventoryItemByCode: (code: string) => Promise<InventoryItem | null>;
    addMultipleImagesToId: (itemId: number, images: Array<{ file: File; description: string; photoDate: string; isPrimary: boolean; type: 'PRIMARY' | 'SECONDARY' | 'DETAIL' }>) => Promise<void>;
    getInventoryItemByName: (name: string) => Promise<InventoryItem[]>;
    deleteImageById: (imageId: number) => Promise<void>;
    updateCondition: (itemId: number, conditionId: number, stock?: number) => Promise<IHttpResponse<InventoryItem>>;
}

export class InventoryService implements InventoryServiceProps {
    private static instance: InventoryService;
    private httpClient: HttpHandler;
    private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}items`;

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): InventoryService {
        if (!InventoryService.instance) {
            InventoryService.instance = new InventoryService();
        }
        return InventoryService.instance;
    }

    public async getInventoryItems(page = 1, limit = 10, queryParams = ''): Promise<PaginatedInventoryResponse> {
        try {
            const url = `${InventoryService.url}?page=${page}&limit=${limit}${queryParams ? `&${queryParams}` : ''}`;
            const response = await this.httpClient.get<PaginatedInventoryResponse>(url);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching inventory items:', error);
            throw error;
        }
    }

    private transformFormData(formData: FormData): Record<string, any> {
        const data: Record<string, any> = {};

        formData.forEach((value, key) => {
            // Convertir strings a números para campos específicos
            if (['stock', 'itemTypeId', 'categoryId', 'statusId', 'locationId',
                'custodianId', 'conditionId', 'certificateId', 'itemLine'].includes(key)) {
                const numValue = parseInt(value.toString(), 10);
                data[key] = isNaN(numValue) ? 0 : numValue;
            }
            // Convertir strings a booleanos
            else if (['availableForLoan', 'critical', 'dangerous',
                'requiresSpecialHandling', 'perishable'].includes(key)) {
                data[key] = value.toString().toLowerCase() === 'true';
            }
            // Convertir strings a fechas para campos de fecha
            else if (['acquisitionDate', 'warrantyDate', 'expirationDate'].includes(key)) {
                const date = value.toString();
                data[key] = date ? new Date(date).toISOString().split('T')[0] : null;
            }
            // Mantener como string para el resto
            else {
                data[key] = value.toString();
            }
        });

        return data;
    }

    private transformEditData(data: Record<string, any>): Record<string, any> {
        const transformed: Record<string, any> = {};

        // Convertir strings numéricos a números
        const numericFields = [
            'stock', 'itemTypeId', 'categoryId', 'statusId',
            'locationId', 'custodianId', 'conditionId', 'certificateId', 'itemLine'
        ];

        // Convertir strings booleanos a booleanos
        const booleanFields = [
            'critical', 'dangerous', 'requiresSpecialHandling',
            'perishable', 'availableForLoan'
        ];

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'id') return; // Ignorar el campo id

            if (numericFields.includes(key)) {
                const numValue = parseInt(value as string, 10);
                transformed[key] = isNaN(numValue) ? 0 : numValue;
            } else if (booleanFields.includes(key)) {
                transformed[key] = value === 'true';
            } else {
                transformed[key] = value;
            }
        });

        return transformed;
    }

    public async getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
        try {
            const response = await this.httpClient.get<InventoryItem>(`${InventoryService.url}/${id}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching inventory item:', error);
            return undefined;
        }
    }

    public async createInventoryItem(item: FormData): Promise<IHttpResponse<InventoryItem>> {
        try {
            const transformedData = this.transformFormData(item);

            const response = await this.httpClient.post<InventoryItem>(
                InventoryService.url,
                transformedData
            );

            return response;
        } catch (error) {
            console.error('Error creating inventory item:', error);
            throw error;
        }
    }

    public async updateInventoryItem(id: string, data: Record<string, any>): Promise<IHttpResponse<InventoryItem>> {
        try {
            const transformedData = this.transformEditData(data);
            const response = await this.httpClient.patch<InventoryItem>(
                `${InventoryService.url}/${id}`,
                transformedData
            );
            return response;
        } catch (error) {
            console.error('Error updating inventory item:', error);
            // Return error response instead of throwing
            return {
                success: false,
                message: {
                    content: error instanceof Error ? [error.message] : ['Error desconocido al actualizar el item'],
                    dispayable: true
                },
                data: null as any,
                statusCode: 500,
                metadata: null
            };
        }
    }

    public async deleteInventoryItem(id: string): Promise<void> {
        try {
            const response = await this.httpClient.delete<void>(`${InventoryService.url}/${id}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            throw error;
        }
    }

    public async addImageToId(itemId: number, file: File, imageData?: ImageUploadData): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('itemId', itemId.toString());

            if (imageData) {
                if (imageData.type) {
                    formData.append('type', imageData.type);
                    // Si el tipo es PRIMARY, forzar isPrimary a true
                    formData.append('isPrimary', (imageData.type === 'PRIMARY').toString());
                }
                if (imageData.description) formData.append('description', imageData.description);
                if (imageData.photoDate) formData.append('photoDate', imageData.photoDate);
            }

            const response = await this.httpClient.post<void>(
                `${process.env.NEXT_PUBLIC_API_URL}item-images/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    public async addMultipleImagesToId(itemId: number, images: Array<{ file: File; description: string; photoDate: string; isPrimary: boolean; type: 'PRIMARY' | 'SECONDARY' | 'DETAIL' }>): Promise<void> {
        try {
            for (const img of images) {
                await this.addImageToId(itemId, img.file, {
                    description: img.description,
                    photoDate: img.photoDate,
                    isPrimary: img.isPrimary,
                    type: img.type,
                });
            }
        } catch (error) {
            console.error('Error uploading multiple images:', error);
            throw error;
        }
    }

    public async getInventoryItemByCode(code: string): Promise<InventoryItem | null> {
        try {
            const url = `${InventoryService.url}?code=${code}`;
            const response = await this.httpClient.get<PaginatedInventoryResponse>(url);
            if (!response.success) {
                return null;
            }
            return response.data.records[0];
        } catch (error) {
            console.error('Error fetching inventory item by code:', error);
            return null;
        }
    }

    public async getInventoryItemByName(name: string): Promise<InventoryItem[]> {
        try {
            const url = `${InventoryService.url}?name=${name}`;
            const response = await this.httpClient.get<PaginatedInventoryResponse>(url);
            if (!response.success) {
                return [];
            }
            return response.data.records;
        } catch (error) {
            console.error('Error fetching inventory items by name:', error);
            return [];
        }
    }

    public async deleteImageById(imageId: number): Promise<void> {
        try {
            const response = await this.httpClient.delete<void>(
                `${process.env.NEXT_PUBLIC_API_URL}item-images/${imageId}`
            );
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }

    public async updateCondition(itemId: number, conditionId: number, stock?: number): Promise<IHttpResponse<InventoryItem>> {
        try {
            const body: any = { conditionId };
            if (typeof stock === 'number') {
                body.stock = stock;
            }
            const response = await this.httpClient.patch<InventoryItem>(
                `${InventoryService.url}/${itemId}`,
                body
            );
            return response;
        } catch (error) {
            console.error('Error updating item condition:', error);
            return {
                success: false,
                message: {
                    content: error instanceof Error ? [error.message] : ['Error desconocido al actualizar la condición'],
                    dispayable: true
                },
                data: null as any,
                statusCode: 500,
                metadata: null
            };
        }
    }
}

// Exportar la instancia para usar directamente
export const inventoryService = InventoryService.getInstance();