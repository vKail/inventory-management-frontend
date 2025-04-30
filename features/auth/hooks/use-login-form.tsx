import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/features/users/data/enums/user-roles.enums";

type LoginFormValues = {
  email: string;
  password: string;
};

export const useLogin = (role: UserRole) => {
  const router = useRouter();
  
  const onSubmit = useCallback(
    (data: LoginFormValues) => {
      // En una aplicación real, aquí haríamos la autenticación con los datos del formulario
      // Por ahora simplemente simularemos un inicio de sesión exitoso
      console.log("Login attempt with:", data);
      
      // Guardar el rol en localStorage
      localStorage.setItem("userRole", role);
      
      // Redireccionar al inventario
      router.push("/inventory");
    },
    [router, role]
  );
  
  return { onSubmit };
};