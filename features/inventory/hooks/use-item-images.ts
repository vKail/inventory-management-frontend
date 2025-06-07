import { create } from "zustand";

interface ItemImage {
    id: number;
    itemId: number;
    url: string;
    type: "PRIMARY" | "SECONDARY" | "DETAIL";
    isPrimary: boolean;
    description?: string;
    photoDate?: string;
}

interface ItemImagesStore {
    images: ItemImage[];
    loading: boolean;
    error: string | null;
    uploadImage: (
        itemId: number,
        file: File,
        type?: "PRIMARY" | "SECONDARY" | "DETAIL",
        isPrimary?: boolean,
        description?: string,
        photoDate?: string
    ) => Promise<void>;
    getItemImages: (itemId: number) => Promise<void>;
    deleteImage: (imageId: number) => Promise<void>;
}

export const useItemImages = create<ItemImagesStore>((set) => ({
    images: [],
    loading: false,
    error: null,

    uploadImage: async (
        itemId,
        file,
        type = "PRIMARY",
        isPrimary = true,
        description = "Imagen principal del producto",
        photoDate = new Date().toISOString().split('T')[0]
    ) => {
        try {
            set({ loading: true, error: null });
            const formData = new FormData();
            formData.append("itemId", itemId.toString());
            formData.append("file", file);
            formData.append("type", type);
            formData.append("isPrimary", isPrimary.toString());
            formData.append("description", description);
            formData.append("photoDate", photoDate);

            const response = await fetch("/api/item-images/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al subir la imagen");
            }

            const newImage = await response.json();
            set((state) => ({
                images: [...state.images, newImage],
            }));
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "Error desconocido" });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    getItemImages: async (itemId) => {
        try {
            set({ loading: true, error: null });
            const response = await fetch(`/api/item-images/${itemId}`);
            if (!response.ok) {
                throw new Error("Error al obtener las imágenes");
            }
            const data = await response.json();
            set({ images: data });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "Error desconocido" });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    deleteImage: async (imageId) => {
        try {
            set({ loading: true, error: null });
            const response = await fetch(`/api/item-images/${imageId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la imagen");
            }

            set((state) => ({
                images: state.images.filter((image) => image.id !== imageId),
            }));
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "Error desconocido" });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
})); 