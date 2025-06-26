import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardNavbar } from '@/shared/components/dashboard-navbar';
import { DashboardSidebar } from '@/shared/components/dashboard-sidebar';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-screen h-screen px-3 m-3">
        <DashboardNavbar />
        {children}
        <Toaster />
      </main>
    </SidebarProvider>
  );
}
