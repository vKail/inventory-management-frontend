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
import { formatNullValue, capitalizeWords, formatBooleanValue } from '@/lib/utils';
import { formatNumber } from "@/lib/utils";
import { ICategory } from "../../data/interfaces/category.interface";

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
    <Card className="w-full">
      <CardHeader className="px-2 sm:px-4 md:px-8 pb-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full lg:w-auto py-2 mb-4">
            <Input
              placeholder="Buscar por nombre o código..."
              className="w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={parentCategoryFilter}
              onValueChange={setParentCategoryFilter}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="none">Sin categoría padre</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || parentCategoryFilter !== 'all') && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                className="h-10 w-10 cursor-pointer"
                title="Limpiar filtros"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            onClick={() => router.push('/categories/new')}
            className="bg-red-600 hover:bg-red-700 cursor-pointer w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>
        <hr className="border-t border-muted mt-4" />
      </CardHeader>

      <CardContent className="px-2 sm:px-4 md:px-8 pb-6">
        <div className="min-h-[400px] flex flex-col justify-between">
          <div className="overflow-x-auto border rounded-md shadow-sm">
            <div className="min-w-full inline-block align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px] w-[12%]">Código</TableHead>
                    <TableHead className="min-w-[150px] w-[18%]">Nombre</TableHead>
                    <TableHead className="min-w-[200px] w-[25%]">Descripción</TableHead>
                    <TableHead className="min-w-[120px] w-[15%]">Categoría Padre</TableHead>
                    <TableHead className="min-w-[80px] w-[10%]">Vida Útil</TableHead>
                    <TableHead className="min-w-[100px] w-[12%]">% Depreciación</TableHead>
                    <TableHead className="min-w-[100px] w-[8%] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24">
                        <LoaderComponent rows={5} columns={7} />
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Tags className="h-10 w-10 opacity-30" />
                          <span>No hay categorías para mostrar</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {formatNullValue(category.code, "Sin código")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatNullValue(capitalizeWords(category.name), "Sin nombre")}
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate">
                          {formatNullValue(capitalizeWords(category.description), "Sin descripción")}
                        </TableCell>
                        <TableCell>
                          {category.parentCategory
                            ? capitalizeWords(category.parentCategory.name)
                            : "No Aplica"
                          }
                        </TableCell>
                        <TableCell>
                          {formatNumber(category.standardUsefulLife)} años
                        </TableCell>
                        <TableCell>
                          {formatNumber(parseFloat(category.depreciationPercentage))}%
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(category.id)}
                              className="cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setCategoryToDelete(category.id)}
                                  className="cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente la categoría
                                    <span className="font-semibold"> {formatNullValue(capitalizeWords(category.name), "Sin nombre")}</span>.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDelete}>
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
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