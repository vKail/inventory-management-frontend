'use client';

import { useEffect } from 'react';
import { useCertificateStore } from '@/features/certificates/context/certificate-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CertificateTableView() {
    const router = useRouter();
    const {
        certificates,
        loading,
        error,
        currentPage,
        totalPages,
        getCertificates,
        deleteCertificate,
        refreshTable,
    } = useCertificateStore();

    useEffect(() => {
        getCertificates(currentPage);
    }, [getCertificates, currentPage]);

    const handleDelete = async (id: string) => {
        try {
            await deleteCertificate(id);
            toast.success('Certificado eliminado exitosamente');
            refreshTable();
        } catch (error) {
            console.error('Error al eliminar el certificado:', error);
            toast.error('Error al eliminar el certificado');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return 'bg-gray-100 text-gray-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'TRANSFER':
                return 'Transferencia';
            case 'PURCHASE':
                return 'Compra';
            case 'DONATION':
                return 'Donación';
            case 'MANUFACTURING':
                return 'Fabricación';
            default:
                return type;
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
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
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">
                                    Cargando...
                                </TableCell>
                            </TableRow>
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
                                            {certificate.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{certificate.deliveryResponsibleId}</TableCell>
                                    <TableCell>{certificate.receptionResponsibleId}</TableCell>
                                    <TableCell>
                                        {certificate.accounted ? 'Sí' : 'No'}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.push(
                                                            `/certificates/${certificate.id}`
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(certificate.id)}
                                                >
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => getCertificates(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => getCertificates(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
} 