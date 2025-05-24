import { CreateLocationDto, Location, UpdateLocationDto } from "../data/interfaces/location.interface";
import { api } from "../../../lib/api";

export class LocationService {
    private static instance: LocationService;
    private readonly baseUrl = '/locations';

    private constructor() {}

    public static getInstance(): LocationService {
        if (!LocationService.instance) {
            LocationService.instance = new LocationService();
        }
        return LocationService.instance;
    }

    async getAllLocations(): Promise<Location[]> {
        try {
            const response = await api.get<Location[]>(this.baseUrl);
            return response.data;
        } catch (error) {
            console.error("Error fetching locations:", error);
            throw error;
        }
    }

    async getLocationById(id: string): Promise<Location> {
        try {
            const response = await api.get<Location>(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching location with id ${id}:`, error);
            throw error;
        }
    }

    async createLocation(data: CreateLocationDto): Promise<Location> {
        try {
            const response = await api.post<Location>(this.baseUrl, data);
            return response.data;
        } catch (error) {
            console.error("Error creating location:", error);
            throw error;
        }
    }

    async updateLocation(id: string, data: UpdateLocationDto): Promise<Location> {
        try {
            const response = await api.patch<Location>(`${this.baseUrl}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating location with id ${id}:`, error);
            throw error;
        }
    }

    async deleteLocation(id: string): Promise<void> {
        try {
            await api.delete(`${this.baseUrl}/${id}`);
        } catch (error) {
            console.error(`Error deleting location with id ${id}:`, error);
            throw error;
        }
    }
} 