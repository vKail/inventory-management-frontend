/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useEffect, useState } from "react";
import { useNewLoanForm } from "../../hooks/use-new-loan-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Handshake, ScanBarcode, AlertCircle, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Breadcrumb, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ScanModal } from "./scan-modal";
import { BlackListModal } from "./black-list-modal";

export default function NewLoanForm() {
  const {
    formData,
    formErrors,
    searchQuery,
    searchResults,
    showResults,
    scanOpen,
    handleSearchBien,
    handleSelectBien,
    handleScanBien,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleTimeChange,
    handleCheckboxChange,
    onSubmit,
    setSearchQuery,
    setScanOpen,
    handleCancel,
    selectedItems,
    handleRemoveItem,
  } = useNewLoanForm();

  // Estado para el modal de la lista negra
  const [blackListModalOpen, setBlackListModalOpen] = useState(false);

  useEffect(() => {
    // Ensure focus is set on mount for accessibility
    const timeout = setTimeout(() => {
      const firstInput = document.querySelector<HTMLInputElement>("input[name='nombres']");
      firstInput?.focus();
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="mx-auto w-full p-4">
      {/* Breadcrumb y botón Lista Negra */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={() => setBlackListModalOpen(true)}
        >
          <AlertCircle className="h-4 w-4" />
          Lista Negra
        </Button>
      </div>

      {/* Modales */}
      <ScanModal
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        onScanComplete={handleScanBien}
      />

      <BlackListModal
        open={blackListModalOpen}
        onClose={() => setBlackListModalOpen(false)}
      />

      <form onSubmit={onSubmit}>
        <div className="space-y-10">
          {/* Sección Solicitante */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="pt-2">
              <h2 className="text-lg font-bold">Solicitante</h2>
              <p className="text-muted-foreground text-sm">Datos personales y de contacto del solicitante del préstamo.</p>
            </div>
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Información del Solicitante</CardTitle>
                  <p className="text-muted-foreground">Complete los datos del solicitante.</p>
                </CardHeader>
                <CardContent>
                  <div className="w-full px-0">
                    <div className="grid grid-cols-1 gap-6 w-full">
                      <div className="space-y-4 w-full">
                        <div className="grid grid-cols-2 gap-4 w-full">
                          <div>
                            <label className="block mb-1 font-medium" htmlFor="cedula">Cédula</label>
                            <Input
                              id="cedula"
                              name="cedula"
                              value={formData.cedula}
                              onChange={handleInputChange}
                              required
                              className="w-full"
                            />
                            {formErrors.cedula && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.cedula}</p>
                            )}
                          </div>
                          <div>
                            <label className="block mb-1 font-medium" htmlFor="telefono">Número de Teléfono</label>
                            <Input
                              id="telefono"
                              name="telefono"
                              value={formData.telefono}
                              onChange={handleInputChange}
                              required
                              className="w-full"
                            />
                            {formErrors.telefono && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.telefono}</p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full">
                          <div>
                            <label className="block mb-1 font-medium" htmlFor="nombres">Nombres</label>
                            <Input
                              id="nombres"
                              name="nombres"
                              value={formData.nombres}
                              onChange={handleInputChange}
                              required
                              className="w-full"
                            />
                            {formErrors.nombres && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.nombres}</p>
                            )}
                          </div>
                          <div>
                            <label className="block mb-1 font-medium" htmlFor="apellidos">Apellidos</label>
                            <Input
                              id="apellidos"
                              name="apellidos"
                              value={formData.apellidos}
                              onChange={handleInputChange}
                              required
                              className="w-full"
                            />
                            {formErrors.apellidos && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.apellidos}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 font-medium" htmlFor="correo">Correo Electrónico</label>
                          <Input
                            id="correo"
                            name="correo"
                            type="email"
                            value={formData.correo}
                            onChange={handleInputChange}
                            required
                            className="w-full"
                          />
                          {formErrors.correo && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.correo}</p>
                          )}
                        </div>
                        <div>
                          <label className="block mb-1 font-medium" htmlFor="rol">Rol</label>
                          <Select
                            value={formData.rol}
                            onValueChange={(v) => handleSelectChange("rol", v)}
                          >
                            <SelectTrigger id="rol" className="w-full">
                              <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="estudiante">Estudiante</SelectItem>
                              <SelectItem value="docente">Docente</SelectItem>
                              <SelectItem value="administrativo">Administrativo</SelectItem>
                            </SelectContent>
                          </Select>
                          {formErrors.rol && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.rol}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sección Préstamo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="pt-2">
              <h2 className="text-lg font-bold">Préstamo</h2>
              <p className="text-muted-foreground text-sm">Información del bien, motivo y detalles del préstamo solicitado.</p>
            </div>
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Información del Préstamo</CardTitle>
                  <p className="text-muted-foreground">Complete los datos del bien y el préstamo.</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4 w-full">
                      <div className="flex gap-2 w-full">
                        <div className="relative flex-grow">
                          <Input
                            placeholder="Buscar bien por nombre o código"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                          />
                          {showResults && searchResults.length > 0 && (
                            <div className="bg-muted rounded p-2 mt-1 absolute z-10 w-full">
                              {searchResults.map((bien) => (
                                <div
                                  key={bien.id}
                                  className="cursor-pointer hover:bg-accent px-2 py-1 rounded"
                                  onClick={() => handleSelectBien(bien)}
                                >
                                  {bien.nombre} <span className="text-xs text-muted-foreground">({bien.barcode})</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button type="button" variant="destructive" onClick={handleSearchBien}>
                          Buscar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setScanOpen(true)}
                        >
                          <ScanBarcode className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Lista de items seleccionados */}
                      {selectedItems.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Items Seleccionados:</h4>
                          <div className="space-y-2">
                            {selectedItems.map((item) => (
                              <div key={item.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                                <span>{item.name} - {item.barcode}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block mb-1 font-medium" htmlFor="motivo">Motivo del Préstamo</label>
                        <Textarea
                          id="motivo"
                          name="motivo"
                          value={formData.motivo}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                        />
                        {formErrors.motivo && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.motivo}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-1 font-medium" htmlFor="eventoAsociado">Evento Asociado (opcional)</label>
                        <Input
                          id="eventoAsociado"
                          name="eventoAsociado"
                          value={formData.eventoAsociado}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium" htmlFor="ubicacionExterna">Ubicación de Uso (opcional)</label>
                        <Input
                          id="ubicacionExterna"
                          name="ubicacionExterna"
                          value={formData.ubicacionExterna}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Fecha de Préstamo con hora */}
                        <div className="flex flex-col h-full justify-between">
                          <label className="block mb-1 font-medium">Fecha y Hora de Préstamo</label>
                          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full sm:w-auto justify-start text-left font-normal",
                                    !formData.fechaPrestamo && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.fechaPrestamo ? format(formData.fechaPrestamo, "PPP") : <span>Seleccionar fecha</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={formData.fechaPrestamo}
                                  onSelect={(date) => handleDateChange(date, "fechaPrestamo")}
                                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <Input
                              type="time"
                              value={format(formData.fechaPrestamo, "HH:mm")}
                              onChange={(e) => handleTimeChange(e.target.value, "fechaPrestamo")}
                              className="w-full sm:w-32"
                            />
                          </div>
                        </div>

                        {/* Fecha de Devolución con hora */}
                        <div className="flex flex-col h-full justify-between">
                          <label className="block mb-1 font-medium">Fecha y Hora de Devolución Programada</label>
                          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full sm:w-auto justify-start text-left font-normal",
                                    !formData.fechaDevolucion && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.fechaDevolucion ? format(formData.fechaDevolucion, "PPP") : <span>Seleccionar fecha</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={formData.fechaDevolucion ?? undefined}
                                  onSelect={(date) => handleDateChange(date, "fechaDevolucion")}
                                  disabled={(date) => date < formData.fechaPrestamo}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <Input
                              type="time"
                              value={formData.fechaDevolucion ? format(formData.fechaDevolucion, "HH:mm") : ""}
                              onChange={(e) => handleTimeChange(e.target.value, "fechaDevolucion")}
                              className="w-full sm:w-32"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 font-medium" htmlFor="notas">Notas Adicionales</label>
                        <Textarea
                          id="notas"
                          name="notas"
                          value={formData.notas}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Checkbox y acciones */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="aceptaResponsabilidad"
                checked={formData.aceptaResponsabilidad}
                onCheckedChange={(checked) => handleCheckboxChange(checked)}
              />
              <label htmlFor="aceptaResponsabilidad" className="text-sm">
                Acepto la responsabilidad por cualquier daño o pérdida del bien solicitado
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button
                type="submit"
                disabled={!formData.aceptaResponsabilidad || selectedItems.length === 0}
                className="bg-primary text-white"
              >
                Solicitar Préstamo
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}