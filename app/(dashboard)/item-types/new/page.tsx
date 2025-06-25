'use client'

import ItemTypeForm from '@/features/item-types/presentation/components/item-type-form'

export default function NewItemTypePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ItemTypeForm />
    </div>
  )
}
