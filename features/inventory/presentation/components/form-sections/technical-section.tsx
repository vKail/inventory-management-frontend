import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { InventoryFormData } from "@/features/inventory/data/interfaces/inventory.interface";
import { useCertificateStore } from "@/features/certificates/context/certificate-store";
import { useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";

export const TechnicalSection = () => {
    const form = useFormContext<InventoryFormData>();
    const { certificates, getCertificates } = useCertificateStore();

    useEffect(() => {
        // Load all certificates for Combobox selection
        getCertificates(1, 10, undefined, true);
    }, []);

    const certificateOptions = certificates.map(certificate => ({
        value: certificate.id,
        label: `${certificate.number} - ${certificate.observations?.length > 30 ? certificate.observations.substring(0, 30) + '...' : certificate.observations}`
    }));

    return (
        <Card id="technical-section">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 p-6 border-r">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Información Técnica</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Detalles técnicos y características especiales del item.
                    </p>
                </div>
                <div className="md:col-span-3 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="certificateId"
                            render={({ field }) => (
                                <FormItem data-field="certificateId">
                                    <FormLabel>Acta *</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={certificateOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar Acta"
                                            searchPlaceholder="Buscar Acta..."
                                            emptyMessage="No se encontraron Actas"
                                            fieldName="certificateId"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="entryOrigin"
                            render={({ field }) => (
                                <FormItem data-field="entryOrigin">
                                    <FormLabel>Origen de Entrada *</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={[
                                                { value: "LOAN", label: "Prestamo" },
                                                { value: "PURCHASE", label: "Compra" }
                                            ]}
                                            value={typeof field.value === 'string' ? field.value : ''}
                                            onChange={(value) => {
                                                const val = (value === 'LOAN' || value === 'PURCHASE') ? value : '';
                                                field.onChange(val as 'LOAN' | 'PURCHASE');
                                                form.setValue("entryType", val as 'LOAN' | 'PURCHASE');
                                            }}
                                            placeholder="Seleccionar Origen"
                                            searchPlaceholder="Buscar Origen..."
                                            emptyMessage="No se encontraron opciones"
                                            fieldName="entryOrigin"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Hidden field for entryType to ensure it is sent in the form data */}
                        <input type="hidden" {...form.register("entryType")} />

                        <FormField
                            control={form.control}
                            name="acquisitionDate"
                            render={({ field }) => {
                                let dateValue: Date | undefined = undefined;
                                if (field.value) {
                                    dateValue = typeof field.value === 'string' ? new Date(field.value) : field.value;
                                }
                                return (
                                    <FormItem data-field="acquisitionDate" className="flex flex-col">
                                        <FormLabel>Fecha de Adquisición *</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={`w-full pl-3 text-left font-normal ${!dateValue && "text-muted-foreground"}`}
                                                    >
                                                        {dateValue ? (
                                                            format(dateValue, "PPP", { locale: es })
                                                        ) : (
                                                            <span>Seleccionar fecha</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dateValue}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="commitmentNumber"
                            render={({ field }) => (
                                <FormItem data-field="commitmentNumber">
                                    <FormLabel>Número de Compromiso *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Número de compromiso"
                                            maxLength={20}
                                            {...field}
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <div className="text-xs text-muted-foreground text-right">
                                        {(field.value || '').length}/20 caracteres
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="modelCharacteristics"
                            render={({ field }) => (
                                <FormItem data-field="modelCharacteristics">
                                    <FormLabel>Características del Modelo *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Características del modelo" maxLength={60} {...field} />
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
                            name="brandBreedOther"
                            render={({ field }) => (
                                <FormItem data-field="brandBreedOther">
                                    <FormLabel>Marca/Raza/Otro *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Marca, raza u otro" maxLength={60} {...field} />
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
                            name="identificationSeries"
                            render={({ field }) => (
                                <FormItem data-field="identificationSeries">
                                    <FormLabel>Serie de Identificación *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Serie de identificación" maxLength={60} {...field} />
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
                            name="warrantyDate"
                            render={({ field }) => (
                                <FormItem data-field="warrantyDate" className="flex flex-col">
                                    <FormLabel>Fecha de Garantía *</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: es })
                                                    ) : (
                                                        <span>Seleccionar fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dimensions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dimensiones *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dimensiones del bien" maxLength={60} {...field} />
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
                            name="expirationDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de Expiración *</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: es })
                                                    ) : (
                                                        <span>Seleccionar fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormItem>
                            )}
                        />

                        <div className="col-span-2 space-y-4">
                            <FormField
                                control={form.control}
                                name="critical"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Crítico</FormLabel>
                                            <FormDescription>
                                                Indica si el item es crítico para las operaciones
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dangerous"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Peligroso</FormLabel>
                                            <FormDescription>
                                                Indica si el item es peligroso
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="requiresSpecialHandling"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Requiere Manejo Especial</FormLabel>
                                            <FormDescription>
                                                Indica si el item requiere manejo especial
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="perishable"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Perecedero</FormLabel>
                                            <FormDescription>
                                                Indica si el item es perecedero
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}; 