import { MaterialTypes } from '../schemas/material.schema';

export interface ApiResponse<T> {
  success: boolean;
  message: {
    content: string[];
    displayable: boolean;
  };
  data: T;
}

export interface IMaterial {
  id: number;
  name: string;
  description: string;
  materialType: MaterialTypes;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface IMaterialCreate {
  name: string;
  description: string;
  materialType: MaterialTypes;
}

export interface IMaterialUpdate {
  name?: string;
  description?: string;
  materialType?: MaterialTypes;
}

export interface PaginatedMaterials {
  records: IMaterial[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface Message {
  content: string[];
  displayable: boolean;
}
