"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RegisterForm } from "@/features/inventory/presentation/components/register-form";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import Loader from "@/shared/components/ui/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
import { toast } from "sonner";

export default function EditInventoryPage() {
    const params = useParams();
    const router = useRouter();
    const { getInventoryItemById, selectedItem } = useInventoryStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const id = Number(params.id);
                if (isNaN(id)) {
                    throw new Error("ID inválido");
                }

                await getInventoryItemById(id);
                setLoading(false);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Error al cargar el producto";
                setError(message);
                toast.error(message);
                setLoading(false);
            }
        };

        fetchItem();
    }, [params.id, getInventoryItemById]);

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error || !selectedItem) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-medium mb-2">Error</p>
                    <p className="text-muted-foreground">{error || "Producto no encontrado"}</p>
                    <Button onClick={handleBack} variant="outline" className="mt-4">
                        Volver
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                <h1 className="text-2xl font-bold">Editar Producto</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información del Producto</CardTitle>
                </CardHeader>
                <CardContent>
                    <RegisterForm initialData={selectedItem} isEditing={true} />
                </CardContent>
            </Card>
        </div>
    );
} 