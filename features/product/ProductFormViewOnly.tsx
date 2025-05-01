import React from "react";
import { TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

export function ProductFormViewOnly() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-1">Registro de Bien</h2>
      <p className="text-sm text-muted-foreground mb-6">Complete todos los campos para registrar el bien en el inventario</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Código del Bien</label>
          <div className="flex gap-2">
            <TextField
              label="Código único del bien"
              variant="outlined"
              className="w-full"
            />
            <button className="px-3 py-2 bg-gray-200 rounded">Generar</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bien</label>
          <TextField
            label="Nombre del bien"
            variant="outlined"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <TextField
            label="Color del bien"
            variant="outlined"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Código Anterior</label>
          <TextField
            label="Código anterior del bien"
            variant="outlined"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Serie/Identificación</label>
          <TextField
            label="Número de serie o identificación"
            variant="outlined"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Material</label>
          <TextField
            label="Material principal"
            variant="outlined"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Identificador</label>
          <TextField
            label="Identificador único"
            variant="outlined"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Modelo/Características</label>
          <TextField
            label="Modelo y características del bien"
            multiline
            rows={4}
            variant="outlined"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dimensiones</label>
          <TextField
            label="Ej: 120x80x40 cm"
            variant="outlined"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nro de Acta/Matriz</label>
          <TextField
            label="Número de acta o matriz"
            variant="outlined"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Marca/Raza/Otros</label>
          <TextField
            label="Marca, raza u otras características"
            variant="outlined"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">(BLD) o (BCA)</label>
          <FormControl fullWidth>
            <InputLabel>Seleccione tipo</InputLabel>
            <Select defaultValue="" label="Seleccione tipo">
              <MenuItem value="bld">BLD</MenuItem>
              <MenuItem value="bca">BCA</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha de Ingreso</label>
          <TextField
            type="date"
            defaultValue="2025-04-30"
            variant="outlined"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}