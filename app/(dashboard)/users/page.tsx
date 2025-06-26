'use client';

import { Suspense } from 'react';
import UserView from '@/features/users/presentation/views/user-view';

function UsersContent() {
    return <UserView />;
}

export default function UsersPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Suspense fallback={<div>Loading...</div>}>
                <UsersContent />
            </Suspense>
        </div>
    );
}
