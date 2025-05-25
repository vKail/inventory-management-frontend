export interface State {
    id: number;
    name: string;
    description: string;
    color: string;
    active: boolean;
    requiresMaintenance: boolean;
}

export interface CreateStateDTO {
    name: string;
    description: string;
    color: string;
    active?: boolean;
    requiresMaintenance?: boolean;
}

export interface UpdateStateDTO extends Partial<CreateStateDTO> { }

export interface PaginatedStates {
    records: State[];
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