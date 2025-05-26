import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { ILocation, PaginatedLocations, ApiResponse, CreateLocationDTO, UpdateLocationDTO } from '../data/interfaces/location.interface';

interface LocationServiceProps {
    getLocations: (page?: number, limit?: number) => Promise<PaginatedLocations>;
    getLocationById: (id: number) => Promise<ILocation | undefined>;
    createLocation: (location: CreateLocationDTO) => Promise<ILocation | undefined>;
    updateLocation: (id: number, location: UpdateLocationDTO) => Promise<ILocation | undefined>;
    deleteLocation: (id: number) => Promise<void>;
}

export class LocationService implements LocationServiceProps {
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

    public async getLocations(page = 1, limit = 10): Promise<PaginatedLocations> {
        try {
            const response = await this.httpClient.get<ApiResponse<PaginatedLocations>>(
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

    public async getLocationById(id: number): Promise<ILocation | undefined> {
        try {
            const response = await this.httpClient.get<ApiResponse<ILocation>>(`${LocationService.url}/${id}`);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.message.content.join(', '));
        } catch (error) {
            console.error('Error fetching location:', error);
            return undefined;
        }
    }

    public async createLocation(location: CreateLocationDTO): Promise<ILocation | undefined> {
        try {
            const response = await this.httpClient.post<ApiResponse<ILocation>>(LocationService.url, location);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.message.content.join(', '));
        } catch (error) {
            console.error('Error creating location:', error);
            throw error;
        }
    }

    public async updateLocation(id: number, location: UpdateLocationDTO): Promise<ILocation | undefined> {
        try {
            const response = await this.httpClient.patch<ApiResponse<ILocation>>(`${LocationService.url}/${id}`, location);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.message.content.join(', '));
        } catch (error) {
            console.error('Error updating location:', error);
            throw error;
        }
    }

    public async deleteLocation(id: number): Promise<void> {
        try {
            const response = await this.httpClient.delete<ApiResponse<void>>(`${LocationService.url}/${id}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
        } catch (error) {
            console.error('Error deleting location:', error);
            throw error;
        }
    }
} 