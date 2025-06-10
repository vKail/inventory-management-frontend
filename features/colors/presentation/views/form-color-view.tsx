'use client'

import { useRouter } from 'next/navigation'
import ColorForm from "../components/color-form"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { PaletteIcon } from 'lucide-react'


// This component provides a view for creating or editing colors.
// It includes a breadcrumb navigation and a form for entering color details.
export default function FormColorView() {
    const router = useRouter()


    // This function handles the submission of the color form.
    // It redirects to the colors page after the form is submitted.
    return (
        <div className="flex w-full flex-col items-center px-6">
            <div className="w-full max-w-[1200px]">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">Configuracion</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/colors">
                                <div className="flex items-center">
                                    <PaletteIcon className="w-4 h-4 text-red-600 mr-1" />
                                    Colores
                                </div>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Nuevo Color</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <div className="sticky top-6">
                            <h2 className="text-xl font-bold mb-2">Detalles del color</h2>
                            <p className="text-gray-500 text-sm">Ingresa el nombre, código HEX y una breve descripción para el color.</p>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <ColorForm />

                    </div>
                </div>
            </div>
        </div>
    )
}