/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BlackListModalProps {
  open: boolean;
  onClose: () => void;
}

export function BlackListModal({ open, onClose }: BlackListModalProps) {
  // Lista de estudiantes morosos/inconvenientes
  const [listaNegra, setListaNegra] = useState([
    {
      id: "1",
      nombres: "Juan Pérez",
      apellidos: "Gómez",
      cedula: "123456789",
      correo: "juan.perez@example.com",
      telefono: "3001234567",
      rol: "estudiante",
      motivo: "Devolución tardía en 3 ocasiones",
      fechaIncidente: "2023-10-15",
      sancion: "Sin préstamos por 3 meses"
    },
    {
      id: "2",
      nombres: "María López",
      apellidos: "Rodríguez",
      cedula: "987654321",
      correo: "maria.lopez@example.com",
      telefono: "3109876543",
      rol: "estudiante",
      motivo: "Daño a equipo prestado",
      fechaIncidente: "2023-11-20",
      sancion: "Sin préstamos por 6 meses"
    },
    {
      id: "3",
      nombres: "Carlos Sánchez",
      apellidos: "Martínez",
      cedula: "456123789",
      correo: "carlos.sanchez@example.com",
      telefono: "3204567890",
      rol: "docente",
      motivo: "No devolvió material",
      fechaIncidente: "2023-12-05",
      sancion: "Sin préstamos por 1 año"
    }
  ]);

  // Estado para el buscador de la lista negra
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar lista negra según el término de búsqueda
  const filteredListaNegra = listaNegra.filter(persona => 
    persona.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.cedula.includes(searchTerm)
  );

  const handleSelectFromList = (estudiante) => {
    // Esta función se llamaría cuando se quiera seleccionar un estudiante de la lista
    // Probablemente para pasarlo al formulario principal
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Lista Negra de Estudiantes</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Personas con historial de morosidad o problemas con devoluciones
          </p>
        </DialogHeader>
        
        {/* Buscador para la lista negra */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, apellido o cédula..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          {filteredListaNegra.length > 0 ? (
            filteredListaNegra.map((estudiante) => (
              <Card key={estudiante.id} className="border-red-200 bg-red-50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {estudiante.nombres} {estudiante.apellidos}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Cédula: {estudiante.cedula} | {estudiante.rol}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-sm">Motivo:</p>
                      <p className="text-red-600">{estudiante.motivo}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Sanción:</p>
                      <p>{estudiante.sancion}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Fecha incidente:</p>
                      <p>{estudiante.fechaIncidente}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Contacto:</p>
                      <p>{estudiante.correo} | {estudiante.telefono}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron resultados</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}