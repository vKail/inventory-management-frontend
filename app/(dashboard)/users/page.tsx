'use client';

import { Suspense } from 'react';
import UserView from '@/features/users/presentation/views/user-view';

function UsersContent() {
    return <UserView />;
}

export default function UsersPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UsersContent />
        </Suspense>
    );
}
