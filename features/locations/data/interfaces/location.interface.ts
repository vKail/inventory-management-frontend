export interface ILocation {
    id: number;
    name: string;
    description: string;
    warehouseId: number;
    parentLocationId: number | null;
    type: string;
    building: string;
    floor: string;
    reference: string;
    capacity: number;
    capacityUnit: string;
    occupancy: number;
    qrCode: string;
    coordinates: string;
    notes: string;
}

export interface PaginatedResponse<T> {
    records: T[];
    total: number;
    limit: number;
    page: number;
    pages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: {
        content: string[];
    };
    data: T;
}

export type PaginatedLocations = PaginatedResponse<ILocation>;

export interface CreateLocationDTO extends Omit<ILocation, 'id'> { }
export interface UpdateLocationDTO extends Partial<CreateLocationDTO> { } 