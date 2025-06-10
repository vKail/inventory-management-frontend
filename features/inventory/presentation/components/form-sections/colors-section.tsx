import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ItemColor } from "../../../data/interfaces/inventory.interface";
import { IColor } from "@/features/colors/data/interfaces/color.interface";
import { ColorService } from "@/features/colors/services/color.service";

interface ColorsSectionProps {
    selectedColors: ItemColor[];
    onColorsChange: (colors: ItemColor[]) => void;
    mode: 'create' | 'edit';
}

export const ColorsSection = ({ selectedColors, onColorsChange, mode }: ColorsSectionProps) => {
    const [allColors, setAllColors] = useState<IColor[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredColors, setFilteredColors] = useState<IColor[]>([]);

    // Cargar todos los colores al inicio
    useEffect(() => {
        ColorService.getInstance().getColors()
            .then((response) => {
                const colorsList = response.records || [];
                setAllColors(colorsList);
                updateFilteredColors(colorsList, selectedColors, searchTerm);
            })
            .catch((error) => {
                console.error('Error loading colors:', error);
            });
    }, []);

    // Función para actualizar los colores filtrados
    const updateFilteredColors = (
        colors: IColor[],
        selected: ItemColor[],
        search: string
    ) => {
        const filtered = colors.filter(color => {
            const matchesSearch = color.name.toLowerCase().includes(search.toLowerCase());
            const isNotSelected = !selected.some(selected => selected.colorId === color.id);
            return matchesSearch && isNotSelected;
        });
        setFilteredColors(filtered);
    };

    // Actualizar colores filtrados cuando cambia la búsqueda o los colores seleccionados
    useEffect(() => {
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
                id: 0, // Temporal ID
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
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Lista de colores disponibles */}
                        <div className="space-y-4">
                            <Input
                                placeholder="Buscar colores..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Droppable droppableId="available-colors">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="border rounded-lg p-4 h-[400px] overflow-y-auto"
                                    >
                                        {filteredColors.map((color, index) => (
                                            <Draggable
                                                key={`available-${color.id}`}
                                                draggableId={`available-${color.id}`}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-red-500/10 p-2 rounded-md shadow-sm mb-2 cursor-move hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-4 h-4 rounded-full"
                                                                style={{ backgroundColor: color.hexCode }}
                                                            />
                                                            {color.name}
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

                        {/* Lista de colores seleccionados */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Colores seleccionados</h3>
                            <Droppable droppableId="selected-colors">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="border rounded-lg p-4 h-[400px] overflow-y-auto"
                                    >
                                        {selectedColors.map((itemColor, index) => (
                                            <Draggable
                                                key={`selected-${itemColor.colorId}-${index}`}
                                                draggableId={`selected-${itemColor.colorId}-${index}`}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white p-2 rounded-md shadow-sm mb-2 cursor-move flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                checked={itemColor.isMainColor}
                                                                onCheckedChange={(checked) =>
                                                                    handleMainColorChange(index, checked as boolean)
                                                                }
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-4 h-4 rounded-full"
                                                                    style={{ backgroundColor: itemColor.color?.hexCode }}
                                                                />
                                                                <span>{itemColor.color?.name}</span>
                                                            </div>
                                                            {itemColor.isMainColor && (
                                                                <Badge variant="secondary">Principal</Badge>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRemoveColor(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                </DragDropContext>
            </CardContent>
        </Card>
    );
}; 