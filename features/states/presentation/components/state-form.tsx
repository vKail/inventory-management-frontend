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
import { Switch } from "@/components/ui/switch";
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
            name: initialData?.name || '',
            description: initialData?.description || ''
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                description: initialData.description
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
                    <h3 className="text-lg font-semibold mb-1">Detalles del estado</h3>
                    <p className="text-muted-foreground text-sm">
                        Ingresa la información general del estado.
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
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nombre del estado" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descripción</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Descripción del estado"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-4 justify-end mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push('/states')}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Guardando...
                                                </>
                                            ) : (
                                                'Guardar'
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
