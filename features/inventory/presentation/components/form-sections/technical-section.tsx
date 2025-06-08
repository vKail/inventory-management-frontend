import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryFormData } from "@/features/inventory/data/interfaces/inventory.interface";
import { useCertificateStore } from "@/features/certificates/context/certificate-store";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";

export const TechnicalSection = () => {
    const form = useFormContext<InventoryFormData>();
    const { certificates, getCertificates } = useCertificateStore();

    useEffect(() => {
        getCertificates();
    }, []);

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 p-6 border-r">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Información Técnica</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Características técnicas y especificaciones del bien.
                    </p>
                </div>
                <div className="md:col-span-3 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="certificateId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Certificado</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        value={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione el certificado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {certificates.map((certificate) => (
                                                <SelectItem
                                                    key={certificate.id}
                                                    value={certificate.id.toString()}
                                                >
                                                    {certificate.number} - {certificate.observations}
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
                            name="entryOrigin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Origen de Entrada</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Origen del bien" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="entryType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Entrada</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tipo de entrada" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                            name="commitmentNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de Compromiso</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Número de compromiso" {...field} />
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
                                        <Input placeholder="Características del modelo" {...field} />
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
                                        <Input placeholder="Marca, raza u otro" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="identificationSeries"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Serie de Identificación</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Serie de identificación" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="warrantyDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de Garantía</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dimensions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dimensiones</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dimensiones del bien" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="critical"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Crítico
                                        </FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Indica si el bien es crítico
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

                        <FormField
                            control={form.control}
                            name="dangerous"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Peligroso
                                        </FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Indica si el bien es peligroso
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

                        <FormField
                            control={form.control}
                            name="requiresSpecialHandling"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Requiere Tratamiento Especial
                                        </FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Indica si el bien requiere manejo especial
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

                        <FormField
                            control={form.control}
                            name="perishable"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Perecedero
                                        </FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Indica si el bien es perecedero
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

                        <FormField
                            control={form.control}
                            name="expirationDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de Expiración</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
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