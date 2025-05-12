'use client'

import { PlusCircle, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useLocations } from '../hooks/use-locations'
import LocationTable from '../components/location-table'

export default function LocationsPage() {
  const {
    locations,
    loading,
    page,
    setPage,
    search,
    setSearch,
    totalPages,
  } = useLocations()

  const router = useRouter()

  const handleEdit = (id: number) => {
    router.push(`/locations/${id}/edit`)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this location?')) {
      console.log('Delete location', id)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6 px-6 md:px-12 w-full">
      <div className="mb-2 w-[1200px] min-w-[1200px] max-w-[1200px] mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground font-medium">Settings</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <MapPin className="inline mr-1 h-4 w-4 text-primary align-middle" />
              <BreadcrumbPage>Locations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-2xl font-bold tracking-tight">Location List</h2>
        <p className="text-muted-foreground">All locations registered in the system</p>
      </div>
      <Card className="w-[1200px] min-w-[1200px] max-w-[1200px] mx-auto">
        <CardHeader className="px-4 md:px-8 pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto py-2 mb-4">
              <input
                type="text"
                placeholder="Search by name, type, building or floor..."
                className="border rounded px-3 py-2 text-sm w-full md:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button onClick={() => router.push('/locations/new')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Location
            </Button>
          </div>
          <hr className="border-t border-muted" />
        </CardHeader>
        <CardContent className="px-4 md:px-8 pb-6">
          <div className="min-h-[400px] flex flex-col justify-between">
            <LocationTable
              locations={locations}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
