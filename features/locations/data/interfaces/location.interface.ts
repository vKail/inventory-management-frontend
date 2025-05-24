export interface Location {
    id: string;
    name: string;
    description?: string;
    address: string;
    capacity: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLocationDto {
    name: string;
    description?: string;
    address: string;
    capacity: number;
}

export interface UpdateLocationDto {
    name?: string;
    description?: string;
    address?: string;
    capacity?: number;
} 