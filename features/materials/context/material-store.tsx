import { createContext, useContext } from 'react';
import { Material } from '../data/interfaces/material.interface';

interface MaterialContextProps {
  materials: Material[];
  refreshMaterials: () => void;
}

export const MaterialContext = createContext<MaterialContextProps | undefined>(undefined);

export const useMaterialContext = () => {
  const context = useContext(MaterialContext);
  if (!context) throw new Error('MaterialContext debe estar dentro de un proveedor');
  return context;
};
