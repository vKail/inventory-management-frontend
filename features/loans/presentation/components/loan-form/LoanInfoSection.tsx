import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, setHours, setMinutes, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { getDefaultReturnDate } from "@/features/loans/data/utils/date-utils";

interface LoanInfoSectionProps {
    form: UseFormReturn<any>;
    userType: string;
    allowLongLoan: boolean;
    setAllowLongLoan: (value: boolean) => void;
    minDate: Date;
    maxDate: Date;
}

const LOAN_REASONS = [
    { value: "clases", label: "Clases" },
    { value: "aprendizaje_autonomo", label: "Aprendizaje Autónomo" },
    { value: "pedido_profesor", label: "Pedido de un Profesor" },
    { value: "casa_abierta", label: "Casa Abierta" },
    { value: "evento", label: "Evento" },
    { value: "otro", label: "Otro" },
];

export default function LoanInfoSection({
    form,
    userType,
    allowLongLoan,
    setAllowLongLoan,
    minDate,
    maxDate
}: LoanInfoSectionProps) {
    const [extendedDuration, setExtendedDuration] = useState(false);

    // Get default date using centralized function
    const defaultReturnDate = getDefaultReturnDate(userType);

    // Max date for extended duration: 10 days from today at 23:59 (only for teachers)
    const maxExtendedDate = setMinutes(setHours(addDays(new Date(), 10), 23), 59);

    // Only teachers can use extended duration
    const canExtendDuration = userType === "DOCENTES";

    // Set default date on mount if not already set
    useEffect(() => {
        if (!form.getValues("scheduledReturnDate")) {
            form.setValue("scheduledReturnDate", defaultReturnDate);
        }
    }, []);

    return (
        <Card data-section="loan-info">
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Left Side - Title and Description */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-sm">Información del Préstamo</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Configure los detalles del préstamo: fecha, motivo y observaciones
                        </p>
                    </div>

                    {/* Red Separator Line - Hidden on mobile */}
                    <div className="hidden md:block w-px bg-destructive/30" />
                    <div className="md:hidden h-px bg-destructive/30" />

                    {/* Right Side - Form */}
                    <div className="flex-1 space-y-3">
                        {/* Date and Extended Duration */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <FormField
                                control={form.control}
                                name="scheduledReturnDate"
                                render={({ field }) => (
                                    <FormItem className="flex-1" data-field="scheduledReturnDate">
                                        <FormLabel className="text-xs">Fecha de Devolución</FormLabel>
                                        {!extendedDuration || !canExtendDuration ? (
                                            <FormControl>
                                                <Input
                                                    value={format(field.value || defaultReturnDate, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                                                    disabled
                                                    className="h-8 text-xs bg-muted/50"
                                                />
                                            </FormControl>
                                        ) : (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "h-8 w-full pl-3 text-left font-normal text-xs",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "dd/MM/yy HH:mm", { locale: es })
                                                            ) : (
                                                                <span>Seleccionar</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < minDate || date > maxExtendedDate}
                                                        initialFocus
                                                        locale={es}
                                                    />
                                                    <div className="p-2 border-t">
                                                        <Input
                                                            type="time"
                                                            className="h-8 text-xs"
                                                            max="23:59"
                                                            value={field.value ? format(field.value, "HH:mm") : "23:59"}
                                                            onChange={(e) => {
                                                                const [hours, minutes] = e.target.value.split(":");
                                                                const newDate = new Date(field.value || new Date());
                                                                newDate.setHours(parseInt(hours), parseInt(minutes));
                                                                field.onChange(newDate);
                                                            }}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {canExtendDuration && (
                                <div className="flex items-end pb-0.5 sm:pb-0">
                                    <div className="flex items-center space-x-1.5">
                                        <Switch
                                            id="extended-duration"
                                            checked={extendedDuration}
                                            onCheckedChange={(checked) => {
                                                setExtendedDuration(checked);
                                                if (!checked) {
                                                    // Reset to default date
                                                    form.setValue("scheduledReturnDate", defaultReturnDate);
                                                }
                                            }}
                                            className="scale-75"
                                        />
                                        <Label htmlFor="extended-duration" className="text-[10px] sm:text-xs cursor-pointer whitespace-nowrap">
                                            Duración Extendida
                                        </Label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reason */}
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem data-field="reason">
                                    <FormLabel className="text-xs">Motivo del Préstamo</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="Seleccione un motivo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {LOAN_REASONS.map((reason) => (
                                                <SelectItem key={reason.value} value={reason.value} className="text-xs">
                                                    {reason.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Notes */}
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Notas Adicionales (Opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Comentarios adicionales (opcional)"
                                            {...field}
                                            rows={1}
                                            maxLength={75}
                                            className="text-xs resize-none h-8 min-h-8"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
