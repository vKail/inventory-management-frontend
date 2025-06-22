import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InventoryFormData } from "@/features/inventory/data/interfaces/inventory.interface";
import { useItemTypeStore } from "@/features/item-types/context/item-types-store";
import { useCategoryStore } from "@/features/categories/context/category-store";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useStateStore } from "@/features/states/context/state-store";
import { Combobox } from "@/components/ui/combobox";

export const GeneralInfoSection = () => {
    const form = useFormContext<InventoryFormData>();
    const { itemTypes, getItemTypes } = useItemTypeStore();
    const { categories, getCategories } = useCategoryStore();
    const { states, getStates } = useStateStore();

    useEffect(() => {
        getItemTypes();
        getCategories();
        getStates();
    }, []);

    const itemTypeOptions = itemTypes.map(type => ({
        value: type.id,
        label: type.name
    }));

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }));

    const stateOptions = states.map(state => ({
        value: state.id,
        label: state.name
    }));

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 p-6 border-r">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Información General</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Datos generales y clasificación del bien.
                    </p>
                </div>
                <div className="md:col-span-3 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre del bien" maxLength={100} {...field} />
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
                                        <Input placeholder="Descripción detallada" maxLength={500} {...field} />
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
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Cantidad disponible"
                                            min="1"
                                            max="999999"
                                            {...field}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (value > 999999) {
                                                    field.onChange(999999);
                                                } else {
                                                    field.onChange(value);
                                                }
                                            }}
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
                                    <FormLabel>Tipo de Item *</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={itemTypeOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar tipo de item"
                                            searchPlaceholder="Buscar tipo de item..."
                                            emptyMessage="No se encontraron tipos de item"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoría *</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={categoryOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar categoría"
                                            searchPlaceholder="Buscar categoría..."
                                            emptyMessage="No se encontraron categorías"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="statusId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado *</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={stateOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar estado"
                                            searchPlaceholder="Buscar estado..."
                                            emptyMessage="No se encontraron estados"
                                        />
                                    </FormControl>
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