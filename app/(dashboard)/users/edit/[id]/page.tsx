'use client';

import React from 'react';
import UserFormView from '@/features/users/presentation/views/user-form-view';

export default function EditUserPage({ params }: { params: { id: string } }) {
  // Use React.use to unwrap the params object
  const unwrappedParams = React.use(Promise.resolve(params));
  return <UserFormView params={{ id: unwrappedParams.id }} />;
}
