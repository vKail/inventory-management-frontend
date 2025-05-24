import dynamic from 'next/dynamic'

const UserForm = dynamic(() => import('@/features/users/presentation/components/user-form'))

export default function Page() {
  return <UserForm />
}
