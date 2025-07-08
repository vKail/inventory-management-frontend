import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ItemColor } from "../../../data/interfaces/inventory.interface";
import { IColor } from "@/features/colors/data/interfaces/color.interface";
import { useColorStore } from "@/features/colors/context/color-store";
import { Switch } from "@/components/ui/switch";

interface ColorsSectionProps {
    selectedColors: ItemColor[];
    onColorsChange: (colors: ItemColor[]) => void;
    mode: 'create' | 'edit';
    error?: string;
}

export const ColorsSection = ({ selectedColors, onColorsChange, mode, error }: ColorsSectionProps) => {
    const { allColors, getAllColors, loading } = useColorStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredColors, setFilteredColors] = useState<IColor[]>([]);

    // Cargar todos los colores al inicio con allRecords=true
    useEffect(() => {
        const loadAllColors = async () => {
            try {
                console.log('🔄 Loading all colors with getAllColors...');
                await getAllColors();
            } catch (error) {
                console.error('❌ Error loading colors:', error);
            }
        };
        loadAllColors();
    }, []); // Solo se ejecuta una vez al montar

    // Función para actualizar los colores filtrados (disponibles)
    const updateFilteredColors = (
        colors: IColor[],
        selected: ItemColor[],
        search: string
    ) => {
        // Los disponibles son todos los del catálogo menos los seleccionados
        const filtered = colors.filter(color => {
            const matchesSearch = color.name.toLowerCase().includes(search.toLowerCase());
            const isNotSelected = !selected.some(selected => selected.colorId === color.id);
            return matchesSearch && isNotSelected;
        });
        setFilteredColors(filtered);
        console.log('🎨 ColorsSection - Filtered colors available:', filtered.length);
    };

    // Actualizar colores filtrados cuando cambia la búsqueda o los colores seleccionados
    useEffect(() => {
        console.log('🎨 ColorsSection - Updating filtered colors:', {
            totalColors: allColors.length,
            selectedColors: selectedColors.length,
            searchTerm
        });
        updateFilteredColors(allColors, selectedColors, searchTerm);
    }, [searchTerm, selectedColors, allColors]);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const { source, destination } = result;

        // Si el drag es desde la lista de colores disponibles
        if (source.droppableId === 'available-colors') {
            const color = filteredColors[source.index];

            // Verificar si el color ya está seleccionado
            const isAlreadySelected = selectedColors.some(
                selected => selected.colorId === color.id
            );

            if (isAlreadySelected) {
                return; // No hacer nada si ya está seleccionado
            }

            const newColor: ItemColor = {
                id: Date.now() + Math.random(), // Generar ID único temporal
                itemId: 0, // Se asignará al crear el item
                colorId: color.id,
                isMainColor: false,
                color: color
            };
            onColorsChange([...selectedColors, newColor]);
        }
        // Si el drag es dentro de los colores seleccionados
        else if (source.droppableId === 'selected-colors') {
            const reorderedColors = Array.from(selectedColors);
            const [removed] = reorderedColors.splice(source.index, 1);
            reorderedColors.splice(destination.index, 0, removed);
            onColorsChange(reorderedColors);
        }
    };

    const handleMainColorChange = (index: number, isMain: boolean) => {
        const newColors = [...selectedColors];

        // Si se está marcando como principal, desmarcar cualquier otro principal
        if (isMain) {
            newColors.forEach((color, i) => {
                if (i !== index) {
                    color.isMainColor = false;
                }
            });
        }

        newColors[index] = {
            ...newColors[index],
            isMainColor: isMain
        };
        onColorsChange(newColors);
    };

    const handleRemoveColor = (index: number) => {
        const newColors = [...selectedColors];
        newColors.splice(index, 1);
        onColorsChange(newColors);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Colores</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Colores</h3>
                        <Badge variant="secondary">
                            {selectedColors.length} seleccionado{selectedColors.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                            {error}
                        </div>
                    )}

                    <div id="colors-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <div className="space-y-3">
                                <Input
                                    placeholder="Buscar colores..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full text-sm"
                                />
                                <Droppable droppableId="available-colors">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-2 h-[350px] overflow-y-auto border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50"
                                        >
                                            {filteredColors.map((color, index) => (
                                                <Draggable
                                                    key={color.id}
                                                    draggableId={`available-${color.id}`}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-white p-2.5 rounded-md border border-gray-200 cursor-move hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                                                        >
                                                            <div className="flex items-center gap-2.5">
                                                                <div
                                                                    className="w-3 h-3 rounded-full border border-gray-300 shadow-sm flex-shrink-0"
                                                                    style={{ backgroundColor: color.hexCode }}
                                                                />
                                                                <span className="text-sm font-medium text-gray-700 truncate">{color.name}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-sm text-gray-700">Colores seleccionados</h3>
                                    <Input
                                        placeholder="Buscar en seleccionados..."
                                        className="w-32 text-xs"
                                    />
                                </div>
                                <Droppable droppableId="selected-colors">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-2 h-[350px] overflow-y-auto border-2 border-dashed border-red-300 rounded-lg p-4 bg-red-50/30"
                                        >
                                            {selectedColors.map((item, index) => (
                                                <Draggable
                                                    key={`selected-color-${item.id}-${item.colorId}`}
                                                    draggableId={`selected-${item.id}-${item.colorId}`}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-white p-2.5 rounded-md shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all duration-200"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                                                    <Checkbox
                                                                        checked={item.isMainColor}
                                                                        onCheckedChange={(checked) => handleMainColorChange(index, checked as boolean)}
                                                                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 flex-shrink-0"
                                                                    />
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <div
                                                                            className="w-3 h-3 rounded-full border border-gray-300 shadow-sm flex-shrink-0"
                                                                            style={{ backgroundColor: item.color?.hexCode || '#ccc' }}
                                                                        />
                                                                        <span className="text-sm font-medium text-gray-900 truncate">
                                                                            {item.color?.name || 'Color sin nombre'}
                                                                        </span>
                                                                    </div>
                                                                    {item.isMainColor && (
                                                                        <Badge variant="default" className="bg-red-50 text-red-800 border-red-200 text-xs px-2 py-0.5 flex-shrink-0">
                                                                            Principal
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveColor(index)}
                                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors p-1 h-auto flex-shrink-0"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </DragDropContext>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 