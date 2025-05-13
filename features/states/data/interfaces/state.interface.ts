export interface State {
  id: number;
  name: string;
  description: string;
  requiresMaintenance: boolean;
  active: boolean;
}

export interface CreateStateDTO {
  name: string;
  description?: string;
  requiresMaintenance?: boolean;
}

export interface UpdateStateDTO {
  name: string;
  description?: string;
  requiresMaintenance?: boolean;
}
