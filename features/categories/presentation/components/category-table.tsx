/* eslint-disable react/react-in-jsx-scope */
'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Tags } from 'lucide-react';
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

interface CategoryTableProps {
  currentPage: number;
  itemsPerPage: number;
}

export function CategoryTable({ currentPage, itemsPerPage }: CategoryTableProps) {
  const router = useRouter();
  const {
    categories,
    loading,
    getCategories,
    deleteCategory
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

  if (loading) {
    return (
      <Card className="w-full max-w-[1200px]">
        <CardHeader className="px-4 md:px-8 pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto py-2 mb-4">
              <Input
                placeholder="Buscar por nombre o código..."
                className="w-full md:w-64"
                disabled
              />
              <Select disabled>
                <SelectTrigger className="w-full md:w-56">
                  <SelectValue placeholder="Todas las categorías padre" />
                </SelectTrigger>
              </Select>
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
          <LoaderComponent rows={5} columns={8} />
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay categorías para mostrar</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-[1200px]">
      <CardHeader className="px-4 md:px-8 pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto py-2 mb-4">
            <Input
              placeholder="Buscar por nombre o código..."
              className="w-full md:w-64"
            />
            <Select>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Todas las categorías padre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías padre</SelectItem>
                <SelectItem value="none">Sin categoría padre</SelectItem>
              </SelectContent>
            </Select>
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
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.code}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.parentCategory?.name || 'Ninguna'}</TableCell>
                  <TableCell>{category.standardUsefulLife} años</TableCell>
                  <TableCell>{category.depreciationPercentage}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría.
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}