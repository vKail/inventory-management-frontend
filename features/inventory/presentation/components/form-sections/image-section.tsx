"use client";

import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "../image-upload";
import { UseFormReturn } from "react-hook-form";

interface ImageSectionProps {
    form: UseFormReturn<any>;
}

export const ImageSection = ({ form }: ImageSectionProps) => {
    return (
        <Card>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 p-6 border-r">
                    <h3 className="text-lg font-semibold mb-2">Imagen del Producto</h3>
                    <p className="text-sm text-muted-foreground">
                        Fotografía o imagen representativa del producto para su identificación visual.
                        La imagen se subirá después de crear el producto.
                    </p>
                </div>
                <div className="col-span-8 p-6">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={form.formState.isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </Card>
    );
}; 