// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { EditMaterialForm } from '@/features/materials/presentation/components/EditMaterialForm';
// import { getMaterials } from '@/features/materials/services/material.service';
// import { z } from 'zod';
// import { materialSchema } from '@/features/materials/data/schemas/material.schema';

// type FormData = z.infer<typeof materialSchema>;

// export default function EditMaterialPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [material, setMaterial] = useState<FormData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMaterial = async () => {
//       try {
//         const data = setMaterial(Number(id));
//         setMaterial(data);
//       } catch (error) {
//         console.error('Error al obtener material:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchMaterial();
//   }, [id]);

//   if (loading) return <p>Cargando...</p>;
//   if (!material) return <p>Material no encontrado</p>;

//   return (
//     <EditMaterialForm
//       initialData={material}
//       materialId={Number(id)}
//       onSuccess={() => router.push('/dashboard/materials')}
//     />
//   );
// }
