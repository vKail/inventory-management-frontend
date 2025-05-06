// features/inventory/hooks/use-navigate-to-add-product.ts
import { useRouter } from "next/navigation";

export const useNavigateToAddProduct = () => {
  const router = useRouter();

  const navigateToAddProduct = () => {
    router.push("/inventory/add-product");
  };

  return { navigateToAddProduct };
};