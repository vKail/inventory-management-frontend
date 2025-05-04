'use client';

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginFormValues, loginSchema } from "../../data/schemas/login-schema";
import { useAuth } from "../../hooks/use-login-form";

export default function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { onSubmit } = useAuth();
  
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>
          Sistema de gestión de inventario para talleres tecnológicos
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email o ID de usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="correo@universidad.edu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center w-full">
          <a href="#" className="hover:underline">
            ¿Olvidó su contraseña?
          </a>
        </div>
      </CardFooter>
    </>
  );
}