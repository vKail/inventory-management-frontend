'use client';

import ItemTypeTable from '@/features/item-types/presentation/components/item-type-table';

export default function ItemTypesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ItemTypeTable />
    </div>
  )
}
