import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Wrench } from 'lucide-react';
import { LocationForm } from '../components/location-form';
import { ILocation } from '../../data/interfaces/location.interface';
import { LocationFormValues } from '../../data/schemas/location.schema';

interface LocationFormViewProps {
    initialData?: ILocation | null;
    onSubmit: (data: LocationFormValues) => Promise<void>;
    isLoading: boolean;
    isEditMode: boolean;
}

export default function LocationFormView({ initialData, onSubmit, isLoading, isEditMode }: LocationFormViewProps) {
    return (
        <div className="container mx-auto py-6">
            <div className="w-full">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Configuración</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Wrench className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/locations">Ubicaciones</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{isEditMode ? "Editar Ubicación" : "Nueva Ubicación"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <LocationForm initialData={initialData} onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
} 