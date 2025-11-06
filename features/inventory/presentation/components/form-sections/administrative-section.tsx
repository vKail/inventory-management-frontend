import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { InventoryFormData } from "@/features/inventory/data/interfaces/inventory.interface";
import { useLocationStore } from "@/features/locations/context/location-store";
import { useUserStore } from "@/features/users/context/user-store";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useConditionStore } from "@/features/conditions/context/condition-store";
import { Combobox } from "@/components/ui/combobox";

export const AdministrativeSection = () => {
    const form = useFormContext<InventoryFormData>();
    const { locations, getLocations } = useLocationStore();
    const { users, getUsers } = useUserStore();
    const { conditions, getConditions } = useConditionStore();

    useEffect(() => {
        // Request all locations so combobox shows the full list
        getLocations(1, 10, '', 'all', true);
        getConditions();
        getUsers();
    }, []);

    const locationOptions = locations.map(location => ({
        value: location.id ?? 0,
        label: location.name ?? ''
    }));

    const userOptions = users.map(user => ({
        value: user.id,
        label: `${user.person.dni} - ${user.person.firstName} ${user.person.lastName}`
    }));

    const conditionOptions = conditions.map(condition => ({
        value: condition.id,
        label: condition.name
    }));

    return (
        <Card id="administrative-section">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 p-6 border-r">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Información Administrativa</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Datos administrativos y de ubicación del bien.
                    </p>
                </div>
                <div className="md:col-span-3 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="locationId"
                            render={({ field }) => (
                                <FormItem data-field="locationId">
                                    <FormLabel>Ubicación *</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={locationOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar ubicación"
                                            searchPlaceholder="Buscar ubicación..."
                                            emptyMessage="No se encontraron ubicaciones"
                                            fieldName="locationId"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="custodianId"
                            render={({ field }) => (
                                <FormItem data-field="custodianId">
                                    <FormLabel>Custodio *</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={userOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar custodio"
                                            searchPlaceholder="Buscar custodio..."
                                            emptyMessage="No se encontraron custodios"
                                            fieldName="custodianId"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="conditionId"
                            render={({ field }) => (
                                <FormItem data-field="conditionId">
                                    <FormLabel>Condición *</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={conditionOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar condición"
                                            searchPlaceholder="Buscar condición..."
                                            emptyMessage="No se encontraron condiciones"
                                            fieldName="conditionId"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="availableForLoan"
                            render={({ field }) => (
                                <FormItem data-field="availableForLoan" className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Disponible para Préstamo
                                        </FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Indica si el bien puede ser prestado
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}; 