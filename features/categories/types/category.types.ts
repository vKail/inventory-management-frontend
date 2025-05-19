export interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  parent: string | null;
  lifespan: number;
  depreciation: number;
}