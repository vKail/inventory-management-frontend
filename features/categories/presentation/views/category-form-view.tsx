'use client';

import { useEffect, useState } from 'react';
import { useCategoryStore } from '@/features/categories/context/category-store';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ICategory } from '@/features/categories/data/interfaces/category.interface';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Tags } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoryForm({ params }: { params: { id?: string } }) {
  const router = useRouter();
  const isEdit = params.id !== undefined && params.id !== 'new';

  const {
    getCategoryById,
    getCategories,
    addCategory,
    updateCategory,
    loading,
    categories
  } = useCategoryStore();

  const [formData, setFormData] = useState<Omit<ICategory, 'id' | 'active'>>({
    code: '',
    name: '',
    description: '',
    parentCategoryId: null,
    standardUsefulLife: 0,
    depreciationPercentage: '0.00'
  });

  useEffect(() => {
    const loadData = async () => {
      await getCategories();
      if (isEdit && params.id) {
        const category = await getCategoryById(Number(params.id));
        if (category) {
          setFormData({
            code: category.code,
            name: category.name,
            description: category.description,
            parentCategoryId: category.parentCategoryId,
            standardUsefulLife: category.standardUsefulLife,
            depreciationPercentage: category.depreciationPercentage
          });
        }
      }
    };
    loadData();
  }, [isEdit, params.id, getCategories, getCategoryById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleParentCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      parentCategoryId: value === "none" ? null : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && params.id) {
        await updateCategory(Number(params.id), formData);
        toast.success('Categoría actualizada exitosamente');
      } else {
        await addCategory(formData as ICategory);
        toast.success('Categoría creada exitosamente');
      }
      router.push('/categories');
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      toast.error('Error al guardar la categoría');
    }
  };

  return (
    <div className="space-y-6 w-[1200px] mx-auto">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <span className="text-muted-foreground font-medium">Configuración</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Tags className="inline mr-1 h-4 w-4 text-primary align-middle" />
            <BreadcrumbLink href="/categories">Categorías</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{isEdit ? "Editar Categoría" : "Nueva Categoría"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-8 w-full">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-1">Detalles</h3>
            <p className="text-muted-foreground text-sm">
              Información general de la categoría, como nombre, código, descripción y jerarquía.
            </p>
          </div>
          <div className="md:w-2/3">
            <Card>
              <CardHeader className="px-4 md:px-8">
                <CardTitle>{isEdit ? "Editar Categoría" : "Nueva Categoría"}</CardTitle>
                <CardDescription>
                  {isEdit
                    ? "Modifica los datos de la categoría"
                    : "Complete los datos para crear una nueva categoría"}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 md:px-8 pb-6 space-y-4">
                <div>
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="parentCategory">Categoría Padre</Label>
                  <Select
                    value={formData.parentCategoryId?.toString() || "none"}
                    onValueChange={handleParentCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoría padre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguna</SelectItem>
                      {categories
                        .filter(cat => cat.id !== Number(params.id))
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-x-8 gap-y-8 w-full mt-6">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-1">Depreciación</h3>
            <p className="text-muted-foreground text-sm">
              Detalles sobre la vida útil y porcentaje de depreciación.
            </p>
          </div>
          <div className="md:w-2/3">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="standardUsefulLife">Vida útil estándar (años)</Label>
                  <Input
                    id="standardUsefulLife"
                    name="standardUsefulLife"
                    type="number"
                    value={formData.standardUsefulLife}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="depreciationPercentage">Porcentaje de depreciación</Label>
                  <Input
                    id="depreciationPercentage"
                    name="depreciationPercentage"
                    value={formData.depreciationPercentage}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/categories')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
