/* eslint-disable @typescript-eslint/no-unused-vars */
// context/category-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ICategory, PaginatedCategories } from '../data/interfaces/category.interface';
import { CategoryService } from '../services/category.service';

interface CategoryStore {
  categories: ICategory[];
  filteredCategories: ICategory[];
  searchTerm: string;
  parentCategoryFilter: string;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  getCategories: (page?: number, limit?: number) => Promise<void>;
  getCategoryById: (categoryId: number) => Promise<ICategory | undefined>;
  addCategory: (category: Partial<ICategory>) => Promise<void>;
  updateCategory: (categoryId: number, category: Partial<ICategory>) => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
  getParentCategoryNameById: (parentId: number | null | undefined) => string;
  refreshTable: () => Promise<void>;
  setSearchTerm: (term: string) => void;
  setParentCategoryFilter: (filter: string) => void;
  clearFilters: () => void;
}

const STORE_NAME = 'category-storage';

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      filteredCategories: [],
      searchTerm: '',
      parentCategoryFilter: 'all',
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,

      setSearchTerm: (term: string) => {
        const { categories, parentCategoryFilter } = get();
        const filtered = categories.filter((category) => {
          const matchesSearch = category.name.toLowerCase().includes(term.toLowerCase()) ||
            category.code.toLowerCase().includes(term.toLowerCase()) ||
            category.description.toLowerCase().includes(term.toLowerCase());

          const matchesParent = parentCategoryFilter === 'all' ||
            (parentCategoryFilter === 'none' && !category.parentCategory) ||
            (parentCategoryFilter !== 'all' && parentCategoryFilter !== 'none' &&
              category.parentCategory?.id.toString() === parentCategoryFilter);

          return matchesSearch && matchesParent;
        });
        set({ searchTerm: term, filteredCategories: filtered });
      },

      setParentCategoryFilter: (filter: string) => {
        const { categories, searchTerm } = get();
        const filtered = categories.filter((category) => {
          const matchesSearch = searchTerm === '' ||
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesParent = filter === 'all' ||
            (filter === 'none' && !category.parentCategory) ||
            (filter !== 'all' && filter !== 'none' &&
              category.parentCategory?.id.toString() === filter);

          return matchesSearch && matchesParent;
        });
        set({ parentCategoryFilter: filter, filteredCategories: filtered });
      },

      refreshTable: async () => {
        const { currentPage } = get();
        await get().getCategories(currentPage, 10);
      },

      getCategories: async (page = 1, limit = 10) => {
        try {
          set({ loading: true, error: null });
          const response = await CategoryService.getInstance().getCategories(page, limit);

          if (response.pages > 0 && page > response.pages) {
            await get().getCategories(1, limit);
            return;
          }

          const { searchTerm, parentCategoryFilter } = get();
          const allCategories = response.records;

          const filtered = allCategories.filter((category) => {
            const matchesSearch = searchTerm === '' ||
              category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
              category.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesParent = parentCategoryFilter === 'all' ||
              (parentCategoryFilter === 'none' && !category.parentCategory) ||
              (parentCategoryFilter !== 'all' && parentCategoryFilter !== 'none' &&
                category.parentCategory?.id.toString() === parentCategoryFilter);

            return matchesSearch && matchesParent;
          });

          set({
            categories: allCategories,
            filteredCategories: filtered,
            currentPage: response.page,
            totalPages: response.pages,
            loading: false,
            error: null
          });
        } catch (error) {
          set({
            error: 'Error al cargar las categorías',
            loading: false,
            categories: [],
            filteredCategories: [],
            currentPage: 1,
            totalPages: 1
          });
        }
      },

      getParentCategoryNameById: (parentId: number | null | undefined): string => {
        if (!parentId) return 'No Aplica';
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
          await get().getCategories(1, 10);
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
          await get().refreshTable();
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

          const { currentPage, categories } = get();
          if (categories.length === 1 && currentPage > 1) {
            await get().getCategories(currentPage - 1, 10);
          } else {
            await get().refreshTable();
          }
        } catch (error) {
          console.error('Error deleting category:', error);
          set({
            error: 'Error al eliminar la categoría',
            loading: false
          });
          throw error;
        }
      },

      clearFilters: () => {
        const { categories } = get();
        set({
          searchTerm: '',
          parentCategoryFilter: 'all',
          filteredCategories: categories
        });
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
