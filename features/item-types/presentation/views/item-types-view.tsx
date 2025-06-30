'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ItemType } from '../../data/interfaces/item-type.interface'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2, Plus, Box } from 'lucide-react'
import { toast } from 'sonner'
import { itemTypeService } from '../../services/item-type.service'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import ItemTypeTable from '../components/item-type-table'

export default function ItemTypesView() {
  return (
    <div className="flex-1 space-y-4 overflow-hidden">
      <div className="w-full max-w-[1200px]">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <span className="text-muted-foreground font-medium">Configuración</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Box className="inline mr-1 h-4 w-4 text-primary align-middle" />
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
