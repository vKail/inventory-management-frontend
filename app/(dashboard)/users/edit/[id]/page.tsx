'use client';

import { Suspense } from 'react';
import UserFormView from '@/features/users/presentation/views/user-form-view';

function EditUserContent() {
  return <UserFormView />
}

export default function EditUserPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Suspense fallback={<div>Loading...</div>}>
        <EditUserContent />
      </Suspense>
    </div>
  );
}
