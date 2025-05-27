'use client';

import UserFormView from '@/features/users/presentation/views/user-form-view';

export default function EditUserPage({ params }: { params: { id: string } }) {
  return <UserFormView params={{ id: params.id }} />;
}
