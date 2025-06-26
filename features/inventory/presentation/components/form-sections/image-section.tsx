import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface ImageData {
    id: string;
    file: File;
    preview: string;
    description: string;
    photoDate: string;
    isPrimary: boolean;
}

interface ImageSectionProps {
    onImageChange: (files: File[], descriptions: string[], dates: string[]) => void;
    selectedFiles: File[];
    descriptions: string[];
    setDescriptions: (descriptions: string[]) => void;
    photoDates: string[];
    setPhotoDates: (dates: string[]) => void;
}

export const ImageSection = ({
    onImageChange,
    selectedFiles,
    descriptions,
    setDescriptions,
    photoDates,
    setPhotoDates
}: ImageSectionProps) => {
    const [imageData, setImageData] = useState<ImageData[]>([]);
    const MAX_IMAGES = 5;

    // Sync with parent state
    const syncWithParent = useCallback(() => {
        const newImageData = selectedFiles.map((file, index) => ({
            id: `img-${Date.now()}-${index}`,
            file,
            preview: URL.createObjectURL(file),
            description: descriptions[index] || '',
            photoDate: photoDates[index] || '',
            isPrimary: index === 0
        }));
        setImageData(newImageData);
    }, [selectedFiles, descriptions, photoDates]);

    // Initialize on mount and when props change
    useEffect(() => {
        syncWithParent();
    }, [syncWithParent]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        // Check limit
        if (selectedFiles.length + newFiles.length > MAX_IMAGES) {
            toast.error(`Máximo ${MAX_IMAGES} imágenes permitidas`);
            return;
        }

        // Validate files
        const validFiles: File[] = [];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

        for (const file of newFiles) {
            if (!allowedTypes.includes(file.type)) {
                toast.error(`${file.name}: Formato no soportado`);
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name}: Archivo muy grande (máx 10MB)`);
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        // Create new image data
        const newImageData: ImageData[] = validFiles.map((file, index) => ({
            id: `img-${Date.now()}-${selectedFiles.length + index}`,
            file,
            preview: URL.createObjectURL(file),
            description: '',
            photoDate: '',
            isPrimary: selectedFiles.length === 0 && index === 0
        }));

        // Update state
        const updatedFiles = [...selectedFiles, ...validFiles];
        const updatedDescriptions = [...descriptions, ...Array(validFiles.length).fill('')];
        const updatedDates = [...photoDates, ...Array(validFiles.length).fill('')];

        setImageData(prev => [...prev, ...newImageData]);
        onImageChange(updatedFiles, updatedDescriptions, updatedDates);

        // Clear input
        event.target.value = '';
    };

    const removeImage = (imageId: string) => {
        const imageIndex = imageData.findIndex(img => img.id === imageId);
        if (imageIndex === -1) return;

        // Revoke object URL
        URL.revokeObjectURL(imageData[imageIndex].preview);

        // Remove from arrays
        const newFiles = selectedFiles.filter((_, i) => i !== imageIndex);
        const newDescriptions = descriptions.filter((_, i) => i !== imageIndex);
        const newDates = photoDates.filter((_, i) => i !== imageIndex);

        // Update image data
        const newImageData = imageData.filter(img => img.id !== imageId);
        setImageData(newImageData);

        // Update parent
        onImageChange(newFiles, newDescriptions, newDates);
    };

    const updateDescription = (imageId: string, value: string) => {
        const imageIndex = imageData.findIndex(img => img.id === imageId);
        if (imageIndex === -1) return;

        const newDescriptions = [...descriptions];
        newDescriptions[imageIndex] = value;
        setDescriptions(newDescriptions);

        // Update local state
        setImageData(prev => prev.map(img =>
            img.id === imageId ? { ...img, description: value } : img
        ));
    };

    const updatePhotoDate = (imageId: string, date: string) => {
        const imageIndex = imageData.findIndex(img => img.id === imageId);
        if (imageIndex === -1) return;

        const newDates = [...photoDates];
        newDates[imageIndex] = date;
        setPhotoDates(newDates);

        // Update local state
        setImageData(prev => prev.map(img =>
            img.id === imageId ? { ...img, photoDate: date } : img
        ));
    };

    const triggerFileInput = () => {
        const input = document.getElementById('image-upload') as HTMLInputElement;
        if (input) input.click();
    };

    return (
        <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                {/* Header Section */}
                <div className="lg:col-span-1 p-6 bg-muted/30 border-b lg:border-b-0 lg:border-r">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ImageIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Imágenes</h3>
                            <p className="text-sm text-muted-foreground">
                                {imageData.length}/{MAX_IMAGES} imágenes
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Sube imágenes del item. La primera será la imagen principal.
                    </p>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-3 p-6">
                    <div className="space-y-6">
                        {/* Upload Area */}
                        {imageData.length < MAX_IMAGES && (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                                <input
                                    id="image-upload"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                                <div className="space-y-4">
                                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            Arrastra imágenes aquí o{" "}
                                            <button
                                                type="button"
                                                onClick={triggerFileInput}
                                                className="text-primary hover:underline"
                                            >
                                                haz clic para seleccionar
                                            </button>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PNG, JPG, JPEG, GIF, WEBP (máx 10MB cada una)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Image Grid */}
                        {imageData.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {imageData.map((image, index) => (
                                    <Card key={image.id} className="overflow-hidden">
                                        <div className="flex flex-col">
                                            {/* Image Preview */}
                                            <div className="relative aspect-video bg-muted">
                                                <img
                                                    src={image.preview}
                                                    alt={`Imagen ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-2 left-2">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${image.isPrimary
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-500 text-white'
                                                        }`}>
                                                        {image.isPrimary ? 'PRINCIPAL' : 'SECUNDARIA'}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(image.id)}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Form Fields */}
                                            <div className="p-4 space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium block mb-2">
                                                        Descripción
                                                    </label>
                                                    <Input
                                                        value={image.description}
                                                        onChange={(e) => updateDescription(image.id, e.target.value)}
                                                        placeholder="Describe esta imagen..."
                                                        maxLength={250}
                                                        className="text-sm"
                                                    />
                                                    <div className="text-xs text-muted-foreground text-right mt-1">
                                                        {image.description.length}/250
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium block mb-2">
                                                        Fecha de la foto
                                                    </label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={`w-full justify-start text-left font-normal ${!image.photoDate && "text-muted-foreground"
                                                                    }`}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {image.photoDate ? (
                                                                    format(new Date(image.photoDate), "PPP", { locale: es })
                                                                ) : (
                                                                    "Seleccionar fecha"
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={image.photoDate ? new Date(image.photoDate) : undefined}
                                                                onSelect={(date) => updatePhotoDate(image.id, date?.toISOString() || '')}
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

                        {/* Empty State */}
                        {imageData.length === 0 && (
                            <div className="text-center py-12">
                                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">No hay imágenes</h3>
                                <p className="text-muted-foreground mb-4">
                                    Sube imágenes para mostrar el item
                                </p>
                                <Button onClick={triggerFileInput} variant="outline">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Subir primera imagen
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}; 