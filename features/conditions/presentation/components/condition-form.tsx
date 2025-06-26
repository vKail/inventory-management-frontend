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
    const isEdit = id !== undefined && id !== 'new';

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
        <div className="space-y-4">
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
                            <BreadcrumbPage>{isEdit ? "Editar Condición" : "Nueva Condición"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Texto descriptivo a la izquierda */}
                <div className="md:w-1/3">
                    <h3 className="text-2xl font-semibold mb-2">
                        {isEdit ? "Editar Condición" : "Nueva Condición"}
                    </h3>
                    <p className="text-muted-foreground text-base">
                        {isEdit ? "Modifica los datos de la condición." : "Complete los datos para crear una nueva condición."}
                    </p>
                </div>

                {/* Formulario a la derecha */}
                <div className="md:w-2/3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Condición</CardTitle>
                            <CardDescription>
                                Ingrese los datos requeridos para la condición
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
                                                    <Input
                                                        placeholder="Nombre de la condición"
                                                        maxLength={25}
                                                        textOnly={true}
                                                        shouldAutoCapitalize={true}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <div className="text-xs text-muted-foreground text-right">
                                                    {field.value?.length || 0}/25 caracteres
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
                                                        maxLength={250}
                                                        descriptionOnly={true}
                                                        shouldAutoCapitalize={true}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <div className="text-xs text-muted-foreground text-right">
                                                    {field.value?.length || 0}/250 caracteres
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

                                    <div className="flex justify-end gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push('/conditions')}
                                            className="cursor-pointer"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={isLoading} className="cursor-pointer">
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    {isEdit ? "Actualizando..." : "Creando..."}
                                                </>
                                            ) : (
                                                isEdit ? "Actualizar" : "Crear"
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
