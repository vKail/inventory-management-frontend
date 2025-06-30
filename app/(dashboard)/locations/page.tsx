'use client';

import { Suspense } from 'react';
import LocationView from '@/features/locations/presentation/views/location-view';

function LocationsContent() {
    return (
        <div>
            <LocationView />
        </div>
    );
}

export default function LocationsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Suspense fallback={<div>Loading...</div>}>
                <LocationsContent />
            </Suspense>
        </div>
    );
} 