import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { ILocation, PaginatedLocations } from '../data/interfaces/location.interface';

export class LocationService {
    private static instance: LocationService;
    private httpClient: HttpHandler;
    private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}locations`;

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): LocationService {
        if (!LocationService.instance) {
            LocationService.instance = new LocationService();
        }
        return LocationService.instance;
    }

    async getLocations(page = 1, limit = 10): Promise<PaginatedLocations> {
        try {
            const response = await this.httpClient.get<PaginatedLocations>(
                `${LocationService.url}?page=${page}&limit=${limit}`
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

    async updateLocation(id: number, location: Partial<ILocation>): Promise<ILocation> {
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