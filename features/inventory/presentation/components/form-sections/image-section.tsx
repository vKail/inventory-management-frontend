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

interface ImageSectionProps {
    onImageChange: (files: File[], descriptions: string[], dates: string[]) => void;
    selectedFiles: File[];
    descriptions: string[];
    setDescriptions: (descriptions: string[]) => void;
    photoDates: string[];
    setPhotoDates: (dates: string[]) => void;
}

interface ImagePreview {
    url: string;
    file: File;
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
    const [previews, setPreviews] = useState<ImagePreview[]>([]);

    // Actualizar previews cuando cambian los archivos seleccionados
    useEffect(() => {
        const newPreviews = selectedFiles.map((file, index) => ({
            url: URL.createObjectURL(file),
            file,
            description: descriptions[index] || '',
            photoDate: photoDates[index] || '',
            isPrimary: index === 0 // La primera imagen es siempre PRIMARY
        }));
        setPreviews(newPreviews);

        // Limpiar URLs de objetos cuando cambian los archivos
        return () => {
            newPreviews.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, [selectedFiles, descriptions, photoDates]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const newDescriptions = [...descriptions, ...Array(newFiles.length).fill('')];
        const newDates = [...photoDates, ...Array(newFiles.length).fill('')];

        onImageChange([...selectedFiles, ...newFiles], newDescriptions, newDates);
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
                </div>
                <div className="md:col-span-3 p-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="images"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Haga clic para subir</span> o arrastre y suelte
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG o GIF (MAX. 10MB)</p>
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
                        </div>

                        {previews.length > 0 && (
                            <div className="space-y-8">
                                {previews.map((preview, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <img
                                                src={preview.url}
                                                alt={`Preview ${index + 1}`}
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
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                                                {index === 0 ? 'PRIMARY' : 'SECONDARY'}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium">Descripción</label>
                                                <Input
                                                    value={preview.description}
                                                    onChange={(e) => updateDescription(index, e.target.value)}
                                                    placeholder="Descripción de la imagen"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Fecha de la Foto</label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={`w-full pl-3 text-left font-normal ${!preview.photoDate && "text-muted-foreground"}`}
                                                        >
                                                            {preview.photoDate ? (
                                                                format(new Date(preview.photoDate), "PPP", { locale: es })
                                                            ) : (
                                                                <span>Seleccionar fecha</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={preview.photoDate ? new Date(preview.photoDate) : undefined}
                                                            onSelect={(date) => updatePhotoDate(index, date?.toISOString() || '')}
                                                            disabled={(date) => date > new Date()}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}; 