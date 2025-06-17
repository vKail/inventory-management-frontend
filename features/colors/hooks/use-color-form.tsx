import { useRouter } from "next/navigation";
import { useColorStore } from "../context/color-store";
import { IColor, IColorResponse, IColorUpdate } from "../data/interfaces/color.interface";
import { ColorFormValues } from "../data/schemas/color.schema";

export const useColorForm = (currentColor?: Partial<IColorResponse>) => {
    const { addColor, updateColor } = useColorStore();
    const defaultValues: Partial<IColor> = {
        name: currentColor?.name || "",
        hexCode: currentColor?.hexCode || "",
        description: currentColor?.description || "",
    };

    const router = useRouter();

    const onSubmit = async (formData: ColorFormValues) => {
        if (currentColor?.id) {
            await updateColor(currentColor.id, formData as IColor);
        } else {
            await addColor(formData as IColor);
        }
        router.push("/colors");
    };

    return {
        onSubmit,
        defaultValues
    };
}