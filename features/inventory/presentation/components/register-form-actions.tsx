"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
    <div className="flex justify-end gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registrando..." : "Registrar Bien"}
      </Button>
    </div>
  );
};