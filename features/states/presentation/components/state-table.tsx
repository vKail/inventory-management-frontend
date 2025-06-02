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
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";

interface StateTableProps {
  currentPage: number;
  itemsPerPage: number;
}

export function StateTable({ currentPage, itemsPerPage }: StateTableProps) {
  const router = useRouter();
  const { states, loading, getStates, deleteState } = useStateStore();
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

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (states.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay estados para mostrar</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lista de Estados</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona los estados de los equipos
          </p>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {states.map((state) => (
              <TableRow key={state.id}>
                <TableCell>{state.name}</TableCell>
                <TableCell>{state.description}</TableCell>
                <TableCell>
                  <Badge variant={state.active ? "default" : "outline"}>
                    {state.active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(state.id)}
                      >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setStateToDelete(state.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el estado
                            <span className="font-semibold"> {state.name}</span>.
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
