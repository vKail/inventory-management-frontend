'use client';

import { useEffect, useState } from 'react';
import { useCertificateStore } from '@/features/certificates/context/certificate-store';
import { useUserStore } from '@/features/users/context/user-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { CertificatePagination } from './certificate-pagination';

interface CertificateTableProps {
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function CertificateTable({ currentPage, itemsPerPage, onPageChange }: CertificateTableProps) {
    const router = useRouter();
    const { getUsers } = useUserStore();
    const [users, setUsers] = useState<any[]>([]);
    const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);
    const {
        certificates,
        loading,
        error,
        totalPages,
        getCertificates,
        deleteCertificate,
        refreshTable,
    } = useCertificateStore();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await getUsers(1, 100);
                if (response && response.records) {
                    setUsers(response.records);
                }
            } catch (error) {
                console.error('Error loading users:', error);
            }
        };
        loadUsers();
    }, [getUsers]);

    useEffect(() => {
        getCertificates(currentPage, itemsPerPage);
    }, [getCertificates, currentPage, itemsPerPage]);

    const handleDelete = async () => {
        if (certificateToDelete === null) return;

        try {
            await deleteCertificate(certificateToDelete);
            toast.success('Certificado eliminado exitosamente');
            setCertificateToDelete(null);
            refreshTable();
        } catch (error) {
            console.error('Error al eliminar el certificado:', error);
            toast.error('Error al eliminar el certificado');
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/certificates/edit/${id}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return 'bg-gray-100 text-gray-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return 'Borrador';
            case 'APPROVED':
                return 'Aprobado';
            case 'CANCELLED':
                return 'Cancelado';
            default:
                return status;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'ENTRY':
                return 'Entrada';
            case 'EXIT':
                return 'Salida';
            case 'TRANSFER':
                return 'Transferencia';
            default:
                return type;
        }
    };

    const getResponsibleName = (userId: number) => {
        const user = users.find(u => u.id === userId);
        return user ? `${user.person.lastName} ${user.person.firstName}` : 'No asignado';
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="space-y-6 min-h-[50vh]">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Certificados</h1>
                <Button onClick={() => router.push('/certificates/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Certificado
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Número</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Responsable Entrega</TableHead>
                            <TableHead>Responsable Recepción</TableHead>
                            <TableHead>Contabilizado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Skeleton className="h-8 w-8" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : certificates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">
                                    No hay certificados registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            certificates.map((certificate) => (
                                <TableRow key={certificate.id}>
                                    <TableCell>{certificate.number}</TableCell>
                                    <TableCell>
                                        {format(new Date(certificate.date), 'PPP', { locale: es })}
                                    </TableCell>
                                    <TableCell>{getTypeLabel(certificate.type)}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                certificate.status
                                            )}`}
                                        >
                                            {getStatusLabel(certificate.status)}
                                        </span>
                                    </TableCell>
                                    <TableCell>{getResponsibleName(certificate.deliveryResponsibleId)}</TableCell>
                                    <TableCell>{getResponsibleName(certificate.receptionResponsibleId)}</TableCell>
                                    <TableCell>
                                        {certificate.accounted ? 'Sí' : 'No'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(certificate.id)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setCertificateToDelete(certificate.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Se eliminará permanentemente el certificado
                                                            <span className="font-semibold"> #{certificate.number}</span>.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setCertificateToDelete(null)}>
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

            {totalPages > 0 && (
                <CertificatePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
} 