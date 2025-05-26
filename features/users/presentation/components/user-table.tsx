"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/features/users/context/user-store';
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

interface UserTableProps {
  currentPage: number;
  itemsPerPage: number;
}

export function UserTable({ currentPage, itemsPerPage }: UserTableProps) {
  const router = useRouter();
  const { users, loading, getUsers, deleteUser } = useUserStore();
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await getUsers(currentPage, itemsPerPage);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Error al cargar los usuarios');
      }
    };

    loadUsers();
  }, [getUsers, currentPage, itemsPerPage]);

  const handleDelete = async () => {
    if (userToDelete === null) return;

    try {
      await deleteUser(userToDelete);
      toast.success('Usuario eliminado exitosamente');
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/users/edit/${id}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lista de Usuarios</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Button
          onClick={() => router.push('/users/new')}
          className="bg-red-600 hover:bg-red-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <div className="flex items-center justify-center">
                    Cargando...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p className="mb-2">No hay usuarios para mostrar</p>
                    <Button
                      onClick={() => router.push('/users/new')}
                      variant="outline"
                      size="sm"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Crear primer usuario
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "default" : "outline"}>
                      {user.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(user.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setUserToDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario
                              <span className="font-semibold"> {user.name}</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
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
      </CardContent>
    </Card>
  );
}
