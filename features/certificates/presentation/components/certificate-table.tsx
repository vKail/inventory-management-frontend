'use client';

import { useEffect, useState } from 'react';
import { useCertificateStore } from '@/features/certificates/context/certificate-store';
import { useUserStore } from '@/features/users/context/user-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, FilterX, FileText } from 'lucide-react';
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
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

// Definimos los tipos de Actas disponibles
const CertificateTypes = {
    ENTRY: "Entrada",
    EXIT: "Salida",
    TRANSFER: "Transferencia",
} as const;

// Definimos los estados disponibles
const CertificateStatuses = {
    DRAFT: "Borrador",
    APPROVED: "Aprobado",
    CANCELLED: "Cancelado",
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
        statusFilter,
        dateFilter,
        loading,
        error,
        totalPages,
        getCertificates,
        deleteCertificate,
        setSearchTerm,
        setTypeFilter,
        setStatusFilter,
        setDateFilter,
        clearFilters,
    } = useCertificateStore();

    // Nuevo filtro de rango de fechas
    type DateRangeType = 'all' | 'last7' | 'lastMonth' | 'lastYear' | 'custom';
    const [customDateFrom, setCustomDateFrom] = useState<string>('');
    const [customDateTo, setCustomDateTo] = useState<string>('');
    const [showDateFromPopover, setShowDateFromPopover] = useState(false);
    const [showDateToPopover, setShowDateToPopover] = useState(false);

    // Función para obtener fechas según el rango seleccionado
    const getDateRange = (range: DateRangeType) => {
        const now = new Date();
        switch (range) {
            case 'last7':
                return {
                    dateFrom: format(subDays(now, 7), 'yyyy-MM-dd'),
                    dateTo: format(now, 'yyyy-MM-dd')
                };
            case 'lastMonth':
                return {
                    dateFrom: format(subMonths(now, 1), 'yyyy-MM-dd'),
                    dateTo: format(now, 'yyyy-MM-dd')
                };
            case 'lastYear':
                return {
                    dateFrom: format(subYears(now, 1), 'yyyy-MM-dd'),
                    dateTo: format(now, 'yyyy-MM-dd')
                };
            case 'custom':
                return {
                    dateFrom: customDateFrom,
                    dateTo: customDateTo
                };
            default:
                return { dateFrom: '', dateTo: '' };
        }
    };

    // Aplicar filtros al backend
    useEffect(() => {
        const loadData = async () => {
            try {
                await getCertificates(currentPage, itemsPerPage, {
                    search: searchTerm,
                    type: typeFilter,
                    status: statusFilter,
                    dateFrom: customDateFrom,
                    dateTo: customDateTo
                });
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Error al cargar los datos');
            }
        };
        loadData();
    }, [getCertificates, currentPage, itemsPerPage, searchTerm, typeFilter, statusFilter, customDateFrom, customDateTo]);

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

    const handlePageChange = async (page: number) => {
        try {
            await getCertificates(page, itemsPerPage, {
                search: searchTerm,
                type: typeFilter,
                status: statusFilter,
                dateFrom: customDateFrom,
                dateTo: customDateTo
            });
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
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full lg:w-auto items-end">
                        <Input
                            placeholder="Buscar por número..."
                            className="w-full sm:w-60"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Select
                            value={typeFilter}
                            onValueChange={setTypeFilter}
                        >
                            <SelectTrigger className="w-full sm:w-32">
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
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full sm:w-32">
                                <SelectValue placeholder="Todos los estados" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                {Object.entries(CertificateStatuses).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* ComboBox para fecha Desde */}
                        <Popover open={showDateFromPopover} onOpenChange={setShowDateFromPopover}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 w-full sm:w-32"
                                    onClick={() => setShowDateFromPopover(true)}
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                    {customDateFrom ? customDateFrom : 'Desde'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-4 z-50" align="start">
                                <Calendar
                                    mode="single"
                                    selected={customDateFrom ? new Date(customDateFrom) : undefined}
                                    onSelect={date => {
                                        setCustomDateFrom(date ? format(date, 'yyyy-MM-dd') : '');
                                        setShowDateFromPopover(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {/* ComboBox para fecha Hasta */}
                        <Popover open={showDateToPopover} onOpenChange={setShowDateToPopover}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 w-full sm:w-32"
                                    onClick={() => setShowDateToPopover(true)}
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                    {customDateTo ? customDateTo : 'Hasta'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-4 z-50" align="start">
                                <Calendar
                                    mode="single"
                                    selected={customDateTo ? new Date(customDateTo) : undefined}
                                    onSelect={date => {
                                        setCustomDateTo(date ? format(date, 'yyyy-MM-dd') : '');
                                        setShowDateToPopover(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || customDateFrom || customDateTo) && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 cursor-pointer"
                                onClick={() => {
                                    clearFilters();
                                    setCustomDateFrom('');
                                    setCustomDateTo('');
                                }}
                                title="Limpiar todos los filtros"
                            >
                                <FilterX className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <div className="flex items-end lg:items-end">
                        <Button
                            onClick={() => router.push('/certificates/new')}
                            className="bg-red-600 hover:bg-red-700 cursor-pointer w-full sm:w-auto"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Acta
                        </Button>
                    </div>
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
                                    ) : storeFilteredCertificates.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="h-10 w-10 opacity-30" />
                                                    <span>No hay actas para mostrar</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        storeFilteredCertificates.map((certificate) => (
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
                    {!loading && storeFilteredCertificates.length > 0 && (
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