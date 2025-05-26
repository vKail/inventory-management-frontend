import UsersView from '@/features/users/presentation/views/users-view';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Usuarios | Inventory Management",
    description: "Gestión de usuarios del sistema",
};

export default function UsersPage() {
    return <UsersView />;
}
