'use client'

import { Boxes } from 'lucide-react'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import ItemTypeTable from '../components/item-type-table'

export default function ItemTypesView() {
  return (
    <div className="flex-1 space-y-4 overflow-hidden">
      <div className="w-full">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <span className="text-muted-foreground font-medium">Configuración</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Boxes className="inline mr-1 h-4 w-4 text-primary align-middle" />
                  <BreadcrumbPage>Tipos de Items</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-2xl font-bold tracking-tight">Lista de Tipos de Items</h2>
            <p className="text-muted-foreground">Todos los tipos de items registrados en el sistema</p>
          </div>
        </div>
        <ItemTypeTable />
      </div>
    </div>
  )
}
