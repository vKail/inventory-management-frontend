'use client';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import NewLoanForm from '../components/new-loan-form';
import { Handshake } from 'lucide-react';
import { useLoanStore } from '../../context/loan-store';

export default function LoanRequestView() {
  const { isLoading } = useLoanStore();

  return (
    <div className="w-full mx-auto py-8 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Operaciones</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/loans" className="flex items-center gap-1">
              <Handshake className="w-4 h-4 text-red-600" />
              Préstamos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nuevo Préstamo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <NewLoanForm />
      </Card>
    </div>
  );
}