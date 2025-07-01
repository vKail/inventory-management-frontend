"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { stateSchema, StateFormValues } from '../../data/schemas/state.schema';
import { IState } from '../../data/interfaces/state.interface';
import { useEffect } from "react";

interface StateFormProps {
    initialData?: IState;
    onSubmit: (data: StateFormValues) => Promise<void>;
    isLoading: boolean;
}

export function StateForm({ initialData, onSubmit, isLoading }: StateFormProps) {
    const router = useRouter();

    const form = useForm<StateFormValues>({
        resolver: zodResolver(stateSchema),
        defaultValues: {
            name: '',
            description: ''
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                description: initialData.description || ''
            });
        }
    }, [initialData, form]);

    const handleSubmit: SubmitHandler<StateFormValues> = async (data) => {
        try {
            await onSubmit(data);
        } catch (error) {
            console.error('Error en el formulario:', error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Detalles Básicos */}
                <div className="flex flex-col md:flex-row gap-8 w-full">
                    <div className="md:w-1/3">
                        <h3 className="text-lg font-semibold mb-1">Detalles Básicos</h3>
                        <p className="text-muted-foreground text-sm">
                            Información general del estado.
                        </p>
                    </div>
                    <div className="md:w-2/3">
                        <Card>
                            <CardHeader>
                                <CardTitle>{initialData ? "Editar Estado" : "Nuevo Estado"}</CardTitle>
                                <CardDescription>
                                    {initialData
                                        ? "Modifica los datos del estado"
                                        : "Complete los datos para crear un nuevo estado"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nombre del estado"
                                                    maxLength={25}
                                                    shouldAutoCapitalize={true}
                                                    {...field}
                                                    onChange={e => {
                                                        let value = e.target.value;
                                                        value = value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\-_\s]/g, '');
                                                        field.onChange(value);
                                                    }}
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
                                                    placeholder="Descripción del estado"
                                                    maxLength={250}
                                                    shouldAutoCapitalize={true}
                                                    {...field}
                                                    onChange={e => {
                                                        let value = e.target.value;
                                                        value = value.replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\-_\s]/g, '');
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <div className="text-xs text-muted-foreground text-right">
                                                {field.value?.length || 0}/250 caracteres
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {/* Botones */}
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" variant="default" disabled={isLoading}>
                        {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
