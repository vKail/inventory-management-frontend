export interface Location {
  id: number;
  name: string;
  description?: string;
  warehouseId?: number;
  parentLocationId?: number | null;
  type: string;
  building?: string;
  floor?: string;
  reference?: string;
  capacity?: number | null; 
  capacityUnit?: string;
  occupancy?: number | null; 
  qrCode?: string;
  coordinates?: string;
  notes?: string;
  active?: boolean;
}

export type CreateLocation = Omit<Location, 'id'>;
