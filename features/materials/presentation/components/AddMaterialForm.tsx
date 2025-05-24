'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MaterialType } from "../../data/interfaces/material.interface";
import { useMaterials } from "../../hooks/useMaterials";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    materialType: z.nativeEnum(MaterialType),
});

type AddMaterialFormValues = z.infer<typeof formSchema>;

export const AddMaterialForm = () => {
    const router = useRouter();
    const { loading, handleCreate } = useMaterials();

    const form = useForm<AddMaterialFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            materialType: MaterialType.Metal,
        },
    });

    const onSubmit = async (data: AddMaterialFormValues) => {
        try {
            const response = await handleCreate(data);
            console.log('Material creado:', response);

            // Siempre mostrar mensaje de éxito y navegar, incluso si el ID es 0 (temporal)
            toast.success('Material creado correctamente');
            
            // Usar router.replace en lugar de push para evitar problemas de historial
            // y aumentar el tiempo de espera para asegurar que el toast se muestre
            setTimeout(() => {
                router.replace("/materials");
            }, 1000);
            
        } catch (error) {
            console.error("Error al crear el material:", error);
            toast.error('Error al crear el material: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 px-6 md:px-12 w-full">
            <div className="w-full max-w-[1200px]">
                <h2 className="text-2xl font-bold tracking-tight">Agregar Nuevo Material</h2>
                <p className="text-muted-foreground">Complete el formulario para agregar un nuevo material al inventario</p>
            </div>

            <Card className="w-full max-w-[800px]">
                <CardHeader>
                    <CardTitle>Información del Material</CardTitle>
                    <CardDescription>
                        Ingrese los detalles del material que desea agregar al inventario
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre del Material</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Tornillo de 1/4" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="materialType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Material</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={MaterialType.Metal}>Metal</SelectItem>
                                                <SelectItem value={MaterialType.Madera}>Madera</SelectItem>
                                                <SelectItem value={MaterialType.Plástico}>Plástico</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                                placeholder="Ingrese una descripción detallada del material..."
                                                className="min-h-[100px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.replace("/materials")}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    <Package className="mr-2 h-4 w-4" />
                                    Crear Material
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}; 