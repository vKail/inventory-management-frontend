import { type Category } from '../types/category.types';

export async function getCategories(): Promise<Category[]> {
  // Simulación de datos en memoria
  return [
    {
      id: '1',
      code: 'CAT001',
      name: 'Electrónica',
      description: 'Productos electrónicos y dispositivos',
      parent: null,
      lifespan: 5,
      depreciation: 20.00
    },
    {
      id: '2',
      code: 'CAT002',
      name: 'Muebles',
      description: 'Muebles y mobiliario',
      parent: null,
      lifespan: 10,
      depreciation: 10.00
    },
    {
      id: '3',
      code: 'CAT003',
      name: 'Computadoras',
      description: 'Equipos de cómputo y accesorios',
      parent: 'Electrónica',
      lifespan: 4,
      depreciation: 25.00
    },
    {
      id: '4',
      code: 'CAT004',
      name: 'Sillas',
      description: 'Sillas y asientos',
      parent: 'Muebles',
      lifespan: 8,
      depreciation: 12.50
    }
  ];
}

// Simulación de eliminación de categoría por ID
export async function deleteCategory(id: string): Promise<void> {
  // Aquí iría la lógica para eliminar la categoría, por ahora es solo una simulación
  return;
}