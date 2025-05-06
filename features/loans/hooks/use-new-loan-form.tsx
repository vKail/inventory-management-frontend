import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { loanRequestSchema } from "../data/schemas/loan-request-schema";

export const useNewLoanForm = () => {
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
    fechaDevolucion: null as Date | null,
    notas: "",
    aceptaResponsabilidad: false,
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      fechaDevolucion: (date ?? null) as Date | null,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      aceptaResponsabilidad: checked,
    }));
  };

  const handleSearchBien = () => {
    // Simular búsqueda
    setSearchResults([
      { id: "1", nombre: "MacBook Pro 16''", barcode: "TEC-001" },
      { id: "2", nombre: "Monitor Dell UltraSharp 27''", barcode: "TEC-002" },
      { id: "3", nombre: "Arduino Starter Kit", barcode: "TEC-003" },
    ]);
    setShowResults(true);
  };

  const handleSelectBien = (bien: any) => {
    setFormData((prev) => ({
      ...prev,
      bienId: bien.id,
      bienNombre: bien.nombre,
    }));
    setShowResults(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = loanRequestSchema.safeParse({
      ...formData,
      fechaDevolucion: formData.fechaDevolucion || undefined,
    });

    if (!parsed.success) {
      const errors: { [key: string]: string } = {};
      const errorMap = parsed.error.format();
      for (const key in errorMap) {
        const err = errorMap[key as keyof typeof errorMap];
        if (err && (err as any)._errors?.length) {
          errors[key] = (err as any)._errors[0];
        }
      }
      setFormErrors(errors);
      toast.error("Por favor corrige los errores del formulario.");
      return;
    }

    toast.success("Solicitud de préstamo enviada correctamente.");

    // Aquí iría tu lógica para enviar los datos (fetch/axios, etc.)

    setTimeout(() => {
      router.push("/loans");
    }, 3000);
  };

  const handleCancel = () => {
    router.push("/loans");
  };

  return {
    formData,
    formErrors,
    searchQuery,
    searchResults,
    showResults,
    setFormData,
    handleSearchBien,
    handleSelectBien,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleCheckboxChange,
    onSubmit,
    setSearchQuery,
    handleCancel,
  };
};
