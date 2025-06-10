
// This file defines the interfaces for color data structures used in the application.
export interface IColor {
    name: string;
    hexCode: string;
    description: string;
}

// This interface represents a color object with its properties.
export interface IColorResponse extends IColor {
        id: number;
}

// This interface is used for updating a color object, allowing partial updates to its properties.
export interface IColorUpdate {
    name?: string;
    hexCode?: string;
    description?: string;
}

// This interface defines the structure of a paginated response for colors.
export interface PaginatedColors {
  total: number;
  limit: number;
  page: number;
  pages: number;
  records: IColorResponse[];
}