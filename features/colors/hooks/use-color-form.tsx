import { useRouter } from "next/navigation";
import { useColorStore } from "../context/color-store";
import { IColor, IColorResponse, IColorUpdate } from "../data/interfaces/color.interface";

export const useColorForm = (currentColor?: Partial<IColorResponse>) => {
    const { addColor, updateColor } = useColorStore();
    const defaultValues: Partial<IColor> = {
        name: currentColor?.name || "",
        hexCode: currentColor?.hexCode || "",
        description: currentColor?.description || "",
    };

    const router = useRouter();

    const onSubmit = async (color: IColor) => {
        if (currentColor?.id) {
            console.log("Submitting color:", color, currentColor.id);

            await updateColor(currentColor.id, color);
        } else {

            console.log("Adding new color:", color);
            await addColor(color);
        }

        router.push("/colors");
    };

    return {
        onSubmit,
        defaultValues
    };
}