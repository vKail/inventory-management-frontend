/* eslint-disable @typescript-eslint/no-unused-vars */
// context/category-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ICategory, PaginatedCategories } from '../data/interfaces/category.interface';
import { CategoryService } from '@/features/categories/services/category.service';

interface CategoryStore {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  getCategories: (page?: number, limit?: number) => Promise<PaginatedCategories | undefined>;
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

      getCategories: async (page = 1, limit = 10): Promise<PaginatedCategories | undefined> => {
        try {
          const paginated = await CategoryService.getInstance().getCategories(page, limit);
          set({ categories: paginated.records });
          return paginated;
        } catch (error) {
          set({ error: 'Error fetching categories' });
          return {
            records: [],
            total: 0,
            pages: 0,
            page: page,
            limit: limit,
          };
        }
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
        await CategoryService.getInstance().createCategory(category);
        await get().getCategories();
      },

      updateCategory: async (id: number, category: Partial<ICategory>) => {
        try {
          // Find the existing category to merge with the partial update
          const existingCategory = get().categories.find(c => c.id === id);
          if (!existingCategory) throw new Error('Category not found');
          const updatedCategory: ICategory = { ...existingCategory, ...category, id };
          await CategoryService.getInstance().updateCategory(id, updatedCategory);
          // Actualizar el estado local
          const updatedCategories = get().categories.map(c =>
            c.id === id ? updatedCategory : c
          );
          set({ categories: updatedCategories });
        } catch (error) {
          console.error('Error updating category:', error);
          throw error;
        }
      },

      deleteCategory: async (categoryId: number) => {
        await CategoryService.getInstance().deleteCategory(categoryId);
        const newCategories = get().categories.filter(c => c.id !== categoryId);
        set({ categories: newCategories });
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
