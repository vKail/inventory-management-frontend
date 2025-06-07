'use client'

import ItemTypeForm from '@/features/item-types/presentation/components/item-type-form'
import { useParams } from 'next/navigation';

export default function EditItemTypePage() {
  const params = useParams();
  const id = params?.id as string;
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ItemTypeForm id={id} />
    </div>
  );
}
