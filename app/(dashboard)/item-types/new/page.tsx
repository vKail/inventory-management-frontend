'use client'

import ItemTypeFormView from '@/features/item-types/presentation/views/item-type-form-view'

export default function NewItemTypePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ItemTypeFormView />
    </div>
  )
}
