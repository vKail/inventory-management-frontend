'use client'
import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ForbiddenPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Shield className="h-20 w-20 text-red-500" />
            <AlertCircle className="h-8 w-8 text-white absolute bottom-0 right-0 bg-red-500 rounded-full p-1" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Acceso Denegado</h2>

        <p className="text-gray-600 mb-8">
          Lo sentimos, no tienes permisos para acceder a esta página. Por favor, contacta al administrador si crees que esto es un error.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Volver
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;