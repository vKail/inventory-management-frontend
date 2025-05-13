// /features/inventory/components/register-form-actions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface RegisterFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const RegisterFormActions = ({
  isSubmitting,
  onCancel,
}: RegisterFormActionsProps) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <span className="text-muted-foreground font-medium">Operaciones</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/inventory">Inventario</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{"Nuevo Bien"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onCancel();
            router.push("/inventory");
          }}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrar Bien"}
        </Button>
      </div>
    </div>
  );
};