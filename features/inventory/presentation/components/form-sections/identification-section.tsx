"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scan } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface IdentificationSectionProps {
    form: UseFormReturn<any>;
    onScanClick: () => void;
}

export const IdentificationSection = ({ form, onScanClick }: IdentificationSectionProps) => {
    return (
        <Card>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 p-6 border-r">
                    <h3 className="text-lg font-semibold mb-2">Identificación y Códigos</h3>
                    <p className="text-sm text-muted-foreground">
                        Información básica para identificar y rastrear el producto en el inventario.
                    </p>
                </div>
                <div className="col-span-8 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Código de Barras</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Escanee o ingrese el código"
                                                    className="font-mono"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                onClick={onScanClick}
                                            >
                                                <Scan className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Identificador</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Ej: LAP-001" />
                                    </FormControl>
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
                                        <Input {...field} placeholder="Código anterior si existe" />
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