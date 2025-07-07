import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Boxes } from 'lucide-react';
import ItemTypeForm from '../components/item-type-form';

interface ItemTypeFormViewProps {
    id?: string;
}

export default function ItemTypeFormView({ id }: ItemTypeFormViewProps) {
    return (
        <div className="flex-1 space-y-4 overflow-hidden">
            <div className="w-full max-w-[1200px] space-y-2">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Configuración</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Boxes className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/item-types">Tipos de Item</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{id ? "Editar Tipo de Item" : "Nuevo Tipo de Item"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                    <h3 className="text-2xl font-semibold mb-2">
                        {id ? "Editar Tipo de Item" : "Nuevo Tipo de Item"}
                    </h3>
                    <p className="text-muted-foreground text-base">
                        {id
                            ? "Modifica los datos del tipo de item"
                            : "Complete los datos para crear un nuevo tipo de item"}
                    </p>
                </div>
                <div className="md:w-2/3">
                    <ItemTypeForm id={id} />
                </div>
            </div>
        </div>
    );
} 