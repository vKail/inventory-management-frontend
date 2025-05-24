'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMaterials } from '@/features/materials/hooks/useMaterials'
import { Record } from '@/features/materials/data/interfaces/material.interface'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MaterialType } from '@/features/materials/data/interfaces/material.interface'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { use } from 'react'

export default function EditMaterialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { materials, loading, handleUpdate } = useMaterials()
  const [material, setMaterial] = useState<Record | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    materialType: MaterialType.Madera
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const foundMaterial = materials.find(m => m.id === parseInt(id))
    if (foundMaterial) {
      setMaterial(foundMaterial)
      setFormData({
        name: foundMaterial.name,
        description: foundMaterial.description,
        materialType: foundMaterial.materialType
      })
    }
  }, [materials, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await handleUpdate(parseInt(id), formData)
      toast.success('Material actualizado correctamente')
      router.push('/materials')
    } catch (error) {
      toast.error('Error al actualizar el material')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!material) {
    return <div>Material no encontrado</div>
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Material</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>


            <div className="space-y-2">
              <Label htmlFor="materialType">Tipo de Material</Label>
              <Select
                value={formData.materialType}
                onValueChange={(value) => setFormData({ ...formData, materialType: value as MaterialType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MaterialType.Madera}>Madera</SelectItem>
                  <SelectItem value={MaterialType.Metal}>Metal</SelectItem>
                  <SelectItem value={MaterialType.Plástico}>Plástico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                className="border rounded px-3 py-2 w-full min-h-[80px] text-sm resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
