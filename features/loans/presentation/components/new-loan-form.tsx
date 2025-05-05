"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NewLoanForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    rol: "",
    cedula: "",
    bienId: "",
    bienNombre: "",
    motivo: "",
    eventoAsociado: "",
    ubicacionExterna: "",
    fechaDevolucion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días después
    notas: "",
    aceptaResponsabilidad: false,
  });

  // Simulación de búsqueda de bienes
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearchBien = () => {
    // Aquí iría la lógica real para buscar en la API
    // Por ahora simulamos resultados:
    setSearchResults([
      { id: "1", nombre: "MacBook Pro 16''", barcode: "TEC-001" },
      { id: "2", nombre: "Monitor Dell UltraSharp 27''", barcode: "TEC-002" },
      { id: "3", nombre: "Arduino Starter Kit", barcode: "TEC-003" },
    ]);
    setShowResults(true);
  };

  const handleSelectBien = (bien: any) => {
    setFormData({
      ...formData,
      bienId: bien.id,
      bienNombre: bien.nombre,
    });
    setShowResults(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        fechaDevolucion: date,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log("Datos del formulario:", formData);
    alert("Solicitud de préstamo enviada correctamente");
    router.push("/loans");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Solicitud de Préstamo de Bien</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información del solicitante */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Información del Solicitante
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombres">Nombres</Label>
                    <Input
                      id="nombres"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellidos">Apellidos</Label>
                    <Input
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico</Label>
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Número de Teléfono</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula</Label>
                    <Input
                      id="cedula"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rol">Rol</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("rol", value)}
                    value={formData.rol}
                  >
                    <SelectTrigger id="rol">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estudiante">Estudiante</SelectItem>
                      <SelectItem value="docente">Docente</SelectItem>
                      <SelectItem value="administrativo">
                        Administrativo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Información del bien y préstamo */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Información del Préstamo
                </h3>

                <div className="space-y-2">
                  <Label>Bien a solicitar</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Input
                        placeholder="Buscar bien por nombre o código"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9"
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                      {showResults && searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md border shadow-lg">
                          <ul className="py-1">
                            {searchResults.map((bien) => (
                              <li
                                key={bien.id}
                                className="px-4 py-2 hover:bg-muted cursor-pointer"
                                onClick={() => handleSelectBien(bien)}
                              >
                                <div className="font-medium">{bien.nombre}</div>
                                <div className="text-sm text-muted-foreground">
                                  Código: {bien.barcode}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button type="button" onClick={handleSearchBien}>
                      Buscar
                    </Button>
                  </div>

                  {formData.bienNombre && (
                    <div className="mt-2 p-2 bg-muted rounded-md">
                      <p className="font-medium">{formData.bienNombre}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo del Préstamo</Label>
                  <Textarea
                    id="motivo"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventoAsociado">
                    Evento Asociado (opcional)
                  </Label>
                  <Input
                    id="eventoAsociado"
                    name="eventoAsociado"
                    value={formData.eventoAsociado}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ubicacionExterna">
                    Ubicación de Uso (opcional)
                  </Label>
                  <Input
                    id="ubicacionExterna"
                    name="ubicacionExterna"
                    value={formData.ubicacionExterna}
                    onChange={handleInputChange}
                    placeholder="Dónde se utilizará el bien"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Devolución Programada</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.fechaDevolucion && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fechaDevolucion ? (
                          format(formData.fechaDevolucion, "PPP")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.fechaDevolucion}
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notas">Notas Adicionales</Label>
                  <Textarea
                    id="notas"
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChange}
                    placeholder="Información adicional relevante"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox
                    id="aceptaResponsabilidad"
                    checked={formData.aceptaResponsabilidad}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        aceptaResponsabilidad: checked as boolean,
                      })
                    }
                    required
                  />
                  <label
                    htmlFor="aceptaResponsabilidad"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Acepto la responsabilidad por cualquier daño o pérdida del
                    bien solicitado
                  </label>
                </div>
              </div>
            </div>

            <CardFooter className="flex justify-end gap-2 pt-6 px-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/loans")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!formData.aceptaResponsabilidad || !formData.bienId}
              >
                Solicitar Préstamo
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
