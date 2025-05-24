'use client'

import { User } from '../../data/interfaces/user.interface'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  users: User[]
  onDelete: (id: string) => void
}

export default function UserTable({ users, onDelete }: Props) {
  const router = useRouter()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Carrera</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.userName}</TableCell>
            <TableCell>{user.career}</TableCell>
            <TableCell>{user.person.firstName}</TableCell>
            <TableCell>{user.person.lastName}</TableCell>
            <TableCell>{user.person.email}</TableCell>
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
                  onClick={() => onDelete(user.id.toString())}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
