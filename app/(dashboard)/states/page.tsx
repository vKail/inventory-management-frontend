'use client'

import StateView from "@/features/states/presentation/views/state-view";

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <StateView />;
    </div>
  )
}
