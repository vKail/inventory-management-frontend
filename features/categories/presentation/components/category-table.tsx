/* eslint-disable react/react-in-jsx-scope */
'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Tags, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCategoryStore } from '@/features/categories/context/category-store';
import { toast } from "sonner";
import LoaderComponent from '@/shared/components/ui/Loader';
import { CategoryPagination } from './category-pagination';

interface CategoryTableProps {
  currentPage: number;
  itemsPerPage: number;
}

export function CategoryTable({ currentPage, itemsPerPage }: CategoryTableProps) {
  const router = useRouter();
  const {
    filteredCategories,
    searchTerm,
    parentCategoryFilter,
    setSearchTerm,
    setParentCategoryFilter,
    clearFilters,
    loading,
    getCategories,
    deleteCategory,
    totalPages
  } = useCategoryStore();

  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        await getCategories(currentPage, itemsPerPage);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Error al cargar las categorías');
      }
    };

    loadCategories();
  }, [getCategories, currentPage, itemsPerPage]);

  const handlePageChange = async (page: number) => {
    try {
      await getCategories(page, itemsPerPage);
    } catch (error) {
      console.error('Error changing page:', error);
      toast.error('Error al cambiar de página');
    }
  };

  const handleDelete = async () => {
    if (categoryToDelete === null) return;

    try {
      await deleteCategory(categoryToDelete);
      toast.success('Categoría eliminada exitosamente');
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error al eliminar la categoría');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/categories/edit/${id}`);
  };

  return (
    <Card className="w-full max-w-[1200px]">
      <CardHeader className="px-4 md:px-8 pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto py-2 mb-4">
            <Input
              placeholder="Buscar por nombre o código..."
              className="w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={parentCategoryFilter}
              onValueChange={setParentCategoryFilter}
            >
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Todas las categorías padre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías padre</SelectItem>
                <SelectItem value="none">Sin categoría padre</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || parentCategoryFilter !== 'all') && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                className="h-10 w-10"
                title="Limpiar filtros"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            onClick={() => router.push('/categories/new')}
            className="bg-red-600 hover:bg-red-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>
        <hr className="border-t border-muted mt-4" />
      </CardHeader>

      <CardContent className="px-4 md:px-8 pb-6">
        <div className="min-h-[400px] flex flex-col justify-between">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría Padre</TableHead>
                <TableHead>Vida Útil</TableHead>
                <TableHead>% Depreciación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <LoaderComponent rows={5} columns={7} />
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-20 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Tags className="h-10 w-10 opacity-30" />
                      <span>No hay categorías para mostrar</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.code}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>{category.parentCategory?.name || 'Ninguna'}</TableCell>
                    <TableCell>{category.standardUsefulLife} años</TableCell>
                    <TableCell>{category.depreciationPercentage}%</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCategoryToDelete(category.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente la categoría
                              <span className="font-semibold"> {category.name}</span> y todos sus datos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {!loading && filteredCategories.length > 0 && (
            <div className="mt-4">
              <CategoryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}