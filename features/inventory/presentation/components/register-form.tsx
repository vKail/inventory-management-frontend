"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema, registerSchema } from "@/features/inventory/data/schemas/register-schema";
import { RegisterService } from "@/features/inventory/services/register-service";
import { toast } from "sonner";
import { RegisterFormFields } from "./register-form-fields";
import { RegisterFormActions } from "./register-form-actions";
import { Form } from "@/components/ui/form";

export const RegisterForm = () => {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      // Valores por defecto si es necesario
    },
  });

  const onSubmit = async (data: RegisterFormSchema) => {
    try {
      const success = await RegisterService.registerItem(data);
      if (success) {
        toast.success("✅ Envío correcto de los datos");
        form.reset();
      } else {
        toast.error("Error al registrar el bien");
      }
    } catch (error) {
      toast.error("Error inesperado al registrar");
    }
  };

  const handleCancel = () => {
    form.reset();
    // Opcional: redirigir o cerrar modal
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RegisterFormFields control={form.control} />
        <RegisterFormActions
          isSubmitting={form.formState.isSubmitting}
          onCancel={handleCancel}
        />
      </form>
    </Form>
  );
};