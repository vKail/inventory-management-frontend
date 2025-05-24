export interface ApiResponse<T> {
    success: boolean;
    message: {
        content: string[];
        displayable: boolean;
    };
    data: T;
}

export interface ICondition {
    id: string;
    name: string;
    description: string;
    requiresMaintenance: boolean;
}

export interface PaginatedConditions {
    records: ICondition[];
    total: number;
    limit: number;
    page: number;
    pages: number;
} 