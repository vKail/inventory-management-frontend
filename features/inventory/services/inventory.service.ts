import { HttpHandler, IHttpResponse } from '@/core/data/interfaces/HttpHandler';
import { InventoryItem, InventoryResponse, PaginatedInventoryResponse } from '../data/interfaces/inventory.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

interface ImageUploadData {
    type?: 'PRIMARY' | 'SECONDARY' | 'DETAIL';
    isPrimary?: boolean;
    description?: string;
    photoDate?: string;
}

interface CreateInventoryResponse {
    success: boolean;
    message: {
        content: string[];
        displayable: boolean;
    };
    data: InventoryItem;
}

interface InventoryServiceProps {
    getInventoryItems: (page?: number, limit?: number) => Promise<PaginatedInventoryResponse>;
    getInventoryItemById: (id: string) => Promise<InventoryItem | undefined>;
    createInventoryItem: (item: FormData) => Promise<IHttpResponse<InventoryItem>>;
    updateInventoryItem: (id: string, item: Partial<FormData>) => Promise<InventoryItem | undefined>;
    deleteInventoryItem: (id: string) => Promise<void>;
    addImageToId: (itemId: number, file: File, imageData?: ImageUploadData) => Promise<void>;
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

    public async getInventoryItems(page = 1, limit = 10): Promise<PaginatedInventoryResponse> {
        try {
            const response = await this.httpClient.get<PaginatedInventoryResponse>(
                `${InventoryService.url}?page=${page}&limit=${limit}`
            );
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
                data[key] = parseInt(value.toString());
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

    public async updateInventoryItem(id: string, item: Partial<FormData>): Promise<InventoryItem | undefined> {
        try {
            const response = await this.httpClient.patch<InventoryItem>(
                `${InventoryService.url}/${id}`,
                item
            );
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data;
        } catch (error) {
            console.error('Error updating inventory item:', error);
            throw error;
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
                if (imageData.type) formData.append('type', imageData.type);
                if (imageData.isPrimary !== undefined) formData.append('isPrimary', imageData.isPrimary.toString());
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
}

// Exportar la instancia para usar directamente
export const inventoryService = InventoryService.getInstance();