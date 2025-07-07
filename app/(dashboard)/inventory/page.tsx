'use client';

import { InventoryView } from "@/features/inventory/presentation/views/inventory-view";

export default function InventoryPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <InventoryView />
    </div>
  )
} 