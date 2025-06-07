'use client';

import { Breadcrumb, BreadcrumbSeparator, BreadcrumbPage, BreadcrumbList, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import { RegisterForm } from '../components/register-form';
import { Card } from '@/components/ui/card';
import { PackageSearch } from 'lucide-react';

export const RegisterView = () => {
  return (
    <div className="px-8 py-6">

      <div className="mb-2 w-full max-w-[1200px] mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground font-medium">
                Operaciones
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <PackageSearch className="inline mr-1 h-4 w-4 text-primary align-middle" />
              <BreadcrumbLink href="/inventory">Inventario</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nuevo Producto en Inventario</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="p-6">
        <RegisterForm />
      </Card>
    </div>
  );
};
