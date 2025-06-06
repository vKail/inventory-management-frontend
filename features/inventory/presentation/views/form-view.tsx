"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useInventoryStore } from "../../context/inventory-store";
import { RegisterForm } from "../components/register-form";
import LoaderComponent from "@/shared/components/ui/Loader";

interface FormViewProps {
    id?: number;
}

export const FormView = ({ id }: FormViewProps) => {
    const router = useRouter();
    const { selectedItem: item, loading, getInventoryItems } = useInventoryStore();

    useEffect(() => {
        if (id) {
            getInventoryItems(id);
        }
    }, [getInventoryItems, id]);

    if (id && loading) {
        return <LoaderComponent rows={5} columns={2} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.push("/inventory")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">
                    {id ? "Editar Producto" : "Nuevo Producto"}
                </h2>
            </div>

            <RegisterForm initialData={item} isEditing={!!id} />
        </div>
    );
}; 