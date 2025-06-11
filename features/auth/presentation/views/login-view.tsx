'use client';

import { Card } from "@/components/ui/card";
import LoginForm from "../components/login-form";

export default function LoginView() {
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
        <LoginForm />
      </Card>
    </div>
  );
}