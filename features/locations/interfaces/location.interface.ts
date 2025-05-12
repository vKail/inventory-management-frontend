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
  capacity?: number;
  capacityUnit?: string;
  occupancy?: number;
  qrCode?: string;
  coordinates?: string;
  notes?: string;
  active?: boolean;
}

// ✅ Interfaz para crear sin 'id'
export type CreateLocation = Omit<Location, 'id'>;
