'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchUsers, changeUserStatus } from '../../services/user.service'

import { User } from '../../data/interfaces/user.interface'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function UsersView() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUsers()
        setUsers(data.records)
        // setUsers(data.records.filter(user => user.status === 'ACTIVE'))

      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = (id: string) => {
    const toastId = toast('¿Deseas desactivar este usuario?', {
      action: {
        label: 'Desactivar',
        onClick: async () => {
          try {
            await changeUserStatus(id, 'INACTIVE')
            setUsers(prev => prev.filter(u => u.id.toString() !== id))
            toast.success('Usuario desactivado exitosamente')
          } catch (error) {
            toast.error('No se pudo desactivar el usuario')
            console.error(error)
          } finally {
            toast.dismiss(toastId)
          }
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => toast.dismiss(toastId),
      },
    })
  }

  return (
    <div className="flex flex-col items-center px-6 w-full">
      <div className="w-full max-w-[1200px]">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Usuarios</CardTitle>
            <Button onClick={() => router.push('/users/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Cargando...</TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Usuarios no encontrando</TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.career}</TableCell>
                      <TableCell>{user.person.firstName}</TableCell>
                      <TableCell>{user.person.lastName}</TableCell>
                      <TableCell>{user.person.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/users/new?id=${user.id}`)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user.id.toString())}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
