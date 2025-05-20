
export interface IColor {
    name: string;
    hexCode: string;
    description: string;
}

export interface IColorResponse extends IColor {
        id: number;
}

export interface IColorUpdate {
    name?: string;
    hexCode?: string;
    description?: string;
}

export interface PaginatedColors {
  total: number;
  limit: number;
  page: number;
  pages: number;
  records: IColorResponse[];
}