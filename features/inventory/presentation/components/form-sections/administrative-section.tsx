"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AdministrativeSectionProps {
    form: UseFormReturn<any>;
}

export const AdministrativeSection = ({ form }: AdministrativeSectionProps) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleDateChange = (field: any, date: Date | undefined) => {
        if (date) {
            field.onChange(date.toISOString());
            setIsCalendarOpen(false); // Close the calendar after selection
        } else {
            field.onChange(null);
        }
    };

    return (
        <Card>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 p-6 border-r">
                    <h3 className="text-lg font-semibold mb-2">Información Administrativa</h3>
                    <p className="text-sm text-muted-foreground">
                        Detalles administrativos y de adquisición del producto.
                    </p>
                </div>
                <div className="col-span-8 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="normativeType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo Normativo</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione tipo normativo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="PROPERTY">Propiedad</SelectItem>
                                            <SelectItem value="ADMINISTRATIVE_CONTROL">Control Administrativo</SelectItem>
                                            <SelectItem value="INVENTORY">Inventario</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="origin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Origen</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione origen" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="PURCHASE">Compra</SelectItem>
                                            <SelectItem value="DONATION">Donación</SelectItem>
                                            <SelectItem value="MANUFACTURING">Fabricación</SelectItem>
                                            <SelectItem value="TRANSFER">Transferencia</SelectItem>
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
                                        <Input {...field} placeholder="Ej: Compra directa" />
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
                                        <Input {...field} placeholder="Ej: Nuevo" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="acquisitionDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de Adquisición</FormLabel>
                                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(new Date(field.value), "PPP", { locale: es })
                                                    ) : (
                                                        <span>Seleccione una fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => handleDateChange(field, date)}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
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
                                        <Input {...field} placeholder="Ej: COMP-2024-001" />
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