'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { sidebarItems } from '../data/sidebar-items';
import { useAuthStore } from '@/features/auth/context/auth-store';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, LogOut } from 'lucide-react';

export const DashboardSidebar = () => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const { state, setOpen } = useSidebar();

  return (
    <Sidebar className="w-64" collapsible="icon">
      <SidebarHeader className="flex justify-center border-b">
        <Avatar className="m-4 h-12 w-12">
          <AvatarImage src="" />
          <AvatarFallback
            className={state !== 'collapsed' ? 'text-primary bg-primary/10' : 'hidden'}
          >
            GIIT
          </AvatarFallback>
        </Avatar>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            {sidebarItems.map(item => (
              <div key={item.group} className="mb-2">
                <SidebarGroupLabel className="px-4 py-2 font-medium">
                  {item.group}
                </SidebarGroupLabel>

                <SidebarMenu className="w-full flex justify-between">
                  {item.items.map(subItem => (
                    <Collapsible key={subItem.title} className="w-full">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="flex w-full items-center justify-between p-4 my-1 hover:bg-primary/10 text-muted-foreground hover:text-primary"
                          onClick={() => {
                            setOpen(true);
                          }}
                        >
                          <div className="flex items-center justify-between h-full">
                            {subItem.icon && <subItem.icon size={20} className="mr-5 h-5 w-5" />}
                            <span>{subItem.title}</span>
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        {subItem.subItems.map(subSubItem => (
                          <SidebarMenuSub key={subSubItem.title}>
                            <SidebarMenuSubItem key={subSubItem.title}>
                              <SidebarMenuButton
                                onClick={() => {
                                  router.push(subSubItem.href);
                                }}
                                className="flex w-full items-center px-6 py-2 hover:bg-primary/10 text-muted-foreground hover:text-primary"
                              >
                                {subSubItem.icon && <subSubItem.icon className="mr-2 h-4 w-4" />}
                                <span>{subSubItem.title}</span>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </SidebarMenu>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              className="flex w-full items-center px-6 py-2 hover:bg-primary/10 text-muted-foreground hover:text-primary"
            >
              <LogOut />
              Cerrar sesión
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
