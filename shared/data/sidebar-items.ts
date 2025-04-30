import { UserRole } from "@/features/users/data/enums/user-roles.enums";
import { Barcode, Home, PackageSearch, User, Users } from "lucide-react";

export const sidebarItems = [
    {
        title: "Inventario",
        icon: PackageSearch,
        roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
        href: "/inventory",
    },
    {
        title: "Registrar productos",
        icon: Barcode,
        roles: [UserRole.ADMIN],
        href: "/inventory/add-product",
    },
    {
        title: "Prestamos",
        icon: Users,
        roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
        href: "/loans",
    },
]