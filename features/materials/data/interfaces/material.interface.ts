export interface MaterialAPIResponse {
  success: boolean;
  message: Message;
  data: Material;
}

export interface Material {
  records: Record[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface Record {
  id: number;
  name: string;
  description: string;
  materialType: MaterialType;
}

export enum MaterialType {
  Madera = "Madera",
  Metal = "Metal",
  Plástico = "Plástico",
}

export interface Message {
  content: string[];
  displayable: boolean;
}
