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
  materialType: MaterialType;
}

export const MaterialTypes = {
  CONSUMABLE: 'CONSUMABLE',
  TOOL: 'TOOL',
  EQUIPMENT: 'EQUIPMENT',
  METAL: 'METAL',
  OTHER: 'OTHER',
  DELICATE: 'DELICATE'
} as const;

export type MaterialType = typeof MaterialTypes[keyof typeof MaterialTypes];

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
