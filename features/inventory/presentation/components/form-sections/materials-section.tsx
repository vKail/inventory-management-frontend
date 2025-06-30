import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ItemMaterial } from "../../../data/interfaces/inventory.interface";
import { IMaterial } from "@/features/materials/data/interfaces/material.interface";
import { useMaterialStore } from "@/features/materials/context/material-store";

interface MaterialsSectionProps {
    selectedMaterials: ItemMaterial[];
    onMaterialsChange: (materials: ItemMaterial[]) => void;
    mode: 'create' | 'edit';
}

export const MaterialsSection = ({ selectedMaterials, onMaterialsChange, mode }: MaterialsSectionProps) => {
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

    // Función para actualizar los materiales filtrados
    const updateFilteredMaterials = (
        materials: IMaterial[],
        selected: ItemMaterial[],
        search: string
    ) => {
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
                id: 0, // Temporal ID
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
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Lista de materiales disponibles */}
                        <div className="space-y-4">
                            <Input
                                placeholder="Buscar materiales..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Droppable droppableId="available-materials">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="border rounded-lg p-4 h-[400px] overflow-y-auto"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-sm text-muted-foreground">Cargando materiales...</div>
                                            </div>
                                        ) : filteredMaterials.length > 0 ? (
                                            filteredMaterials.map((material, index) => (
                                                <Draggable
                                                    key={`available-${material.id}`}
                                                    draggableId={`available-${material.id}`}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="bg-red-500/10 p-2 rounded-md shadow-sm mb-2 cursor-move hover:bg-red-500/20 transition-colors"
                                                        >
                                                            {material.name}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-sm text-muted-foreground">
                                                    {searchTerm ? 'No se encontraron materiales' : 'No hay materiales disponibles'}
                                                </div>
                                            </div>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        {/* Lista de materiales seleccionados */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Materiales seleccionados</h3>
                            <Droppable droppableId="selected-materials">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="border rounded-lg p-4 h-[400px] overflow-y-auto"
                                    >
                                        {selectedMaterials.map((itemMaterial, index) => (
                                            <Draggable
                                                key={`selected-${itemMaterial.materialId}-${index}`}
                                                draggableId={`selected-${itemMaterial.materialId}-${index}`}
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
                                                                checked={itemMaterial.isMainMaterial}
                                                                onCheckedChange={(checked) =>
                                                                    handleMainMaterialChange(index, checked as boolean)
                                                                }
                                                            />
                                                            <span>{itemMaterial.material?.name}</span>
                                                            {itemMaterial.isMainMaterial && (
                                                                <Badge variant="secondary">Principal</Badge>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRemoveMaterial(index)}
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