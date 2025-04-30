'use client';
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/features/users/data/enums/user-roles.enums";
import LoginForm from "../components/login-form";

export default function LoginView() {
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);

  // Para demo solamente: cambiar rol para probar diferentes vistas
  const handleRoleChange = () => {
    if (role === UserRole.ADMIN) {
      setRole(UserRole.TEACHER);
    } else if (role === UserRole.TEACHER) {
      setRole(UserRole.STUDENT);
    } else {
      setRole(UserRole.ADMIN);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="absolute top-10 left-10">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">GITT</span>
          </div>
          <h1 className="text-2xl font-bold">Gestión de Inventario Talleres Tecnológicos</h1>
        </div>
      </div>
      
      <Card className="w-full max-w-md">
        <LoginForm role={role} />
        
        {/* Este botón solo es para simular diferentes tipos de usuario en el prototipo */}
        <div className="mt-4 text-center text-sm pb-4">
          <p className="text-muted-foreground mb-2">
            Demo: Modo de usuario actual - {" "}
            <span className="font-semibold">
              {role === UserRole.ADMIN 
                ? "Administrador" 
                : role === UserRole.TEACHER 
                ? "Docente" 
                : "Estudiante"}
            </span>
          </p>
          <Button variant="outline" size="sm" onClick={handleRoleChange}>
            Cambiar modo de usuario
          </Button>
        </div>
      </Card>
    </div>
  );
}