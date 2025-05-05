"use client";

import { RegisterForm } from "../components/register-form";
import { Card } from "@/components/ui/card";

export const RegisterView = () => {
  return (
    <div className="px-8 py-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Registro de Bien</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Complete todos los campos para registrar el bien en el inventario.
        </p>
        
        <RegisterForm />
      </Card>
    </div>
  );
};