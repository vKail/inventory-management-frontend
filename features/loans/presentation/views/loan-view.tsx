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
        setFilters
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
        router.push('/loans');
    };

    if (error) {
        return (
            <div className="space-y-4">
                {/* Breadcrumbs y título */}
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <Breadcrumb className="mb-6">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <span className="text-muted-foreground font-medium">Operaciones</span>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <Handshake className="inline mr-1 h-4 w-4 text-primary align-middle" />
                                    <BreadcrumbPage>Préstamos</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <h2 className="text-2xl font-bold tracking-tight">Lista de Préstamos</h2>
                        <p className="text-muted-foreground">Todos los préstamos registrados en el sistema</p>
                    </div>
                </div>

                <Card className="w-full">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Error al cargar los préstamos
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md">
                                {error || "Ha ocurrido un error inesperado al cargar los préstamos. Por favor, inténtalo de nuevo."}
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleRetry}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Reintentar
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleGoBack}
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
        <div className="space-y-4">
            {/* Breadcrumbs y título */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <span className="text-muted-foreground font-medium">Operaciones</span>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Handshake className="inline mr-1 h-4 w-4 text-primary align-middle" />
                                <BreadcrumbPage>Préstamos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h2 className="text-2xl font-bold tracking-tight">Lista de Préstamos</h2>
                    <p className="text-muted-foreground">Todos los préstamos registrados en el sistema</p>
                </div>
            </div>

            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="space-y-4">
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
                                    <div className="mt-4 flex justify-center">
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