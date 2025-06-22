"use client";

import { Users } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { UserTable } from '../components/user-table';

export default function UserView() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 overflow-hidden">
      {/* Breadcrumbs y título */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <span className="text-muted-foreground font-medium">Administración</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Users className="inline mr-1 h-4 w-4 text-primary align-middle" />
                <BreadcrumbPage>Usuarios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h2 className="text-2xl font-bold tracking-tight">Lista de Usuarios</h2>
          <p className="text-muted-foreground">Todos los usuarios registrados en el sistema</p>
        </div>
      </div>

      <UserTable />
    </div>
  );
}