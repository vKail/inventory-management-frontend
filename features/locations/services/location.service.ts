import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { ILocation, PaginatedLocations } from '../data/interfaces/location.interface';
import { LocationFormValues } from '../data/schemas/location.schema';

export class LocationService {
    private static instance: LocationService;
    private httpClient: HttpHandler;
    private static readonly url = 'locations';

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): LocationService {
        if (!LocationService.instance) {
            LocationService.instance = new LocationService();
        }
        return LocationService.instance;
    }

    async getLocations(page = 1, limit = 10, filters?: { name?: string; description?: string; type?: string; floor?: string; reference?: string }): Promise<PaginatedLocations> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (filters?.name) {
                params.append('name', filters.name);
            }
            if (filters?.description) {
                params.append('description', filters.description);
            }
            if (filters?.type) {
                params.append('type', filters.type);
            }
            if (filters?.floor) {
                params.append('floor', filters.floor);
            }
            if (filters?.reference) {
                params.append('reference', filters.reference);
            }

            const response = await this.httpClient.get<PaginatedLocations>(
                `${LocationService.url}?${params.toString()}`
            );
            if (response.success) {
                return response.data;
            }
            throw new Error(response.message.content.join(', '));
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    }

    async getLocationById(id: number): Promise<ILocation | undefined> {
        try {
            const response = await this.httpClient.get<ILocation>(`${LocationService.url}/${id}`);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.message.content.join(', '));
        } catch (error) {
            console.error('Error fetching location:', error);
            return undefined;
        }
    }

    async createLocation(location: Omit<ILocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ILocation> {
        try {
            const response = await this.httpClient.post<ILocation>(LocationService.url, location);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.message.content.join(', '));
        } catch (error) {
            console.error('Error creating location:', error);
            throw error;
        }
    }

    async updateLocation(id: number, location: Partial<LocationFormValues>): Promise<ILocation> {
        try {
            const response = await this.httpClient.patch<ILocation>(`${LocationService.url}/${id}`, location);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.message.content.join(', '));
        } catch (error) {
            console.error('Error updating location:', error);
            throw error;
        }
    }

    async deleteLocation(id: number): Promise<void> {
        try {
            const response = await this.httpClient.delete<void>(`${LocationService.url}/${id}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
        } catch (error) {
            console.error('Error deleting location:', error);
            throw error;
        }
    }
} 