"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
import { PlusCircle, Pencil, Trash2, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { UserRole, UserStatus } from '../../data/schemas/user.schema';
import LoaderComponent from '@/shared/components/ui/Loader';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPagination } from './user-pagination';
import { formatNullValue, capitalizeWords } from '@/lib/utils';

type StatusBadgeProps = {
  value: string | boolean;
  trueLabel?: string;
  falseLabel?: string;
  trueColor?: string;
  falseColor?: string;
  custom?: Record<string, { label: string; color: string }>;
};

function StatusBadge({ value, trueLabel = 'Activo', falseLabel = 'Inactivo', trueColor = 'bg-green-100 text-green-800', falseColor = 'bg-red-100 text-red-800', custom = {} }: StatusBadgeProps) {
  let label = value ? trueLabel : falseLabel;
  let color = value ? trueColor : falseColor;
  if (typeof value === 'string' && custom && custom[value]) {
    label = custom[value].label;
    color = custom[value].color;
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
  );
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

const USER_STATUSES = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' },
  { value: 'SUSPENDED', label: 'Suspendido' },
  { value: 'DEFAULTED', label: 'Moroso' },
];

export function UserTable() {
  const router = useRouter();
  const {
    filteredUsers,
    searchTerm,
    statusFilter,
    userTypeFilter,
    setSearchTerm,
    setStatusFilter,
    setUserTypeFilter,
    clearFilters,
    loading,
    getUsers,
    changeUserStatus,
    currentPage,
    totalPages
  } = useUserStore();

  const itemsPerPage = 10;

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('INACTIVE');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusUserName, setStatusUserName] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      await getUsers(currentPage, itemsPerPage);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar los usuarios');
    }
  };

  const handlePageChange = async (page: number) => {
    try {
      await getUsers(page, itemsPerPage);
    } catch (error) {
      console.error('Error changing page:', error);
      toast.error('Error al cambiar de página');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/users/edit/${id}`);
  };

  const openStatusModal = (user: any) => {
    setSelectedUserId(user.id);
    setStatusUserName(`${user.person?.firstName || ''} ${user.person?.lastName || ''}`.trim());
    setSelectedStatus(user.status);
    setStatusModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedUserId) return;
    setStatusLoading(true);
    try {
      await changeUserStatus(selectedUserId, selectedStatus);
      toast.success('Estado actualizado exitosamente');
      setStatusModalOpen(false);
    } catch (error) {
      toast.error('Error al actualizar el estado');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="px-4 md:px-8 pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto py-2 mb-4">
              <Input
                placeholder="Buscar usuarios..."
                className="w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value={UserStatus.ACTIVE}>Activo</SelectItem>
                  <SelectItem value={UserStatus.INACTIVE}>Inactivo</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={userTypeFilter}
                onValueChange={setUserTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value={UserRole.ADMINISTRATOR}>Administrador</SelectItem>
                  <SelectItem value={UserRole.MANAGER}>Gestor</SelectItem>
                </SelectContent>
              </Select>
              {(searchTerm || statusFilter !== 'all' || userTypeFilter !== 'all') && (
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
              onClick={() => router.push('/users/new')}
              className="bg-red-600 hover:bg-red-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </div>
          <hr className="border-t border-muted mt-4" />
        </CardHeader>

        <CardContent className="px-4 md:px-8">
          <div className="min-h-[400px] flex flex-col justify-between">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Usuario</TableHead>
                    <TableHead className="w-[250px]">Nombre Completo</TableHead>
                    <TableHead className="w-[200px]">Email</TableHead>
                    <TableHead className="w-[120px]">Tipo</TableHead>
                    <TableHead className="w-[40px">Estado</TableHead>
                    <TableHead className="w-[100px] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <LoaderComponent rows={5} columns={5} />
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-20 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-10 w-10 opacity-30" />
                          <span>No hay usuarios para mostrar</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {formatNullValue(user.userName, "Sin usuario")}
                        </TableCell>
                        <TableCell>
                          {formatNullValue(capitalizeWords(`${user.person?.firstName || ''} ${user.person?.lastName || ''}`.trim()), "Sin nombre")}
                        </TableCell>
                        <TableCell>
                          {formatNullValue(user.person?.email, "Sin email")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getUserTypeLabel(user.userType)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            value={user.status}
                            trueLabel="Activo"
                            falseLabel="Inactivo"
                            trueColor="bg-green-100 text-green-800"
                            falseColor="bg-red-100 text-red-800"
                            custom={{
                              'ACTIVE': { label: 'Activo', color: 'bg-green-100 text-green-800' },
                              'INACTIVE': { label: 'Inactivo', color: 'bg-red-100 text-red-800' },
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-row justify-end items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(user.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openStatusModal(user)}
                              className="cursor-pointer"
                              title="Cambiar estado"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {!loading && filteredUsers.length > 0 && (
              <div className="mt-4">
                <UserPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Status Change Modal */}
      <AlertDialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cambiar estado del usuario</AlertDialogTitle>
            <AlertDialogDescription>
              Selecciona el nuevo estado para <span className="font-semibold">{statusUserName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {USER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStatusModalOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusChange}
              className="bg-red-600 hover:bg-red-700"
              disabled={statusLoading}
            >
              {statusLoading ? 'Actualizando...' : 'Actualizar Estado'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}