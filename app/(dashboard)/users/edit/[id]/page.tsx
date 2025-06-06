'use client';

import { useParams } from 'next/navigation';
import UserFormView from '@/features/users/presentation/views/user-form-view';

export default function EditUserPage() {
  return <UserFormView/>;
}
