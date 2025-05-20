export interface Material {
  id: number;
  name: string;
  description: string;
  materialType: string;
  active: boolean;
}

export interface MaterialResponse extends Material {}

export interface PaginatedMaterials {
  total: number;
  limit: number;
  page: number;
  pages: number;
  records: Material[];
}