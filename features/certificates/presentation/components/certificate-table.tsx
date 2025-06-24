'use client';

import { useEffect, useState } from 'react';
import { useCertificateStore } from '@/features/certificates/context/certificate-store';
import { useUserStore } from '@/features/users/context/user-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, X, FileText } from 'lucide-react';
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
import { toast } from 'sonner';
import { format, subDays, subMonths, subYears, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import LoaderComponent from '@/shared/components/ui/Loader';
import { CertificatePagination } from './certificate-pagination';

// Definimos los tipos de Actas disponibles
const CertificateTypes = {
    ENTRY: "Entrada",
    EXIT: "Salida",
    TRANSFER: "Transferencia",
} as const;

interface CertificateTableProps {
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function CertificateTable({ currentPage, itemsPerPage, onPageChange }: CertificateTableProps) {
    const router = useRouter();
    const { getUsers, users } = useUserStore();
    const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);
    const {
        filteredCertificates: storeFilteredCertificates,
        searchTerm,
        typeFilter,
        dateFilter,
        loading,
        error,
        totalPages,
        getCertificates,
        deleteCertificate,
        setSearchTerm,
        setTypeFilter,
        setDateFilter,
        clearFilters,
    } = useCertificateStore();

    // Nuevo filtro de rango de fechas
    type DateRangeType = 'all' | 'last7' | 'lastMonth' | 'lastYear';
    const [dateRange, setDateRange] = useState<DateRangeType>('all');

    // Filtrar actas según el rango de fechas seleccionado
    const filteredCertificates = storeFilteredCertificates.filter(cert => {
        if (dateRange === 'all') return true;
        const certDate = new Date(cert.date);
        const now = new Date();
        if (dateRange === 'last7') return isAfter(certDate, subDays(now, 7));
        if (dateRange === 'lastMonth') return isAfter(certDate, subMonths(now, 1));
        if (dateRange === 'lastYear') return isAfter(certDate, subYears(now, 1));
        return true;
    });

    useEffect(() => {
        const loadUsers = async () => {
            try {
                await getUsers(1, 100);
            } catch (error) {
                console.error('Error loading users:', error);
            }
        };
        loadUsers();
    }, [getUsers]);

    useEffect(() => {
        const loadData = async () => {
            try {
                await getCertificates(currentPage, itemsPerPage);
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Error al cargar los datos');
            }
        };
        loadData();
    }, [getCertificates, currentPage, itemsPerPage]);

    const handlePageChange = async (page: number) => {
        try {
            await getCertificates(page, itemsPerPage);
            onPageChange(page);
        } catch (error) {
            console.error('Error changing page:', error);
            toast.error('Error al cambiar de página');
        }
    };

    const handleDelete = async () => {
        if (certificateToDelete === null) return;

        try {
            await deleteCertificate(certificateToDelete);
            toast.success('Acta eliminado exitosamente');
            setCertificateToDelete(null);
        } catch (error) {
            console.error('Error al eliminar el Acta:', error);
            toast.error('Error al eliminar el Acta');
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
        const user = users.find(u => Number(u.id) === Number(userId));
        return user ? `${user.person.lastName} ${user.person.firstName}` : 'No asignado';
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Card className="w-full max-w-[1200px]">
            <CardHeader className="px-4 md:px-8 pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <Input
                            placeholder="Buscar por número..."
                            className="w-full md:w-48"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Select
                            value={typeFilter}
                            onValueChange={setTypeFilter}
                        >
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Todos los tipos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                {Object.entries(CertificateTypes).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={dateRange} onValueChange={(v: string) => setDateRange(v as DateRangeType)}>
                            <SelectTrigger className="w-full md:w-40">
                                <SelectValue placeholder="Rango de fechas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las fechas</SelectItem>
                                <SelectItem value="last7">Últimos 7 días</SelectItem>
                                <SelectItem value="lastMonth">Último mes</SelectItem>
                                <SelectItem value="lastYear">Último año</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchTerm || typeFilter !== 'all' || dateRange !== 'all') && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => {
                                    clearFilters();
                                    setDateRange('all');
                                }}
                                title="Limpiar todos los filtros"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <Button
                        onClick={() => router.push('/certificates/new')}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Acta
                    </Button>
                </div>
                <hr className="border-t border-muted mt-3" />
            </CardHeader>

            <CardContent className="px-4 md:px-8 pb-6">
                <div className="min-h-[400px] flex flex-col justify-between">
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
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <LoaderComponent rows={5} columns={8} />
                                    </TableCell>
                                </TableRow>
                            ) : filteredCertificates.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <FileText className="h-10 w-10 opacity-30 mb-2" />
                                            <p className="mb-2">No hay actas para mostrar</p>
                                            <Button
                                                onClick={() => router.push('/certificates/new')}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Crear primera acta
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCertificates.map((certificate) => (
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
                                                                Esta acción no se puede deshacer. Se eliminará permanentemente el acta
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
                    {!loading && filteredCertificates.length > 0 && (
                        <div className="mt-4">
                            <CertificatePagination
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