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
import { IMaterial, MaterialTypes } from '../../data/interfaces/material.interface';
import { materialSchema, MaterialFormValues } from '../../data/schemas/material.schema';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package } from 'lucide-react';
import { useEffect } from 'react';

interface MaterialFormProps {
    initialData?: Partial<IMaterial>;
    onSubmit: (data: MaterialFormValues) => Promise<void>;
    isLoading: boolean;
    id?: string;
}

export function MaterialForm({ initialData, onSubmit, isLoading, id }: MaterialFormProps) {
    const router = useRouter();

    const form = useForm<MaterialFormValues>({
        resolver: zodResolver(materialSchema),
        defaultValues: {
            name: '',
            description: '',
            materialType: MaterialTypes.CONSUMABLE
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                description: initialData.description || '',
                materialType: initialData.materialType || MaterialTypes.CONSUMABLE,
            });
        }
    }, [initialData, form]);

    return (
        <div className="flex-1 space-y-6">
            {/* Breadcrumbs, título y descripción */}
            <div className="w-full">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Inventario</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Package className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/materials">Materiales</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{id && id !== 'new' ? "Editar Material" : "Nuevo Material"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex flex-col md:flex-row gap-x-8 gap-y-8">
                {/* Descripción a la izquierda */}
                <div className="md:w-1/3">
                    <h3 className="text-lg font-semibold mb-1">Detalles del material</h3>
                    <p className="text-muted-foreground text-sm">
                        Ingresa el nombre, descripción y tipo de material.
                    </p>
                </div>

                {/* Formulario a la derecha */}
                <div className="md:w-2/3">
                    <Card>
                        <CardHeader>
                            <CardTitle>{id && id !== 'new' ? "Editar Material" : "Nuevo Material"}</CardTitle>
                            <CardDescription>
                                {id && id !== 'new' ? "Modifica los datos del material" : "Complete los datos para crear un nuevo material"}
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
                                                    <Input placeholder="Nombre del material" maxLength={100} {...field} />
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
                                                        placeholder="Descripción del material"
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
                                        name="materialType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipo de Material *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione un tipo" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={MaterialTypes.CONSUMABLE}>Consumible</SelectItem>
                                                        <SelectItem value={MaterialTypes.TOOL}>Herramienta</SelectItem>
                                                        <SelectItem value={MaterialTypes.EQUIPMENT}>Equipo</SelectItem>
                                                        <SelectItem value={MaterialTypes.METAL}>Metal</SelectItem>
                                                        <SelectItem value={MaterialTypes.OTHER}>Otro</SelectItem>
                                                        <SelectItem value={MaterialTypes.DELICATE}>Delicados</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Seleccione el tipo de material
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push('/materials')}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    {id && id !== 'new' ? "Actualizando..." : "Creando..."}
                                                </>
                                            ) : (
                                                id && id !== 'new' ? "Actualizar" : "Crear"
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