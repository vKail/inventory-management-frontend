'use client';

import { Suspense } from 'react';
import UserFormView from '@/features/users/presentation/views/user-form-view';

function EditUserContent() {
  return <UserFormView />;
}

export default function EditUserPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditUserContent />
    </Suspense>
  );
}
