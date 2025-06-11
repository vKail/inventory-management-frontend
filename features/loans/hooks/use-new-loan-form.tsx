import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useLoanStore } from '../context/loan-store';
import { CreateLoanDto } from '../data/dtos/create-loan.dto';
import { useInventoryStore } from '@/features/inventory/context/inventory-store';

interface FormData {
  cedula: string;
  telefono: string;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: string;
  motivo: string;
  eventoAsociado: string;
  ubicacionExterna: string;
  fechaPrestamo: Date;
  fechaDevolucion: Date | null;
  notas: string;
  aceptaResponsabilidad: boolean;
}

interface Item {
  id: number;
  name: string;
  barcode: string;
  description: string;
}

export function useNewLoanForm() {
  const router = useRouter();
  const { getInventoryItems, items: inventoryItems, loading } = useInventoryStore();
  const { createLoan } = useLoanStore();

  const [formData, setFormData] = useState<FormData>({
    cedula: '',
    telefono: '',
    nombres: '',
    apellidos: '',
    correo: '',
    rol: '',
    motivo: '',
    eventoAsociado: '',
    ubicacionExterna: '',
    fechaPrestamo: new Date(),
    fechaDevolucion: null,
    notas: '',
    aceptaResponsabilidad: false,
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    getInventoryItems();
  }, [getInventoryItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (date: Date | null, field: 'fechaPrestamo' | 'fechaDevolucion') => {
    if (date) {
      setFormData(prev => ({ ...prev, [field]: date }));
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTimeChange = (time: string, field: 'fechaPrestamo' | 'fechaDevolucion') => {
    const [hours, minutes] = time.split(':').map(Number);
    setFormData(prev => {
      const date = prev[field] ? new Date(prev[field]) : new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      return { ...prev, [field]: date };
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, aceptaResponsabilidad: checked }));
  };

  const handleSearchBien = useCallback(async () => {
    if (!searchQuery.trim()) {
      toast.error('Ingrese un término de búsqueda');
      return;
    }
    const filteredItems = inventoryItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(item => ({
      id: item.id,
      name: item.name,
      barcode: item.barcode || '',
      description: item.description
    }));
    setSearchResults(filteredItems);
    setShowResults(true);
  }, [searchQuery, inventoryItems]);

  const handleSelectBien = (item: Item) => {
    if (!selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems(prev => [...prev, item]);
    }
    setShowResults(false);
    setSearchQuery('');
  };

  const handleRemoveItem = (itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleScanBien = (barcode: string) => {
    const item = inventoryItems.find(item => item.barcode === barcode);
    if (item) {
      handleSelectBien({
        id: item.id,
        name: item.name,
        barcode: item.barcode || '',
        description: item.description
      });
    } else {
      toast.error('Item no encontrado');
    }
    setScanOpen(false);
  };

  const handleCancel = () => {
    router.back();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      toast.error('Debe seleccionar al menos un item');
      return;
    }

    if (!formData.aceptaResponsabilidad) {
      toast.error('Debe aceptar la responsabilidad del préstamo');
      return;
    }

    const loanData: CreateLoanDto = {
      scheduledReturnDate: formData.fechaDevolucion!,
      requestorId: formData.cedula,
      reason: formData.motivo,
      associatedEvent: formData.eventoAsociado || undefined,
      externalLocation: formData.ubicacionExterna || undefined,
      notes: formData.notas || undefined,
      loanDetails: selectedItems.map(item => ({
        itemId: item.id,
        exitConditionId: 1, // Asumiendo una condición de salida por defecto
        exitObservations: `Item ${item.name} en buen estado`,
      })),
      blockBlackListed: true,
    };

    try {
      await createLoan(loanData);
      toast.success('Préstamo registrado exitosamente');
      router.push('/loans');
    } catch (error) {
      toast.error('Error al registrar el préstamo');
    }
  };

  return {
    formData,
    formErrors,
    searchQuery,
    searchResults,
    showResults,
    scanOpen,
    selectedItems,
    handleSearchBien,
    handleSelectBien,
    handleScanBien,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleTimeChange,
    handleCheckboxChange,
    handleRemoveItem,
    onSubmit,
    setSearchQuery,
    setScanOpen,
    handleCancel,
  };
}