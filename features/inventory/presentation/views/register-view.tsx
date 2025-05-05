"use client";

import { toast } from "sonner";

export default function RegisterView() {
  const handleSubmit = () => {
    toast.success("✅ Envío correcto de los datos");
  };

  return (
    <div className="px-8 py-6">
      <h2 className="text-2xl font-semibold mb-4">Registro de Bien</h2>
      <p className="text-sm text-gray-600 mb-6">
        Complete todos los campos para registrar el bien en el inventario.
      </p>

      {/* Sección: Bien */}
      <h3 className="font-bold text-lg mb-2">Datos del Bien</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="font-bold block mb-1">Código del Bien</label>
          <input placeholder="Ej. 001-ABC" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Nombre del Bien</label>
          <input placeholder="Ej. Computadora" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Color del Bien</label>
          <input placeholder="Ej. Negro" className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="font-bold block mb-1">Código Anterior</label>
          <input placeholder="Si aplica" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Serie/Identificación</label>
          <input placeholder="Ej. SN123456" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Material Principal</label>
          <input placeholder="Ej. Plástico, Metal" className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="font-bold block mb-1">Identificador Único</label>
          <input placeholder="Ej. UID-7890" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Modelo/Características</label>
          <input placeholder="Ej. Dell Inspiron 15" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Dimensiones</label>
          <input placeholder="Ej. 120x80x74 cm" className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="font-bold block mb-1">No. de Acta/Matriz</label>
          <input placeholder="Ej. ACT-2024-001" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Marca, otros datos</label>
          <input placeholder="Ej. HP, año 2022" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Fecha de Ingreso</label>
          <input type="date" className="border p-2 rounded w-full" />
        </div>
      </div>

      {/* Sección: Información Adicional */}
      <h3 className="font-bold text-lg mb-2">Información Adicional</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="font-bold block mb-1">Nombre del Custodio</label>
          <input placeholder="Ej. Juan Pérez" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Número de Ítem o Región</label>
          <input placeholder="Ej. 12 o Sierra-Centro" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Código de Cuenta Contable</label>
          <input placeholder="Ej. 123.456.789" className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="font-bold block mb-1">Valor Contable</label>
          <input placeholder="Ej. $250.00" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Ubicación Física del Bien</label>
          <input placeholder="Ej. Edificio A, Piso 2" className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="font-bold block mb-1">Oficina o Laboratorio</label>
          <input placeholder="Ej. Lab. Sistemas" className="border p-2 rounded w-full" />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
        <button
          onClick={handleSubmit}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Registrar Bien
        </button>
      </div>
    </div>
  );
}
