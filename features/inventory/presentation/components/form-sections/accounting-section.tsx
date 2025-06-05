"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface AccountingSectionProps {
    form: UseFormReturn<any>;
}

export const AccountingSection = ({ form }: AccountingSectionProps) => {
    return (
        <Card>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 p-6 border-r">
                    <h3 className="text-lg font-semibold mb-2">Información Contable</h3>
                    <p className="text-sm text-muted-foreground">
                        Detalles contables y observaciones del item.
                    </p>
                </div>
                <div className="col-span-8 p-6">
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
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            placeholder="Ej: 1"
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
                                        <Input {...field} placeholder="Ej: 1.2.3.4.5" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="observations"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Observaciones</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Observaciones adicionales..."
                                            className="resize-none"
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