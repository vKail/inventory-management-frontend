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
        <Card id="general-info-section">
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
                                <FormItem data-field="name">
                                    <FormLabel>Nombre *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre del bien" maxLength={60} {...field} />
                                    </FormControl>
                                    <div className="text-xs text-muted-foreground text-right">
                                        {field.value?.length || 0}/60 caracteres
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem data-field="description">
                                    <FormLabel>Descripción *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Descripción detallada" maxLength={250} {...field} />
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
                            name="stock"
                            render={({ field }) => (
                                <FormItem data-field="stock">
                                    <FormLabel>Stock *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Cantidad disponible"
                                            {...field}
                                            value={field.value?.toString() || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Only allow numeric input
                                                if (value === '' || /^\d+$/.test(value)) {
                                                    if (value === '') {
                                                        // Don't set any value when empty, let validation handle it
                                                        field.onChange('');
                                                    } else {
                                                        const numValue = parseInt(value);
                                                        if (numValue > 999999) {
                                                            field.onChange(999999);
                                                        } else {
                                                            field.onChange(numValue);
                                                        }
                                                    }
                                                }
                                            }}
                                            onKeyPress={(e) => {
                                                // Prevent non-numeric characters
                                                if (!/\d/.test(e.key)) {
                                                    e.preventDefault();
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
                                <FormItem data-field="itemTypeId">
                                    <FormLabel>Tipo de Item *</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={itemTypeOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar tipo de item"
                                            searchPlaceholder="Buscar tipo de item..."
                                            emptyMessage="No se encontraron tipos de item"
                                            fieldName="itemTypeId"
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
                                <FormItem data-field="categoryId">
                                    <FormLabel>Categoría *</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={categoryOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar categoría"
                                            searchPlaceholder="Buscar categoría..."
                                            emptyMessage="No se encontraron categorías"
                                            fieldName="categoryId"
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
                                <FormItem data-field="statusId">
                                    <FormLabel>Estado *</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={stateOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar estado"
                                            searchPlaceholder="Buscar estado..."
                                            emptyMessage="No se encontraron estados"
                                            fieldName="statusId"
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