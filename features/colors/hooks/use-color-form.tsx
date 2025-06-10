import { useRouter } from "next/navigation";
import { useColorStore } from "../context/color-store";
import { IColor, IColorResponse, IColorUpdate } from "../data/interfaces/color.interface";

// This hook is used to manage the color form, allowing for both adding and updating colors.
// It provides a unified interface for handling form submissions and default values based on the current color state.

export const useColorForm = (currentColor?: Partial<IColorResponse>) => {
    const { addColor, updateColor } = useColorStore();
    // Default values for the form fields, using the current color if available.
    const defaultValues: Partial<IColor> = {
        name: currentColor?.name || "",
        hexCode: currentColor?.hexCode || "",
        description: currentColor?.description || "",
    };

    const router = useRouter();

    // This function handles the form submission, either adding a new color or updating an existing one.
    const onSubmit = async (color: IColor) => {
        if (currentColor?.id) {

            // If currentColor has an id, it means we are updating an existing color.
            await updateColor(currentColor.id, color);
        } else {

            // If currentColor does not have an id, we are adding a new color.
            await addColor(color);
        }

        // After the operation, redirect to the colors page.
        router.push("/colors");
    };

    // Return the onSubmit function and default values for use in the form.
    return {
        onSubmit,
        defaultValues
    };
}