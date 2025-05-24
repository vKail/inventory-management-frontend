'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '@/features/categories/data/schemas/category.schema';
import { useCategoryStore } from '@/features/categories/context/category-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ICategory } from '../../data/interfaces/category.interface';

type CategoryFormValues = {
  code: string;
  name: string;
  description: string;
  parentCategoryId: number | null;
  standardUsefulLife: number;
  depreciationPercentage: string;
  active: boolean;
};

export default function CategoryForm() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id ? Number(params.id) : undefined;
  const isEdit = !!categoryId;

  const { getCategoryById, getCategories, updateCategory } = useCategoryStore();
  const [parentCategories, setParentCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      parentCategoryId: null,
      standardUsefulLife: 0,
      depreciationPercentage: '0.00',
      active: true
    }
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Cargar categorías padre
        const categoriesResponse = await getCategories(1, 100);
        if (categoriesResponse) {
          const parents = categoriesResponse.records.filter(cat => !cat.parentCategoryId);
          setParentCategories(parents);
        }

        // 2. Si es edición, cargar los datos de la categoría
        if (isEdit && categoryId) {
          const category = await getCategoryById(categoryId);
          console.log('Category loaded:', category);
          if (category) {
            // Esperar a que el formulario esté listo antes de resetear
            await form.reset({
              code: category.code,
              name: category.name,
              description: category.description,
              parentCategoryId: category.parentCategoryId,
              standardUsefulLife: category.standardUsefulLife,
              depreciationPercentage: category.depreciationPercentage,
              active: category.active
            });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isEdit, categoryId, form, getCategories, getCategoryById]);

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    try {
      if (isEdit && categoryId) {
        await updateCategory(categoryId, data);
        router.push('/categories');
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[300px]">Cargando...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección Detalles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalles de la categoría</CardTitle>
            <CardDescription>
              Información básica de la categoría
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Campo Código */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: CAT001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Nombre */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la categoría" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la categoría"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría Padre</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? null : Number(value))
                    }
                    value={field.value === null ? "none" : String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una categoría padre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Ninguna</SelectItem>
                      {parentCategories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
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

        {/* Sección Depreciación */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Depreciación</CardTitle>
            <CardDescription>
              Configuración de vida útil y porcentaje de depreciación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="standardUsefulLife"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vida Útil (años)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="depreciationPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciación (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        max={100}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.push('/categories')}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>
            Actualizar
          </Button>
        </div>
      </form>
    </Form>
  );
}