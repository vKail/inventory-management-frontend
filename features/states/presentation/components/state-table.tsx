"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStateStore } from '@/features/states/context/state-store';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { PlusCircle, Pencil, Trash2, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import LoaderComponent from '@/shared/components/ui/Loader';
import { formatNullValue, capitalizeWords } from '@/lib/utils';

interface StateTableProps {
  currentPage: number;
  itemsPerPage: number;
}

export function StateTable({ currentPage, itemsPerPage }: StateTableProps) {
  const router = useRouter();
  const {
    filteredStates,
    searchTerm,
    loading,
    getStates,
    deleteState,
    setSearchTerm,
    clearFilters,
    totalPages
  } = useStateStore();
  const [stateToDelete, setStateToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadStates = async () => {
      try {
        await getStates(currentPage, itemsPerPage);
      } catch (error) {
        console.error('Error loading states:', error);
        toast.error('Error al cargar los estados');
      }
    };

    loadStates();
  }, [getStates, currentPage, itemsPerPage]);

  const handleDelete = async () => {
    if (stateToDelete === null) return;

    try {
      await deleteState(stateToDelete);
      toast.success('Estado eliminado exitosamente');
      setStateToDelete(null);
    } catch (error) {
      console.error('Error deleting state:', error);
      toast.error('Error al eliminar el estado');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/states/edit/${id}`);
  };

  const handlePageChange = async (page: number) => {
    try {
      await getStates(page, itemsPerPage);
    } catch (error) {
      console.error('Error changing page:', error);
      toast.error('Error al cambiar de página');
    }
  };

  return (
    <Card className="w-full max-w-[1200px] mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Buscar por nombre o descripción..."
            className="w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={clearFilters}
              title="Limpiar filtros"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          onClick={() => router.push('/states/new')}
          className="bg-red-600 hover:bg-red-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Estado
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Nombre</TableHead>
                <TableHead className="w-[400px]">Descripción</TableHead>
                <TableHead className="w-[100px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <LoaderComponent rows={5} columns={3} />
                  </TableCell>
                </TableRow>
              ) : filteredStates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-20 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-10 w-10 opacity-30" />
                      <span>No hay estados para mostrar</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStates.map((state) => (
                  <TableRow key={state.id}>
                    <TableCell className="font-medium">
                      {formatNullValue(capitalizeWords(state.name), "Sin nombre")}
                    </TableCell>
                    <TableCell className="max-w-[400px]">
                      <div className="truncate" title={state.description}>
                        {formatNullValue(capitalizeWords(state.description), "Sin descripción")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(state.id)}
                        className="cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setStateToDelete(state.id)}
                            className="cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente el estado
                              <span className="font-semibold"> {formatNullValue(capitalizeWords(state.name), "Sin nombre")}</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setStateToDelete(null)}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
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
        </div>
      </CardContent>
    </Card>
  );
}
