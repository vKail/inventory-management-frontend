'use client';

import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { useInventoryStore } from "../../context/inventory-store";
import { FilterOption, LocationOption } from "../../data/interfaces/inventory.interface";
import { InventorySchema, InventoryFormValues } from "../../data/schemas/inventory.schema";

interface InventoryFormProps {
    onSubmit: (data: InventoryFormValues) => void;
    isLoading?: boolean;
    initialData?: Partial<InventoryItem>;
}

export function InventoryForm({ onSubmit, isLoading, initialData }: InventoryFormProps) {
    const [categories, setCategories] = useState<FilterOption[]>([]);
    const [locations, setLocations] = useState<LocationOption[]>([]);
    const [states, setStates] = useState<FilterOption[]>([]);
    const [colors, setColors] = useState<FilterOption[]>([]);
    const [brands, setBrands] = useState<FilterOption[]>([]);
    const [models, setModels] = useState<FilterOption[]>([]);
    const [suppliers, setSuppliers] = useState<FilterOption[]>([]);
    const { getCategories, getLocations, getStates, getColors } = useInventoryStore();

    const defaultValues: InventoryFormValues = {
        code: initialData?.code || "",
        name: initialData?.name || "",
        stock: initialData?.stock || 0,
        description: initialData?.description || "",
        itemTypeId: initialData?.itemType?.id || 0,
        categoryId: initialData?.category?.id || 0,
        statusId: initialData?.status?.id || 0,
        normativeType: initialData?.normativeType || "ADMINISTRATIVE_CONTROL",
        origin: initialData?.origin || "PURCHASE",
        acquisitionDate: initialData?.acquisitionDate || new Date().toISOString().split('T')[0],
        locationId: initialData?.location?.id || 1,
        colorId: initialData?.color?.id || 0,
        acquisitionValue: initialData?.acquisitionValue || 0,
        currentValue: initialData?.currentValue || 0,
        usefulLife: initialData?.usefulLife || 0,
        depreciationRate: initialData?.depreciationRate || 0,
        annualDepreciation: initialData?.annualDepreciation || 0,
        accumulatedDepreciation: initialData?.accumulatedDepreciation || 0,
        serialNumber: initialData?.serialNumber || "",
        modelCharacteristics: initialData?.modelCharacteristics || "",
        brandBreedOther: initialData?.brandBreedOther || "",
        observations: initialData?.observations || "",
    };

    const form = useForm<InventoryFormValues>({
        resolver: zodResolver(InventorySchema) as Resolver<InventoryFormValues>,
        defaultValues,
        mode: "onChange"
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [categoriesData, locationsData, statesData, colorsData] = await Promise.all([
                    getCategories(),
                    getLocations(),
                    getStates(),
                    getColors(),
                ]);
                setCategories(categoriesData);
                setLocations(locationsData);
                setStates(statesData);
                setColors(colorsData);
            } catch (error) {
                console.error("Error loading form data:", error);
            }
        };
        loadData();
    }, [getCategories, getLocations, getStates, getColors]);

    const handleSubmit = (data: InventoryFormValues) => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información Básica */}
                    <div className="col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
                    </div>

                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
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
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Clasificación */}
                    <div className="col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Clasificación</h3>
                    </div>

                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoría</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    defaultValue={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione una categoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id.toString()}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="statusId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    defaultValue={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {states.map((state) => (
                                            <SelectItem
                                                key={state.id}
                                                value={state.id.toString()}
                                            >
                                                {state.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="locationId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ubicación</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    defaultValue={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione una ubicación" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {locations.map((location) => (
                                            <SelectItem
                                                key={location.id}
                                                value={location.id.toString()}
                                            >
                                                {location.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="colorId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    defaultValue={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un color" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {colors.map((color) => (
                                            <SelectItem
                                                key={color.id}
                                                value={color.id.toString()}
                                            >
                                                {color.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Información de Adquisición */}
                    <div className="col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Información de Adquisición</h3>
                    </div>

                    <FormField
                        control={form.control}
                        name="acquisitionDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de Adquisición</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="acquisitionValue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor de Adquisición</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="currentValue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor Actual</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Información de Depreciación */}
                    <div className="col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Información de Depreciación</h3>
                    </div>

                    <FormField
                        control={form.control}
                        name="usefulLife"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vida Útil (años)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="depreciationRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tasa de Depreciación (%)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="annualDepreciation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Depreciación Anual</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="accumulatedDepreciation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Depreciación Acumulada</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Información del Producto */}
                    <div className="col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Información del Producto</h3>
                    </div>

                    <FormField
                        control={form.control}
                        name="serialNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Serie</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="modelCharacteristics"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Características del Modelo</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="brandBreedOther"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marca/Raza/Otro</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="observations"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Observaciones</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </form>
        </Form>
    );
} 