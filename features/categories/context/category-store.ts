/* eslint-disable @typescript-eslint/no-unused-vars */
// context/category-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ICategory, PaginatedCategories } from '../data/interfaces/category.interface';
import { CategoryService } from '../services/category.service';

interface CategoryStore {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  getCategories: (page?: number, limit?: number) => Promise<PaginatedCategories>;
  getCategoryById: (categoryId: number) => Promise<ICategory | undefined>;
  addCategory: (category: Partial<ICategory>) => Promise<void>;
  updateCategory: (categoryId: number, category: Partial<ICategory>) => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
  getParentCategoryNameById: (parentId: number | null | undefined) => string;
}

const STORE_NAME = 'category-storage';

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      loading: false,
      error: null,

      getCategories: async (page = 1, limit = 10) => {
        set({ loading: true });
        try {
          const response = await CategoryService.getInstance().getCategories(page, limit);

          if (response && response.records) {
            set({
              categories: response.records,
              loading: false,
              error: null
            });
            return response;
          } else {
            throw new Error('formato de respuesta inválido');
          }
        } catch (error) {
          console.error('Error in getCategories:', error);
          set({
            error: 'Error al cargar las categorías',
            loading: false,
            categories: []
          });
          throw error;
        }
      },

      getParentCategoryNameById: (parentId: number | null | undefined): string => {
        if (!parentId) return 'Ninguna';
        const parent = get().categories.find(cat => cat.id === parentId);
        return parent ? parent.name : 'Desconocida';
      },

      getCategoryById: async (categoryId: number) => {
        try {
          return await CategoryService.getInstance().getCategoryById(categoryId);
        } catch {
          set({ error: 'Error al cargar la categoría' });
          return undefined;
        }
      },

      addCategory: async (category: Partial<ICategory>) => {
        try {
          set({ loading: true, error: null });
          await CategoryService.getInstance().createCategory(category as ICategory);
          await get().getCategories();
          set({ loading: false });
        } catch (error) {
          console.error('Error adding category:', error);
          set({
            error: 'Error al crear la categoría',
            loading: false
          });
          throw error;
        }
      },

      updateCategory: async (id: number, category: Partial<ICategory>) => {
        try {
          set({ loading: true, error: null });
          await CategoryService.getInstance().updateCategory(id, category);
          await get().getCategories();
          set({ loading: false });
        } catch (error) {
          console.error('Error updating category:', error);
          set({
            error: 'Error al actualizar la categoría',
            loading: false
          });
          throw error;
        }
      },

      deleteCategory: async (categoryId: number) => {
        try {
          set({ loading: true, error: null });
          await CategoryService.getInstance().deleteCategory(categoryId);
          const newCategories = get().categories.filter(c => c.id !== categoryId);
          set({ categories: newCategories, loading: false });
        } catch (error) {
          console.error('Error deleting category:', error);
          set({
            error: 'Error al eliminar la categoría',
            loading: false
          });
          throw error;
        }
      },
    }),
    {
      name: STORE_NAME,
    }
  )
);
