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

type StatusBadgeProps = {
    value: string | boolean;
    trueLabel?: string;
    falseLabel?: string;
    trueColor?: string;
    falseColor?: string;
    custom?: Record<string, { label: string; color: string }>;
};

function StatusBadge({ value, trueLabel = 'Sí', falseLabel = 'No', trueColor = 'bg-green-100 text-green-800', falseColor = 'bg-gray-100 text-gray-800', custom = {} }: StatusBadgeProps) {
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
        <Card className="w-full">
            <CardHeader className="px-2 sm:px-4 md:px-8 pb-0">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full lg:w-auto py-2 mb-4">
                        <Input
                            placeholder="Buscar por número..."
                            className="w-full sm:w-48"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Select
                            value={typeFilter}
                            onValueChange={setTypeFilter}
                        >
                            <SelectTrigger className="w-full sm:w-48">
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
                            <SelectTrigger className="w-full sm:w-40">
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
                                className="h-10 w-10 cursor-pointer"
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
                        className="bg-red-600 hover:bg-red-700 cursor-pointer w-full sm:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Acta
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
                                        <TableHead className="min-w-[80px] w-[10%]">Número</TableHead>
                                        <TableHead className="min-w-[120px] w-[15%]">Fecha</TableHead>
                                        <TableHead className="min-w-[100px] w-[12%]">Tipo</TableHead>
                                        <TableHead className="min-w-[100px] w-[12%]">Estado</TableHead>
                                        <TableHead className="min-w-[150px] w-[18%]">Responsable Entrega</TableHead>
                                        <TableHead className="min-w-[150px] w-[18%]">Responsable Recepción</TableHead>
                                        <TableHead className="min-w-[100px] w-[10%]">Contabilizado</TableHead>
                                        <TableHead className="min-w-[100px] w-[5%] text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24">
                                                <LoaderComponent rows={5} columns={8} />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredCertificates.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="h-10 w-10 opacity-30" />
                                                    <span>No hay actas para mostrar</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCertificates.map((certificate) => (
                                            <TableRow key={certificate.id} className="hover:bg-muted/50">
                                                <TableCell>{certificate.number}</TableCell>
                                                <TableCell>
                                                    {format(new Date(certificate.date), 'PPP', { locale: es })}
                                                </TableCell>
                                                <TableCell>{getTypeLabel(certificate.type)}</TableCell>
                                                <TableCell>
                                                    <StatusBadge
                                                        value={certificate.status}
                                                        trueLabel="Aprobado"
                                                        falseLabel="Cancelado"
                                                        trueColor="bg-green-100 text-green-800"
                                                        falseColor="bg-red-100 text-red-800"
                                                        custom={{
                                                            'APPROVED': { label: 'Aprobado', color: 'bg-green-100 text-green-800' },
                                                            'CANCELLED': { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
                                                            'DRAFT': { label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{getResponsibleName(certificate.deliveryResponsibleId)}</TableCell>
                                                <TableCell>{getResponsibleName(certificate.receptionResponsibleId)}</TableCell>
                                                <TableCell>
                                                    <StatusBadge
                                                        value={certificate.accounted}
                                                        trueLabel="Sí"
                                                        falseLabel="No"
                                                        trueColor="bg-green-100 text-green-800"
                                                        falseColor="bg-gray-100 text-gray-800"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(certificate.id)}
                                                            className="cursor-pointer"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => setCertificateToDelete(certificate.id)}
                                                                    className="cursor-pointer"
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
                        </div>
                    </div>
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