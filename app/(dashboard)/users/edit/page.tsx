'use client';

import UserFormView from '@/features/users/presentation/views/user-form-view';

export default function EditUserPage() {
  return <UserFormView params={{ id: 'edit' }} />;
}
