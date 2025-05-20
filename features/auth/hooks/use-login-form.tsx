import { useRouter } from "next/navigation";
import { UserRole } from "@/features/users/data/enums/user-roles.enums";
import { ILogin } from "../data/interfaces/login.interface";
import { useAuthStore } from "../context/auth-store";


export const useAuth = () => {
  const { login } = useAuthStore()
  const router = useRouter();

  const onSubmit = async (user: ILogin) => {
    await login(user)
    router.push("/inventory");
  }
  return { onSubmit };
};