"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useItemTypeStore } from "@/features/item-types/context/item-types-store";
import { useStateStore } from "@/features/states/context/state-store";
import { useConditionStore } from "@/features/conditions/context/condition-store";
import LoaderComponent from "@/shared/components/ui/Loader";
import { useCategoryStore } from "@/features/categories/context/category-store";

interface GeneralInfoSectionProps {
    form: UseFormReturn<any>;
}

export const GeneralInfoSection = ({ form }: GeneralInfoSectionProps) => {
    const { categories, loading: loadingCategories } = useCategoryStore();
    const { itemTypes, loading: loadingTypes } = useItemTypeStore();
    const { states, loading: loadingStates } = useStateStore();
    const { conditions, loading: loadingConditions } = useConditionStore();

    if (loadingTypes || loadingStates || loadingConditions) {
        return <LoaderComponent rows={3} columns={2} />;
    }

    return (
        <Card>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 p-6 border-r">
                    <h3 className="text-lg font-semibold mb-2">Información General</h3>
                    <p className="text-sm text-muted-foreground">
                        Detalles generales y clasificación del producto.
                    </p>
                </div>
                <div className="col-span-8 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Producto</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Ej: Laptop Dell XPS 13" />
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
                                            {...field}
                                            placeholder="Describe el producto..."
                                            className="resize-none"
                                        />
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
                                            min={0}
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
                            name="itemTypeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Item</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione tipo de item" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {itemTypes.map((type) => (
                                                <SelectItem key={type.id} value={type.id.toString()}>
                                                    {type.name}
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
                                                <SelectValue placeholder="Selecciona una categoría" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
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
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione estado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {states.map((state) => (
                                                <SelectItem key={state.id} value={state.id.toString()}>
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
                            name="conditionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Condición</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione condición" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {conditions.map((condition) => (
                                                <SelectItem key={condition.id} value={condition.id.toString()}>
                                                    {condition.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}; 