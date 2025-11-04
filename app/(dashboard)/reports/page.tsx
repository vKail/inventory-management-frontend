import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';

export const metadata = {
    title: 'Reportes',
};

export default function ReportsPage() {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Reportes</h1>
                <Link href="/reports/new">
                    <Button>Crear nuevo reporte</Button>
                </Link>
            </div>

            <p className="text-sm text-muted-foreground">Aquí podrás crear nuevos reportes. Por ahora el historial no está implementado.</p>
        </div>
    );
}
