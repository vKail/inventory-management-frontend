"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoanStore } from "../../context/loan-store";
import { LoanTableView } from "../components/loan-table-view";
import { LoanListView } from "../components/loan-list-view";
import { LoanGridView } from "../components/loan-grid-view";
import { LoanReturnModal } from "../components/loan-return-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LoanHeader } from "../components/loan-header";
import { Pagination } from "@/components/ui/pagination";
import { Loan } from "@/features/loans/data/interfaces/loan.interface";
import { LoanSkeleton } from "../components/loan-skeleton";
import { Handshake, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ViewType = 'table' | 'list' | 'grid';

// Mock conditions - Replace with actual data from your API
const mockConditions = [
    { id: 1, name: "Excelente" },
    { id: 2, name: "Bueno" },
    { id: 3, name: "Regular" },
    { id: 4, name: "Malo" },
    { id: 5, name: "Dañado" }
];

export function LoanView() {
    const router = useRouter();
    const {
        loans,
        loading,
        error,
        currentPage,
        totalPages,
        filters,
        getLoans,
        returnLoan,
        setPage,
        setFilters,
        clearFilters
    } = useLoanStore();

    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

    useEffect(() => {
        getLoans();
    }, [getLoans]);

    const handleViewChange = (view: ViewType) => {
        setFilters({ ...filters, view });
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handleViewDetails = (loan: Loan) => {
        // Handle view details if needed
    };

    const handleReturn = (loan: Loan) => {
        setSelectedLoan(loan);
    };

    const handleReturnSubmit = async (data: any) => {
        try {
            await returnLoan(data.loanId, data);
            setSelectedLoan(null);
        } catch (error) {
            console.error("Error returning loan:", error);
        }
    };

    const handleRetry = async () => {
        try {
            await getLoans();
        } catch (error) {
            console.error("Error retrying:", error);
            toast.error("Error al cargar los préstamos");
        }
    };

    const handleGoBack = () => {
        clearFilters();
        // Optionally, you can also reset other UI state here if needed
        router.push('/loans');
    };

    if (error) {
        // Improved custom message for DNI not found
        const isDniNotFound = typeof error === 'string' && error.toLowerCase().includes('persona con dni') && error.toLowerCase().includes('no encontrada');
        return (
            <div className="space-y-3 sm:space-y-4">
                {/* Breadcrumbs y título */}
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Breadcrumb className="mb-3 sm:mb-6">
                            <BreadcrumbList className="flex-wrap text-xs sm:text-sm">
                                <BreadcrumbItem>
                                    <span className="text-muted-foreground font-medium">Operaciones</span>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <Handshake className="inline mr-1 h-3 w-3 sm:h-4 sm:w-4 text-primary align-middle" />
                                    <BreadcrumbPage>Préstamos</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Lista de Préstamos</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Todos los préstamos registrados en el sistema</p>
                    </div>
                </div>

                <Card className="w-full">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mb-3 sm:mb-4" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                {isDniNotFound ? 'Persona no encontrada' : 'Error al cargar los préstamos'}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 max-w-md px-2">
                                {isDniNotFound
                                    ? 'La persona ingresada no tiene préstamos registrados en el sistema.'
                                    : (error || 'Ha ocurrido un error inesperado al cargar los préstamos. Por favor, inténtalo de nuevo.')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto px-2">
                                <Button
                                    onClick={handleRetry}
                                    className="flex items-center justify-center gap-2 text-xs sm:text-sm h-9"
                                >
                                    <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    Reintentar
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleGoBack}
                                    className="text-xs sm:text-sm h-9"
                                >
                                    Volver a Préstamos
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentView = (filters as any).view || 'table';

    const ViewComponent = {
        table: LoanTableView,
        list: LoanListView,
        grid: LoanGridView
    }[currentView as ViewType];

    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Breadcrumbs y título */}
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Breadcrumb className="mb-3 sm:mb-6">
                        <BreadcrumbList className="flex-wrap text-xs sm:text-sm">
                            <BreadcrumbItem>
                                <span className="text-muted-foreground font-medium">Operaciones</span>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Handshake className="inline mr-1 h-3 w-3 sm:h-4 sm:w-4 text-primary align-middle" />
                                <BreadcrumbPage>Préstamos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Lista de Préstamos</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Todos los préstamos registrados en el sistema</p>
                </div>
            </div>

            <Card className="w-full py-2">
                <CardContent className="px-3 sm:px-6">
                    <div className="space-y-3 sm:space-y-4">
                        <LoanHeader
                            onViewChange={handleViewChange}
                            currentView={currentView as ViewType}
                        />

                        {loading ? (
                            <LoanSkeleton />
                        ) : (
                            <>
                                <ViewComponent
                                    loans={loans}
                                    onViewDetails={handleViewDetails}
                                    onReturn={handleReturn}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />

                                {totalPages > 1 && (
                                    <div className="mt-3 sm:mt-4 flex justify-center">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {selectedLoan && (
                            <LoanReturnModal
                                isOpen={true}
                                onClose={() => setSelectedLoan(null)}
                                loan={selectedLoan}
                                onSubmit={handleReturnSubmit}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 