import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
    fechaDevolucion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notas: "",
    aceptaResponsabilidad: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearchBien = () => {
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
    if (date) {
      setFormData((prev) => ({
        ...prev,
        fechaDevolucion: date,
      }));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);

    toast.success("Solicitud de préstamo enviada correctamente");
    setTimeout(() => {
      router.push("/loans");
    }, 4000);
  };

  const handleCancel = () => {
    router.push("/loans");
  };

  return {
    formData,
    searchQuery,
    searchResults,
    showResults,
    setFormData,
    handleSearchBien,
    handleSelectBien,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    onSubmit,
    setSearchQuery,
    handleCancel,

  };
};
