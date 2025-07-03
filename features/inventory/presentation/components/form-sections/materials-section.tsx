import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ItemMaterial } from "../../../data/interfaces/inventory.interface";
import { IMaterial } from "@/features/materials/data/interfaces/material.interface";
import { useMaterialStore } from "@/features/materials/context/material-store";
import { Switch } from "@/components/ui/switch";

interface MaterialsSectionProps {
    selectedMaterials: ItemMaterial[];
    onMaterialsChange: (materials: ItemMaterial[]) => void;
    mode: 'create' | 'edit';
    error?: string;
}

export const MaterialsSection = ({ selectedMaterials, onMaterialsChange, mode, error }: MaterialsSectionProps) => {
    const { materials, getMaterials, loading } = useMaterialStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMaterials, setFilteredMaterials] = useState<IMaterial[]>([]);

    // Cargar todos los materiales al inicio con allRecords=true
    useEffect(() => {
        const loadAllMaterials = async () => {
            try {
                // Fetch all materials with allRecords=true
                await getMaterials(1, 1000, { allRecords: true });
            } catch (error) {
                console.error('Error loading materials:', error);
            }
        };

        loadAllMaterials();
    }, [getMaterials]);

    // Función para actualizar los materiales filtrados (disponibles)
    const updateFilteredMaterials = (
        materials: IMaterial[],
        selected: ItemMaterial[],
        search: string
    ) => {
        // Los disponibles son todos los del catálogo menos los seleccionados
        const filtered = materials.filter(material => {
            const matchesSearch = material.name.toLowerCase().includes(search.toLowerCase());
            const isNotSelected = !selected.some(selected => selected.materialId === material.id);
            return matchesSearch && isNotSelected;
        });
        setFilteredMaterials(filtered);
    };

    // Actualizar materiales filtrados cuando cambia la búsqueda o los materiales seleccionados
    useEffect(() => {
        updateFilteredMaterials(materials, selectedMaterials, searchTerm);
    }, [searchTerm, selectedMaterials, materials]);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const { source, destination } = result;

        // Si el drag es desde la lista de materiales disponibles
        if (source.droppableId === 'available-materials') {
            const material = filteredMaterials[source.index];

            // Verificar si el material ya está seleccionado
            const isAlreadySelected = selectedMaterials.some(
                selected => selected.materialId === material.id
            );

            if (isAlreadySelected) {
                return; // No hacer nada si ya está seleccionado
            }

            const newMaterial: ItemMaterial = {
                id: Date.now() + Math.random(), // Generar ID único temporal
                itemId: 0, // Se asignará al crear el item
                materialId: material.id,
                isMainMaterial: false,
                material: material
            };
            onMaterialsChange([...selectedMaterials, newMaterial]);
        }
        // Si el drag es dentro de los materiales seleccionados
        else if (source.droppableId === 'selected-materials') {
            const reorderedMaterials = Array.from(selectedMaterials);
            const [removed] = reorderedMaterials.splice(source.index, 1);
            reorderedMaterials.splice(destination.index, 0, removed);
            onMaterialsChange(reorderedMaterials);
        }
    };

    const handleMainMaterialChange = (index: number, isMain: boolean) => {
        const newMaterials = [...selectedMaterials];

        // Si se está marcando como principal, desmarcar cualquier otro principal
        if (isMain) {
            newMaterials.forEach((material, i) => {
                if (i !== index) {
                    material.isMainMaterial = false;
                }
            });
        }

        newMaterials[index] = {
            ...newMaterials[index],
            isMainMaterial: isMain
        };
        onMaterialsChange(newMaterials);
    };

    const handleRemoveMaterial = (index: number) => {
        const newMaterials = [...selectedMaterials];
        newMaterials.splice(index, 1);
        onMaterialsChange(newMaterials);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Materiales</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Materiales</h3>
                        <Badge variant="secondary">
                            {selectedMaterials.length} seleccionado{selectedMaterials.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                            {error}
                        </div>
                    )}

                    <div id="materials-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <div className="space-y-3">
                                <Input
                                    placeholder="Buscar materiales..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full text-sm"
                                />
                                <Droppable droppableId="available-materials">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-2 h-[350px] overflow-y-auto border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50"
                                        >
                                            {filteredMaterials.map((material, index) => (
                                                <Draggable
                                                    key={material.id}
                                                    draggableId={`available-${material.id}`}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-white p-2.5 rounded-md border border-gray-200 cursor-move hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></div>
                                                                <span className="text-sm font-medium text-gray-700 truncate">{material.name}</span>
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
                                    <h3 className="font-medium text-sm text-gray-700">Materiales seleccionados</h3>
                                    <Input
                                        placeholder="Buscar en seleccionados..."
                                        className="w-32 text-xs"
                                    />
                                </div>
                                <Droppable droppableId="selected-materials">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-2 h-[350px] overflow-y-auto border-2 border-dashed border-red-300 rounded-lg p-4 bg-red-50/30"
                                        >
                                            {selectedMaterials.map((item, index) => (
                                                <Draggable
                                                    key={`selected-material-${item.id}-${item.materialId}`}
                                                    draggableId={`selected-${item.id}-${item.materialId}`}
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
                                                                        checked={item.isMainMaterial}
                                                                        onCheckedChange={(checked) => handleMainMaterialChange(index, checked as boolean)}
                                                                        className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 flex-shrink-0"
                                                                    />
                                                                    <span className="text-sm font-medium text-gray-900 truncate">
                                                                        {item.material?.name || 'Material sin nombre'}
                                                                    </span>
                                                                    {item.isMainMaterial && (
                                                                        <Badge variant="default" className="bg-red-50 text-red-800 border-red-200 text-xs px-2 py-0.5 flex-shrink-0">
                                                                            Principal
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveMaterial(index)}
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