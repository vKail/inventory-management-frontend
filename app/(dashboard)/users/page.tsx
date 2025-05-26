import dynamic from 'next/dynamic'

const UsersView = dynamic(() => import('@/features/users/presentation/views/users-view'))

export default function Page() {
    return <UsersView />
}
