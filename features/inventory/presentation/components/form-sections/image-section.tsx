import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ImageSectionProps {
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedFiles: File[];
    imageType: 'PRIMARY' | 'SECONDARY' | 'DETAIL';
    setImageType: (type: 'PRIMARY' | 'SECONDARY' | 'DETAIL') => void;
    isPrimary: boolean;
    setIsPrimary: (isPrimary: boolean) => void;
    description: string;
    setDescription: (description: string) => void;
    photoDate: string;
    setPhotoDate: (date: string) => void;
}

export const ImageSection = ({
    onImageChange,
    selectedFiles,
    imageType,
    setImageType,
    isPrimary,
    setIsPrimary,
    description,
    setDescription,
    photoDate,
    setPhotoDate
}: ImageSectionProps) => {
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newPreviewUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviewUrls.push(reader.result as string);
                    setPreviewUrls([...newPreviewUrls]);
                };
                reader.readAsDataURL(file);
            }
        }

        onImageChange(e);
    };

    const removeImage = (index: number) => {
        const newPreviewUrls = [...previewUrls];
        newPreviewUrls.splice(index, 1);
        setPreviewUrls(newPreviewUrls);
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

                        {previewUrls.length > 0 && (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">Tipo de Imagen</label>
                                            <Select
                                                value={imageType}
                                                onValueChange={(value: 'PRIMARY' | 'SECONDARY' | 'DETAIL') => setImageType(value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione el tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PRIMARY">Principal</SelectItem>
                                                    <SelectItem value="SECONDARY">Secundaria</SelectItem>
                                                    <SelectItem value="DETAIL">Detalle</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium">Descripción</label>
                                            <Input
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Descripción de la imagen"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">Fecha de la Foto</label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={`w-full pl-3 text-left font-normal ${!photoDate && "text-muted-foreground"}`}
                                                    >
                                                        {photoDate ? (
                                                            format(new Date(photoDate), "PPP", { locale: es })
                                                        ) : (
                                                            <span>Seleccionar fecha</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={photoDate ? new Date(photoDate) : undefined}
                                                        onSelect={(date) => setPhotoDate(date?.toISOString() || '')}
                                                        disabled={(date) => date > new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="isPrimary"
                                                checked={isPrimary}
                                                onChange={(e) => setIsPrimary(e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                            <label htmlFor="isPrimary" className="text-sm font-medium">
                                                Imagen Principal
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}; 