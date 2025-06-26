export interface ILocation {
  id?: number;
  name: string;
  description: string;
  parentLocationId?: number | null;
  type: 'BUILDING' | 'FLOOR' | 'OFFICE' | 'WAREHOUSE' | 'SHELF' | 'LABORATORY';
  floor: string;
  reference: string;
  capacity: number;
  capacityUnit: 'UNITS' | 'METERS' | 'SQUARE_METERS';
  occupancy: number;
  qrCode: string;
  coordinates: string;
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginatedLocations {
  records: ILocation[];
  total: number;
  page: number;
  limit: number;
}

export const LocationTypeLabels: Record<ILocation['type'], string> = {
  BUILDING: 'edificio',
  FLOOR: 'piso',
  OFFICE: 'oficina',
  WAREHOUSE: 'almacén',
  SHELF: 'estante',
  LABORATORY: 'laboratorio'
};

export const CapacityUnitLabels: Record<ILocation['capacityUnit'], string> = {
  UNITS: 'unidades (u)',
  METERS: 'metros (m)',
  SQUARE_METERS: 'metros cuadrados (m²)'
};
