import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface ImageSectionProps {
    onImageChange: (files: File[], descriptions: string[], dates: string[]) => void;
    selectedFiles: File[];
    descriptions: string[];
    setDescriptions: (descriptions: string[]) => void;
    photoDates: string[];
    setPhotoDates: (dates: string[]) => void;
}

interface ImageItem {
    id: string;
    file: File;
    url: string;
    description: string;
    photoDate: string;
    isPrimary: boolean;
}

export const ImageSection = ({
    onImageChange,
    selectedFiles,
    descriptions,
    setDescriptions,
    photoDates,
    setPhotoDates
}: ImageSectionProps) => {
    const [images, setImages] = useState<ImageItem[]>([]);
    const MAX_IMAGES = 5;

    // Initialize images from props
    useEffect(() => {
        const imageItems = selectedFiles.map((file, index) => ({
            id: `${file.name}-${index}`,
            file,
            url: URL.createObjectURL(file),
            description: descriptions[index] || '',
            photoDate: photoDates[index] || '',
            isPrimary: index === 0
        }));
        setImages(imageItems);

        // Cleanup URLs when component unmounts or images change
        return () => {
            imageItems.forEach(item => URL.revokeObjectURL(item.url));
        };
    }, [selectedFiles, descriptions, photoDates]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);

        // Check if adding these files would exceed the limit
        if (selectedFiles.length + newFiles.length > MAX_IMAGES) {
            toast.error(`Puedes subir máximo ${MAX_IMAGES} imágenes`);
            return;
        }

        // Validate file types
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const validFiles = newFiles.filter(file => {
            if (!allowedTypes.includes(file.type)) {
                toast.error(`El archivo ${file.name} no es una imagen válida. Solo se permiten: PNG, JPG, JPEG, GIF, WEBP`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`El archivo ${file.name} excede el límite de 10MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Add new files to existing ones
        const updatedFiles = [...selectedFiles, ...validFiles];
        const updatedDescriptions = [...descriptions, ...Array(validFiles.length).fill('')];
        const updatedDates = [...photoDates, ...Array(validFiles.length).fill('')];

        onImageChange(updatedFiles, updatedDescriptions, updatedDates);
    };

    const removeImage = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newDescriptions = descriptions.filter((_, i) => i !== index);
        const newDates = photoDates.filter((_, i) => i !== index);

        onImageChange(newFiles, newDescriptions, newDates);
    };

    const updateDescription = (index: number, value: string) => {
        const newDescriptions = [...descriptions];
        newDescriptions[index] = value;
        setDescriptions(newDescriptions);
    };

    const updatePhotoDate = (index: number, date: string) => {
        const newDates = [...photoDates];
        newDates[index] = date;
        setPhotoDates(newDates);
    };

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 p-6 border-r">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Imágenes</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Sube imágenes del item y configura sus propiedades.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Máximo {MAX_IMAGES} imágenes. La primera será la imagen principal.
                    </p>
                </div>
                <div className="md:col-span-3 p-6">
                    <div className="space-y-6">
                        {/* Upload Area */}
                        {selectedFiles.length < MAX_IMAGES && (
                            <div className="flex items-center justify-center w-full">
                                <div className="relative w-full">
                                    <label
                                        htmlFor="images"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-6 h-6 mb-2 text-gray-500" />
                                            <p className="text-sm text-gray-500">
                                                <span className="font-semibold">Haga clic para subir</span> o arrastre y suelte
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG, JPEG, GIF, WEBP (MAX. 10MB)</p>
                                        </div>
                                        <Input
                                            id="images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="absolute bottom-2 right-2 z-10"
                                        onClick={() => document.getElementById('images')?.click()}
                                    >
                                        Subir Imagen
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Image Cards */}
                        {images.length > 0 && (
                            <div className="space-y-4">
                                {images.map((image, index) => (
                                    <Card key={image.id} className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Image Side */}
                                            <div className="relative group">
                                                <img
                                                    src={image.url}
                                                    alt={`Imagen ${index + 1}`}
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                    {image.isPrimary ? 'PRINCIPAL' : 'SECUNDARIA'}
                                                </div>
                                            </div>

                                            {/* Form Side */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium">Descripción</label>
                                                    <Input
                                                        value={image.description}
                                                        onChange={(e) => updateDescription(index, e.target.value)}
                                                        placeholder="Descripción de la imagen"
                                                        maxLength={250}
                                                    />
                                                    <div className="text-xs text-muted-foreground text-right">
                                                        {image.description.length}/250 caracteres
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Fecha de la Foto</label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={`w-full pl-3 text-left font-normal ${!image.photoDate && "text-muted-foreground"}`}
                                                            >
                                                                {image.photoDate ? (
                                                                    format(new Date(image.photoDate), "PPP", { locale: es })
                                                                ) : (
                                                                    <span>Seleccionar fecha</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={image.photoDate ? new Date(image.photoDate) : undefined}
                                                                onSelect={(date) => updatePhotoDate(index, date?.toISOString() || '')}
                                                                disabled={(date) => date > new Date()}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* No Images State */}
                        {images.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No hay imágenes seleccionadas</p>
                                <p className="text-sm">Sube hasta {MAX_IMAGES} imágenes para este item</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}; 