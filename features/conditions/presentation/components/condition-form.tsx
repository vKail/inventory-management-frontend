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
import { ICondition } from '../../data/interfaces/condition.interface';
import { conditionSchema, ConditionFormValues } from '../../data/schemas/condition.schema';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useConditionStore } from '../../context/condition-store';

interface ConditionFormProps {
    initialData?: Partial<ICondition>;
    onSubmit: (data: ConditionFormValues) => Promise<void>;
    isLoading: boolean;
    id?: string;
}

export function ConditionForm({ initialData, onSubmit, isLoading, id }: ConditionFormProps) {
    const router = useRouter();
    const { getConditionById } = useConditionStore();

    const form = useForm<ConditionFormValues>({
        resolver: zodResolver(conditionSchema),
        defaultValues: {
            name: '',
            description: '',
            requiresMaintenance: false,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                description: initialData.description || '',
                requiresMaintenance: initialData.requiresMaintenance || false,
            });
        }
    }, [initialData, form]);

    return (
        <div className="flex-1 space-y-6 container mx-auto px-4 max-w-7xl">
            {/* Breadcrumbs, título y descripción */}
            <div className="w-full">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Configuración</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <ShieldCheck className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/conditions">Condiciones</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{id ? "Editar Condición" : "Nueva Condición"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex flex-col md:flex-row gap-x-8 gap-y-8">
                {/* Descripción a la izquierda */}
                <div className="md:w-1/3">
                    <h3 className="text-lg font-semibold mb-1">Detalles de la condición</h3>
                    <p className="text-muted-foreground text-sm">
                        Ingresa el nombre, descripción y si requiere mantenimiento para la condición.
                    </p>
                </div>

                {/* Formulario a la derecha */}
                <div className="md:w-2/3">
                    <Card>
                        <CardHeader>
                            <CardTitle>{id ? "Editar Condición" : "Nueva Condición"}</CardTitle>
                            <CardDescription>
                                {id ? "Modifica los datos de la condición" : "Complete los datos para crear una nueva condición"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nombre de la condición" maxLength={100} {...field} />
                                                </FormControl>
                                                <div className="text-xs text-muted-foreground text-right">
                                                    {field.value?.length || 0}/100 caracteres
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descripción *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Descripción de la condición"
                                                        maxLength={500}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <div className="text-xs text-muted-foreground text-right">
                                                    {field.value?.length || 0}/500 caracteres
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="requiresMaintenance"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Requiere Mantenimiento
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Indica si los ítems con esta condición requieren mantenimiento
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

                                    <div className="flex justify-end gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push('/conditions')}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    {id ? "Actualizando..." : "Creando..."}
                                                </>
                                            ) : (
                                                id ? "Actualizar" : "Crear"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
