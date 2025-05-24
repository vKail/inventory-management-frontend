import { createContext, useContext } from 'react';
import { Record } from '../data/interfaces/material.interface';

interface MaterialContextProps {
  materials: Record[];
  refreshMaterials: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
}

export const MaterialContext = createContext<MaterialContextProps | undefined>(undefined);

export const useMaterialContext = () => {
  const context = useContext(MaterialContext);
  if (!context) throw new Error('MaterialContext debe estar dentro de un proveedor');
  return context;
};
