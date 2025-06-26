'use client';

import UserFormView from '@/features/users/presentation/views/user-form-view';

export default function NewUserPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <UserFormView />
    </div>
  )
}
