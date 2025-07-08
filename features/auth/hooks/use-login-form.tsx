import { useRouter } from "next/navigation";
import { UserRole } from "@/features/users/data/enums/user-roles.enums";
import { ILogin } from "../data/interfaces/login.interface";
import { useAuthStore } from "../context/auth-store";
import { toast } from "sonner";

export const useAuth = () => {
  const { login } = useAuthStore()
  const router = useRouter();

  const onSubmit = async (user: ILogin) => {
    try {
      await login(user);

      // Add a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if authentication was successful
      const authStore = useAuthStore.getState();

      if (authStore.isAuthenticated && authStore.token) {
        toast.success('Inicio de sesión exitoso');

        // Try Next.js router first
        try {
          router.push("/inventory");
          router.refresh();

          // Fallback: if router doesn't work after 2 seconds, use window.location
          setTimeout(() => {
            if (window.location.pathname !== '/inventory') {
              window.location.href = '/inventory';
            }
          }, 2000);
        } catch (routerError) {
          console.error('Router error:', routerError);
          window.location.href = '/inventory';
        }
      } else {
        console.error('Authentication failed - no token or user data');
        toast.error('Error en la autenticación. Por favor, intente nuevamente.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión. Por favor, intente nuevamente.');
    }
  }

  return { onSubmit };
};