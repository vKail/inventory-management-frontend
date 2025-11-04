import CreateReportView from '@/features/reports/presentation/views/CreateReportView';

export const metadata = {
  title: 'Crear reporte',
};

export default function NewReportPage() {
  return (
    <div className="p-6">
      <CreateReportView />
    </div>
  );
}
