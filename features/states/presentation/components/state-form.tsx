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
            router.push('/states');
        } catch (error) {
            console.error('Error en el formulario:', error);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col md:flex-row gap-8 w-full">
                <div className="md:w-1/3">
                    <h3 className="text-2xl font-semibold mb-2">
                        {initialData ? "Editar Estado" : "Nuevo Estado"}
                    </h3>
                    <p className="text-muted-foreground text-base">
                        {initialData
                            ? "Modifica los datos del estado"
                            : "Complete los datos para crear un nuevo estado"}
                    </p>
                </div>
                <div className="md:w-2/3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Estado</CardTitle>
                            <CardDescription>
                                Ingrese los datos requeridos para el estado
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                                                        placeholder="Descripción del estado"
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

                                    <div className="flex justify-end gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push('/states')}
                                            className="cursor-pointer"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={isLoading} className="cursor-pointer">
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    {initialData ? "Actualizando..." : "Creando..."}
                                                </>
                                            ) : (
                                                initialData ? "Actualizar" : "Crear"
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
