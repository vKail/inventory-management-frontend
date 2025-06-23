import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InventoryFormData } from "@/features/inventory/data/interfaces/inventory.interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Barcode } from "lucide-react";

export const IdentificationSection = () => {
    const form = useFormContext<InventoryFormData>();

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 p-6 border-r">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Identificación y Códigos</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Datos básicos para identificar el bien en el sistema.
                    </p>
                </div>
                <div className="md:col-span-3 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código del Bien *</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input placeholder="Código único del bien" maxLength={50} {...field} />
                                        </FormControl>
                                        <Button type="button" variant="secondary" size="icon">
                                            <Barcode className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="text-xs text-muted-foreground text-right">
                                        {field.value?.length || 0}/50 caracteres
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="previousCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código Anterior</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Código anterior del bien" maxLength={50} {...field} />
                                    </FormControl>
                                    <div className="text-xs text-muted-foreground text-right">
                                        {field.value?.length || 0}/50 caracteres
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Identificador *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Identificador único" maxLength={100} {...field} />
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
                            name="commitmentNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nro de Acta/Matriz *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Número de acta o matriz" maxLength={50} {...field} />
                                    </FormControl>
                                    <div className="text-xs text-muted-foreground text-right">
                                        {field.value?.length || 0}/50 caracteres
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="normativeType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo Normativo *</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Seleccione tipo</option>
                                            <option value="PROPERTY">Propiedad</option>
                                            <option value="CONSUMABLE">Consumible</option>
                                        </select>
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