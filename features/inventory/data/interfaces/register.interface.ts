export interface RegisterFormData {
  // === Sección 1: Identificación y Códigos ===
  codigoBien: string;
  codigoAnterior?: string; // opcional
  identificador: string;
  nroActaMatriz: string;
  bldBca: "BLD" | "BCA"; // enum-like

  // === Sección 2: Características del Bien ===
  bien: string;
  serieIdentificacion: string;
  modeloCaracteristicas: string;
  marcaRazaOtros: string;
  color: string;
  material: string;
  dimensiones: string;

  // === Sección 3: Ubicación y Responsable ===
  custodioActual: string;
  ubicacion: string;
  oficinaLaboratorio: string;

  // === Sección 4: Información Contable ===
  itemRenglon: string;
  cuentaContable: string;
  fechaIngreso: Date;
  valorContable: number;
}