'use client';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { sidebarItems } from '../data/sidebar-items';
import { useAuthStore } from '@/features/auth/context/auth-store';

export const DashboardNavbar = () => {
  const params = usePathname();
  const title =
    sidebarItems
      .find(item =>
        item.items.some(subItem => subItem.subItems.some(subSubItem => subSubItem.href === params))
      )
      ?.items.find(item => item.subItems.some(subSubItem => subSubItem.href === params))?.title ||
    'Dashboard';
  const { user } = useAuthStore();

  return (
    <header className="border-b p-4 bg-background flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="relative md:block hidden">
          <Input type="search" placeholder="Buscar..." className="w-[300px]" />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
        </Button>

        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/20 text-primary">
              {user?.userName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.userName || 'Usuario'}</p>
            <p className="text-xs text-muted-foreground">{user?.userType || ''}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
