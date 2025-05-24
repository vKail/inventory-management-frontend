/* eslint-disable @typescript-eslint/no-unused-vars */
// context/category-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ICategory } from '../data/interfaces/category.interface';
import { CategoryService } from '@/features/categories/services/category.service';

interface CategoryStore {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  getParentCategoryNameById: (parentId: number | null | undefined) => string;
  getCategories: (page?: number, limit?: number) => Promise<void>;
  getCategoryById: (categoryId: number) => Promise<ICategory | undefined>;
  addCategory: (category: ICategory) => Promise<void>;
  updateCategory: (categoryId: number, category: Partial<ICategory>) => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
}
const STORE_NAME = 'category-storage';

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      loading: false,
      error: null,

      getCategories: async (page = 1, limit = 10) => {
        try {
          set({ loading: true, error: null });
          const { records, total, limit: l, page: p, pages } =
            await CategoryService.getInstance().getCategories(page, limit);
          set({
            categories: records,
            loading: false,
          });
        } catch (error) {
          console.error('Error fetching categories:', error);
          set({
            error: 'Error al cargar las categorías',
            loading: false,
            categories: [],
          });
        }
      },

      getParentCategoryNameById: (parentId: number | null | undefined): string => {
        console.log(parentId)
        if (!parentId) return 'Ninguna';
        const parent = get().categories.find(cat => cat.id === parentId);
        console.log(parent)
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

      addCategory: async (category: ICategory) => {
        try {
          set({ loading: true, error: null });
          await CategoryService.getInstance().createCategory(category);
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

          const payload = {
            code: category.code,
            name: category.name,
            description: category.description,
            parentCategoryId: category.parentCategory?.id,
            standardUsefulLife: category.standardUsefulLife,
            depreciationPercentage: category.depreciationPercentage
          };

          await CategoryService.getInstance().updateCategory(id, payload);
          const updatedCategories = get().categories.map(c =>
            c.id === id ? { ...c, code: payload.code || c.code, name: payload.name || c.name, description: payload.description || c.description, parentCategoryId: payload.parentCategoryId || c.parentCategory?.id, standardUsefulLife: payload.standardUsefulLife || c.standardUsefulLife, depreciationPercentage: payload.depreciationPercentage || c.depreciationPercentage } : c
          );

          set({ categories: updatedCategories, loading: false });
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
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
