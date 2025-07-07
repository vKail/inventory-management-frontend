"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categorySchema, CategoryFormValues } from '../../data/schemas/category.schema';
import { ICategory } from '../../data/interfaces/category.interface';
import { useEffect } from "react";
import { useCategoryStore } from "../../context/category-store";

interface CategoryFormProps {
  initialData?: ICategory;
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  isLoading: boolean;
}

export function CategoryForm({ initialData, onSubmit, isLoading }: CategoryFormProps) {
  const router = useRouter();
  const { categories, getCategories } = useCategoryStore();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      parentCategoryId: null,
      standardUsefulLife: 0,
      depreciationPercentage: "0.00",
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      await getCategories();
    };
    loadCategories();
  }, [getCategories]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        code: initialData.code,
        name: initialData.name,
        description: initialData.description,
        parentCategoryId: initialData.parentCategoryId,
        standardUsefulLife: initialData.standardUsefulLife,
        depreciationPercentage: initialData.depreciationPercentage,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: CategoryFormValues) => {
    try {
      // Normalize depreciationPercentage: convert comma to dot for backend
      const normalizedData = {
        ...data,
        depreciationPercentage: data.depreciationPercentage.replace(',', '.')
      };

      await onSubmit(normalizedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-8 w-full">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-1">Detalles</h3>
            <p className="text-muted-foreground text-sm">
              Información general de la categoría, como nombre, código, descripción y jerarquía.
            </p>
          </div>
          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>{initialData ? "Editar Categoría" : "Nueva Categoría"}</CardTitle>
                <CardDescription>
                  {initialData
                    ? "Modifica los datos de la categoría"
                    : "Complete los datos para crear una nueva categoría"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Código de la categoría"
                          maxLength={10}
                          codeOnly={true}
                          {...field}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.length || 0}/10 caracteres
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre de la categoría"
                          maxLength={25}
                          textOnly={true}
                          shouldAutoCapitalize={true}
                          {...field}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.length || 0}/25 caracteres
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descripción de la categoría"
                          maxLength={250}
                          descriptionOnly={true}
                          shouldAutoCapitalize={true}
                          {...field}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.length || 0}/250 caracteres
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría Padre (Opcional)</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? null : Number(value))
                        }
                        value={field.value?.toString() || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una categoría padre (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No Aplica</SelectItem>
                          {categories
                            .filter((cat) => cat.id !== initialData?.id)
                            .map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-x-8 gap-y-8 w-full">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-1">Depreciación</h3>
            <p className="text-muted-foreground text-sm">
              Detalles sobre la vida útil y porcentaje de depreciación.
            </p>
          </div>
          <div className="md:w-2/3">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <FormField
                  control={form.control}
                  name="standardUsefulLife"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vida útil estándar (años) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ingrese la vida útil en años"
                          min="0"
                          max="50"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 50) {
                              field.onChange(50);
                            } else {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground">
                        Máximo 50 años
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depreciationPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje de depreciación *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: 0.15 o 0,25"
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Allow only numbers, dots, and commas
                            value = value.replace(/[^0-9.,]/g, '');

                            // Ensure only one decimal separator
                            const dotCount = (value.match(/\./g) || []).length;
                            const commaCount = (value.match(/,/g) || []).length;

                            if (dotCount > 1 || commaCount > 1) {
                              // Keep only the first decimal separator
                              const firstDot = value.indexOf('.');
                              const firstComma = value.indexOf(',');

                              if (firstDot !== -1 && firstComma !== -1) {
                                // Both separators present, keep the first one
                                if (firstDot < firstComma) {
                                  value = value.replace(/,/g, '');
                                } else {
                                  value = value.replace(/\./g, '');
                                }
                              } else if (dotCount > 1) {
                                // Multiple dots, keep only the first
                                const parts = value.split('.');
                                value = parts[0] + '.' + parts.slice(1).join('');
                              } else if (commaCount > 1) {
                                // Multiple commas, keep only the first
                                const parts = value.split(',');
                                value = parts[0] + ',' + parts.slice(1).join('');
                              }
                            }

                            // Limit to 2 decimal places
                            const decimalSeparator = value.includes('.') ? '.' : ',';
                            if (decimalSeparator) {
                              const parts = value.split(decimalSeparator);
                              if (parts[1] && parts[1].length > 2) {
                                parts[1] = parts[1].substring(0, 2);
                                value = parts.join(decimalSeparator);
                              }
                            }

                            // Limit the whole number part to prevent values over 1
                            const parts = value.split(/[.,]/);
                            if (parts[0] && parseInt(parts[0]) > 1) {
                              value = '1' + (parts[1] ? decimalSeparator + parts[1] : '');
                            }

                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground">
                        Valor entre 0 y 1 con máximo 2 decimales (ej: 0.15, 0,25, 1.00)
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/categories')}
                    className="cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading} className="cursor-pointer">
                    {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}