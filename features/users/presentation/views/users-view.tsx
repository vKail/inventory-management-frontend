'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserService } from '../../services/user.service'
import { UserTable } from '../components/user-table'
import { UserPagination } from '../components/user-pagination'
import { Users } from 'lucide-react'
import { useUserStore } from '../../context/user-store'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { toast } from 'sonner'

export default function UsersView() {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  const { getUsers } = useUserStore()

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getUsers(currentPage, itemsPerPage)
        if (response) {
          setTotalPages(response.pages)
        }
      } catch (error) {
        console.error('Error loading users:', error)
        toast.error('Error al cargar los usuarios')
      }
    }
    loadUsers()
  }, [currentPage, getUsers, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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
        {totalPages > 1 && (
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}
