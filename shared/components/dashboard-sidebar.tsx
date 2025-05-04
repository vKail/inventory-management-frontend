'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { sidebarItems } from "../data/sidebar-items";
import { useAuthStore } from "@/features/auth/context/auth-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export const DashboardSidebar = () => {
  const {logout} = useAuthStore();
  const router = useRouter();
    return (
    <Sidebar>
      <SidebarHeader>
          <Avatar className="mb-4 h-24 w-24">
            <AvatarImage src="" />
            <AvatarFallback className="bg-red-400 text-white text-2xl">
              GIIT
            </AvatarFallback>
          </Avatar>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>  
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button className="mb-10" onClick={() => 
        {
          logout();
          router.push("/login");
        }}>
        Cerrar sesión</Button>
      </SidebarFooter>
    </Sidebar>
    );
}