'use client'

import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";

import {
    Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import {
    Popover, PopoverTrigger, PopoverContent,
} from "@/components/ui/popover";

import { ColorFormValues, colorSchema } from "../../data/schemas/color.schema";
import { useColorForm } from "../../hooks/use-color-form";
import { useColorStore } from "../../context/color-store";

export default function ColorForm() {
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const colorId = params?.id as number | undefined;
    const { getColorById } = useColorStore();

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(colorSchema),
        defaultValues: { name: "", hexCode: "#000000", description: "" },
    });

    // Cargar datos del color si estamos en modo edición (hay un ID)
    useEffect(() => {
        const loadColor = async () => {
            if (colorId) {
                setIsLoading(true);
                try {
                    const color = await getColorById(colorId);
                    if (color) {
                        // Actualizar el formulario con los datos del color
                        form.reset({
                            name: color.name,
                            hexCode: color.hexCode,
                            description: color.description,
                        });
                    }
                } catch (error) {
                    console.error("Error al cargar el color:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadColor();
    }, [colorId, getColorById, form]);

    const { onSubmit } = useColorForm(colorId ? { id: colorId } : undefined);
    const currentColor = form.watch("hexCode") || "#000000";

    const handleSubmit = form.handleSubmit(onSubmit);

    const handleCancel = () => {
        form.reset();
        setIsColorPickerOpen(false);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[300px]">Cargando...</div>;
    }

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    {colorId ? "Editar Color" : "Nuevo Color"}
                </CardTitle>
                <CardDescription>
                    {colorId 
                        ? "Modifique los datos para actualizar este color" 
                        : "Complete los datos para crear un nuevo color"
                    }
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre del color" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hexCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código HEX</FormLabel>

                                    <div className="flex items-center gap-4">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Popover
                                                    open={isColorPickerOpen}
                                                    onOpenChange={setIsColorPickerOpen}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <div
                                                            className="w-5 h-5 rounded-full border shadow-sm cursor-pointer"
                                                            style={{ backgroundColor: currentColor }}
                                                        />
                                                    </PopoverTrigger>

                                                    <PopoverContent className="p-2 w-auto">
                                                        <div className="flex flex-col gap-2">
                                                            <HexColorPicker
                                                                color={currentColor}
                                                                onChange={(c) =>
                                                                    form.setValue("hexCode", c, { shouldValidate: true })
                                                                }
                                                            />
                                                            <p className="text-xs text-center">{currentColor}</p>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="pl-12"
                                                    onClick={() => setIsColorPickerOpen(true)}
                                                />
                                            </FormControl>
                                        </div>

                                        <div
                                            className="w-12 h-12 rounded-full border shadow-sm"
                                            style={{ backgroundColor: currentColor }}
                                        />
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
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Descripción del color" rows={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancelar
                            </Button>

                            <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
                                {colorId ? "Actualizar" : "Guardar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}