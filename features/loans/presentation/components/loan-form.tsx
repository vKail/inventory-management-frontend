'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useInventoryStore } from '@/features/inventory/context/inventory-store';

const formSchema = z.object({
    reason: z.string().min(1, 'El motivo es requerido'),
    associatedEvent: z.string().optional(),
    externalLocation: z.string().min(1, 'La ubicación externa es requerida'),
    scheduledReturnDate: z.date({
        required_error: 'La fecha de devolución es requerida',
    }),
    items: z.array(z.number()).min(1, 'Debe seleccionar al menos un item'),
    notes: z.string().optional(),
});

type LoanFormData = z.infer<typeof formSchema>;

interface LoanFormProps {
    onSubmit: (data: LoanFormData) => void;
    initialData?: Partial<LoanFormData>;
    isLoading?: boolean;
}

export function LoanForm({ onSubmit, initialData, isLoading = false }: LoanFormProps) {
    const form = useForm<LoanFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            items: []
        }
    });

    const { items, getInventoryItems } = useInventoryStore();

    useEffect(() => {
        const loadData = async () => {
            try {
                await getInventoryItems(1, 100);
            } catch (error) {
                console.error('Error loading form data:', error);
            }
        };

        loadData();
    }, [getInventoryItems]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motivo del Préstamo</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describa el motivo del préstamo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="externalLocation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ubicación Externa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ubicación donde se usarán los items" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="scheduledReturnDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de Devolución</FormLabel>
                                    <Popover>
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
                                                        format(field.value, "PPP", { locale: es })
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
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date: Date) => date < new Date()}
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
                            name="items"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Items a Prestar</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange([...field.value, Number(value)])}
                                        value={field.value?.length > 0 ? field.value[0].toString() : undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione los items" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {items.map((item) => (
                                                <SelectItem key={item.id} value={item.id.toString()}>
                                                    {item.name} - {item.code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Puede seleccionar múltiples items para el préstamo
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas Adicionales</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Notas o comentarios adicionales" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <Button variant="outline" type="button">
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
