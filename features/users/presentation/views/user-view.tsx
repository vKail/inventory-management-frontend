"use client";

import { useState, useEffect } from 'react';
import { UserTable } from '../components/user-table';
import { UserPagination } from '../components/user-pagination';
import { Users } from 'lucide-react';
import { useUserStore } from '../../context/user-store';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function UserView() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const { getUsers } = useUserStore();

    useEffect(() => {
        const loadUsers = async () => {
            const response = await getUsers(currentPage, itemsPerPage);
            setTotalPages(response.pages);
        };
        loadUsers();
    }, [currentPage, getUsers]);

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="mb-6">
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">
                                Administración
                            </span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Users className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbPage>Usuarios</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="space-y-4">
                <UserTable
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                />
                <UserPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
} 