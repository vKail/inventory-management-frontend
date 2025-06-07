'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { ICertificate } from '../../data/interfaces/certificate.interface';
import { certificateSchema, CertificateFormValues } from '../../data/schemas/certificate.schema';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FileText } from 'lucide-react';
import { useEffect } from 'react';
import { useCertificateStore } from '../../context/certificate-store';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface CertificateFormProps {
    initialData?: Partial<ICertificate>;
    onSubmit: (data: CertificateFormValues) => Promise<void>;
    isLoading: boolean;
    id?: string;
}

export function CertificateForm({ initialData, onSubmit, isLoading, id }: CertificateFormProps) {
    const router = useRouter();
    const { getCertificateById } = useCertificateStore();

    const form = useForm<CertificateFormValues>({
        resolver: zodResolver(certificateSchema),
        defaultValues: {
            number: 0,
            date: '',
            type: 'TRANSFER',
            status: 'DRAFT',
            deliveryResponsibleId: 0,
            receptionResponsibleId: 0,
            observations: '',
            accounted: false,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                number: initialData.number || 0,
                date: initialData.date || '',
                type: initialData.type || 'TRANSFER',
                status: initialData.status || 'DRAFT',
                deliveryResponsibleId: initialData.deliveryResponsibleId || 0,
                receptionResponsibleId: initialData.receptionResponsibleId || 0,
                observations: initialData.observations || '',
                accounted: initialData.accounted || false,
            });
        }
    }, [initialData, form]);

    return (
        <div className="flex-1 space-y-6 container mx-auto px-4 max-w-7xl">
            <div className="w-full">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Configuración</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <FileText className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/certificates">Certificados</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{id ? "Editar Certificado" : "Nuevo Certificado"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{id ? "Editar Certificado" : "Nuevo Certificado"}</CardTitle>
                    <CardDescription>
                        {id
                            ? "Modifica la información del certificado existente."
                            : "Completa la información para crear un nuevo certificado."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Número del certificado" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Fecha</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(new Date(field.value), "PPP", { locale: es })
                                                            ) : (
                                                                <span>Selecciona una fecha</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => field.onChange(date?.toISOString())}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="TRANSFER">Transferencia</SelectItem>
                                                    <SelectItem value="PURCHASE">Compra</SelectItem>
                                                    <SelectItem value="DONATION">Donación</SelectItem>
                                                    <SelectItem value="MANUFACTURING">Fabricación</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un estado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="DRAFT">Borrador</SelectItem>
                                                    <SelectItem value="PENDING">Pendiente</SelectItem>
                                                    <SelectItem value="APPROVED">Aprobado</SelectItem>
                                                    <SelectItem value="REJECTED">Rechazado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="deliveryResponsibleId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Responsable de Entrega</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="ID del responsable" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="receptionResponsibleId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Responsable de Recepción</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="ID del responsable" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="observations"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Observaciones</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Observaciones del certificado"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="accounted"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Contabilizado
                                            </FormLabel>
                                            <FormDescription>
                                                Indica si el certificado ha sido contabilizado
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/certificates')}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Guardando..." : id ? "Actualizar" : "Crear"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
} 