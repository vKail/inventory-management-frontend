import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { loanRequestSchema } from "../data/schemas/loan-request-schema";

const MOCK_PRODUCTS = [
  { id: "1", nombre: "MacBook Pro 16''", barcode: "6972011062725" },
  { id: "2", nombre: "Monitor Dell UltraSharp 27''", barcode: "78929395" },
  { id: "3", nombre: "Arduino Starter Kit", barcode: "TEC-003" },
];

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
  const [scanOpen, setScanOpen] = useState(false);

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
    setSearchResults(MOCK_PRODUCTS);
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

  const handleScanBien = (barcode: string) => {
    const bien = MOCK_PRODUCTS.find((item) => item.barcode === barcode);

    if (bien) {
      setFormData((prev) => ({
        ...prev,
        bienId: bien.id,
        bienNombre: bien.nombre,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        bienId: "",
        bienNombre: "",
      }));
    }
    setScanOpen(false);
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

    // Serialize form data to JSON and log to console
    const jsonData = JSON.stringify(formData, null, 2);
    console.log("Data to be sent:", jsonData);

    toast.success("Solicitud de préstamo enviada correctamente");

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
    scanOpen,
    setFormData,
    handleSearchBien,
    handleSelectBien,
    handleScanBien,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleCheckboxChange,
    onSubmit,
    setSearchQuery,
    setScanOpen,
    handleCancel,
  };
};