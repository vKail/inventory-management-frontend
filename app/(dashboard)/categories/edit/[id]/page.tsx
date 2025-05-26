"use client";

import { CategoryForm } from "@/features/categories/presentation/components/category-form";
import { useCategoryStore } from "@/features/categories/context/category-store";
import { useRouter } from "next/navigation";
import { CategoryFormValues } from "@/features/categories/data/schemas/category.schema";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ICategory } from "@/features/categories/data/interfaces/category.interface";

type PageProps = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function CategoryEditPage({ params }: PageProps) {
  const router = useRouter();
  const { updateCategory, getCategoryById, loading } = useCategoryStore();
  const [category, setCategory] = useState<ICategory | undefined>(undefined);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const data = await getCategoryById(Number(params.id));
        if (data) {
          setCategory(data);
        } else {
          toast.error("No se encontró la categoría");
          router.push("/categories");
        }
      } catch (error) {
        console.error("Error loading category:", error);
        toast.error("Error al cargar la categoría");
        router.push("/categories");
      }
    };

    loadCategory();
  }, [getCategoryById, params.id, router]);

  const handleSubmit = async (data: CategoryFormValues) => {
    try {
      await updateCategory(Number(params.id), data);
      toast.success("Categoría actualizada exitosamente");
      router.push("/categories");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error al actualizar la categoría");
    }
  };

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-center h-32">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <CategoryForm
        initialData={category}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
}