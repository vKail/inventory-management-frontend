import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface ExistingImage {
  id: number;
  filePath: string;
  isPrimary: boolean;
  type?: string | null;
  description?: string | null;
  photoDate?: string | null;
  active?: boolean;
}

export interface InventoryImageData {
  id: string;
  file: File;
  preview: string;
  description: string;
  photoDate: string;
  isPrimary: boolean;
}

interface ImageSectionProps {
  images: InventoryImageData[];
  setImages: (images: InventoryImageData[]) => void;
  existingImages?: ExistingImage[];
  onDeleteExistingImage?: (imageId: number) => void;
  mode: 'create' | 'edit';
  imagesToDelete: number[];
  setImagesToDelete: (ids: number[]) => void;
}

export const ImageSection = ({
  images,
  setImages,
  existingImages = [],
  onDeleteExistingImage,
  mode,
  imagesToDelete,
  setImagesToDelete,
}: ImageSectionProps) => {
  const [imageData, setImageData] = useState<InventoryImageData[]>(images || []);
  const [imageErrors, setImageErrors] = useState<Record<string, { description?: string; photoDate?: string }>>({});
  const MAX_IMAGES = 5;

  // Obtener la URL base para imágenes
  const API_URL = process.env.NEXT_PUBLIC_API_URLIMAGE || 'https://gitt-api-3tw6.onrender.com/';

  useEffect(() => {
    setImageData(images);
  }, [images]);

  // Validar metadatos de imágenes
  const validateImageFields = (imgs: InventoryImageData[]) => {
    const errors: Record<string, { description?: string; photoDate?: string }> = {};
    imgs.forEach(img => {
      if (!img.description || img.description.trim() === '') {
        errors[img.id] = { ...(errors[img.id] || {}), description: 'La descripción es requerida' };
      }
      if (!img.photoDate || img.photoDate.trim() === '') {
        errors[img.id] = { ...(errors[img.id] || {}), photoDate: 'La fecha es requerida' };
      }
    });
    setImageErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    if (imageData.length + newFiles.length > MAX_IMAGES) {
      toast.error(`Máximo ${MAX_IMAGES} imágenes permitidas`);
      return;
    }
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
    // Solo una imagen principal entre nuevas y existentes
    const hasPrimary = imageData.some(img => img.isPrimary) || (existingImages?.some(img => img.isPrimary) ?? false);
    const newImageData: InventoryImageData[] = validFiles.map((file, index) => ({
      id: `img-${Date.now()}-${imageData.length + index}`,
      file,
      preview: URL.createObjectURL(file),
      description: '',
      photoDate: '',
      isPrimary: !hasPrimary && index === 0,
    }));
    const updated = [...imageData, ...newImageData];
    setImageData(updated);
    setImages(updated);
    event.target.value = '';
  };

  const removeImage = (imageId: string) => {
    const imageIndex = imageData.findIndex(img => img.id === imageId);
    if (imageIndex === -1) return;
    URL.revokeObjectURL(imageData[imageIndex].preview);
    const newImageData = imageData.filter(img => img.id !== imageId);
    setImageData(newImageData);
    setImages(newImageData);
    // Limpiar errores de esa imagen
    setImageErrors(prev => {
      const copy = { ...prev };
      delete copy[imageId];
      return copy;
    });
  };

  // Solo una imagen principal entre nuevas y existentes
  const setAsPrimary = (imageId: string) => {
    const newImageData = imageData.map(img => ({ ...img, isPrimary: img.id === imageId }));
    setImageData(newImageData);
    setImages(newImageData);
  };

  const handleInputChange = (imageId: string, field: 'description' | 'photoDate', value: string) => {
    const newImageData = imageData.map(img =>
      img.id === imageId ? { ...img, [field]: value } : img
    );
    setImageData(newImageData);
    setImages(newImageData);
    // Validar campo individual
    setImageErrors(prev => ({
      ...prev,
      [imageId]: {
        ...prev[imageId],
        [field]: value.trim() === '' ? (field === 'description' ? 'La descripción es requerida' : 'La fecha es requerida') : undefined,
      },
    }));
  };

  const triggerFileInput = () => {
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) input.click();
  };

  // Validar imágenes al cambiar
  useEffect(() => {
    validateImageFields(imageData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData]);

  // Nueva función para marcar/desmarcar imágenes existentes para eliminar
  const toggleDeleteExistingImage = (imageId: number) => {
    if (imagesToDelete.includes(imageId)) {
      setImagesToDelete(imagesToDelete.filter(id => id !== imageId));
    } else {
      setImagesToDelete([...imagesToDelete, imageId]);
    }
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
                {imageData.length + (existingImages?.length || 0)}/{MAX_IMAGES} imágenes
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
            {(imageData.length + (existingImages?.length || 0)) < MAX_IMAGES && (
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
                      Arrastra imágenes aquí o{' '}
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

            {/* Existing Images Grid (solo eliminar) */}
            {mode === 'edit' && existingImages && existingImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {existingImages.map((img) => {
                  const isMarkedForDelete = imagesToDelete.includes(img.id);
                  return (
                    <Card key={img.id} className="overflow-hidden">
                      <div className="flex flex-col">
                        <div className="relative w-[180px] h-[180px] bg-muted mx-auto mt-4 mb-2 rounded-lg overflow-hidden">
                          <img
                            src={`${API_URL}${img.filePath}`}
                            alt={`Imagen ${img.id}`}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isMarkedForDelete ? 'opacity-40 grayscale' : ''}`}
                            style={{ width: '180px', height: '180px' }}
                          />
                          <div className="absolute top-2 left-2 flex gap-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${img.isPrimary ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}
                            >
                              {img.isPrimary ? 'PRINCIPAL' : 'SECUNDARIA'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleDeleteExistingImage(img.id)}
                            className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${isMarkedForDelete ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                          >
                            {isMarkedForDelete ? <span>Restaurar</span> : <X className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* New Images Grid (añadir/eliminar, marcar principal) */}
            {imageData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {imageData.map((image, index) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="flex flex-col">
                      <div className="relative w-[180px] h-[180px] bg-muted mx-auto mt-4 mb-2 rounded-lg overflow-hidden">
                        <img
                          src={image.preview}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-full object-cover"
                          style={{ width: '180px', height: '180px' }}
                        />
                        <div className="absolute top-2 left-2 flex gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${image.isPrimary ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}
                          >
                            {image.isPrimary ? 'PRINCIPAL' : 'SECUNDARIA'}
                          </span>
                          {!image.isPrimary && (
                            <Button size="sm" variant="outline" onClick={() => setAsPrimary(image.id)}>
                              Hacer principal
                            </Button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4 space-y-2">
                        <Input
                          placeholder="Descripción de la imagen"
                          value={image.description}
                          onChange={e => handleInputChange(image.id, 'description', e.target.value)}
                          className={imageErrors[image.id]?.description ? 'border-red-500' : ''}
                        />
                        {imageErrors[image.id]?.description && (
                          <p className="text-xs text-red-500 mt-1">{imageErrors[image.id]?.description}</p>
                        )}
                        {/* CAMBIO: Campo de fecha con Popover y Calendar igual a technical-section */}
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium">Fecha de la foto *</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!image.photoDate && "text-muted-foreground"} ${imageErrors[image.id]?.photoDate ? 'border-red-500' : ''}`}
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
                                onSelect={date => {
                                  if (date) {
                                    // Guardar como string yyyy-MM-dd
                                    const iso = date.toISOString().slice(0, 10);
                                    handleInputChange(image.id, 'photoDate', iso);
                                  }
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {imageErrors[image.id]?.photoDate && (
                            <p className="text-xs text-red-500 mt-1">{imageErrors[image.id]?.photoDate}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {imageData.length === 0 && (!existingImages || existingImages.length === 0) && (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No hay imágenes</h3>
                <p className="text-muted-foreground mb-4">Sube imágenes para mostrar el item</p>
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
