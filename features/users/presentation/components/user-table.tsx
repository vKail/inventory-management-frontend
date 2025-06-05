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
import { UserRole, UserStatus } from '../../data/schemas/user.schema';
import LoaderComponent from '@/shared/components/ui/Loader';

interface UserTableProps {
  currentPage: number;
  itemsPerPage: number;
}

const getUserTypeLabel = (type: string) => {
  switch (type) {
    case UserRole.ADMINISTRATOR:
      return 'Administrador';
    case UserRole.TEACHER:
      return 'Profesor';
    case UserRole.STUDENT:
      return 'Estudiante';
    case UserRole.MANAGER:
      return 'Gestor';
    default:
      return type;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'default';
    case UserStatus.INACTIVE:
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'Activo';
    case UserStatus.INACTIVE:
      return 'Inactivo';
    default:
      return status;
  }
};

export function UserTable({ currentPage, itemsPerPage }: UserTableProps) {
  const router = useRouter();
  const { users, loading, getUsers, deleteUser } = useUserStore();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

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

  const handleEdit = (id: string) => {
    router.push(`/users/edit/${id}`);
  };

  if (loading) {
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
          <LoaderComponent rows={5} columns={6} />
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay usuarios para mostrar</p>
      </div>
    );
  }

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
              <TableHead>Usuario</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.userName}</TableCell>
                <TableCell>
                  {`${user.person?.firstName || ''} ${user.person?.lastName || ''}`.trim() || 'N/A'}
                </TableCell>
                <TableCell>{user.person?.email || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getUserTypeLabel(user.userType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)}>
                    {getStatusLabel(user.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
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
                            <span className="font-semibold"> {user.userName}</span> y todos sus datos asociados.
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}