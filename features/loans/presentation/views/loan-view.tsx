"use client";

import { useState, useEffect } from "react";
import { useLoanStore } from "../../context/loan-store";
import { LoanTableView } from "../components/loan-table-view";
import { LoanListView } from "../components/loan-list-view";
import { LoanGridView } from "../components/loan-grid-view";
import { LoanReturnModal } from "../components/loan-return-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbLink, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LoanHeader } from "../components/loan-header";
import { Pagination } from "@/components/ui/pagination";
import { Loan } from "../../data/interfaces/loan.interface";
import { LoanSkeleton } from "../components/loan-skeleton";

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

    if (error) {
        return <div>Error: {error}</div>;
    }

    const currentView = (filters as any).view || 'table';

    const ViewComponent = {
        table: LoanTableView,
        list: LoanListView,
        grid: LoanGridView
    }[currentView as ViewType];

    return (
        <div className="container mx-auto py-8">
            <div className="space-y-1 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Préstamos</h1>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Préstamos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <div className="flex flex-col h-full">
                <Card>
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
                                    conditions={mockConditions}
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 