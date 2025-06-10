import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InventoryFormData } from "@/features/inventory/data/interfaces/inventory.interface";
import { Card } from "@/components/ui/card";

export const AccountingSection = () => {
    const form = useFormContext<InventoryFormData>();

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 p-6 border-r">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Información Contable</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Datos contables y financieros del bien.
                    </p>
                </div>
                <div className="md:col-span-3 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="itemLine"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Línea de Item</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Ingrese la línea de item"
                                            {...field}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="accountingAccount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cuenta Contable</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Cuenta contable" {...field} />
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
                                        <Input placeholder="Observaciones adicionales" {...field} />
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