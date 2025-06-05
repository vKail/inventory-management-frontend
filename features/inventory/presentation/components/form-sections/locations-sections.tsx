"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import LoaderComponent from "@/shared/components/ui/Loader";
import { useLocationStore } from "@/features/locations/context/location-store";
import { useUserStore } from "@/features/users/context/user-store";
import { useCertificateStore } from "@/features/certificates/context/certificate-store";
import { useEffect } from "react";
import { RegisterFormData } from "../../../data/schemas/register-schema";

interface LocationsSectionsProps {
    form: UseFormReturn<RegisterFormData>;
}

export const LocationsSections = ({ form }: LocationsSectionsProps) => {
    const { getLocations, locations, isLoading } = useLocationStore();
    const { users, loading: loadingUsers } = useUserStore();
    const { getCertificates, certificates, isLoading: loadingCertificates } = useCertificateStore();

    useEffect(() => {
        getLocations();
        getCertificates();
    }, [getLocations, getCertificates]);

    if (isLoading.fetch || loadingUsers || loadingCertificates.fetch) {
        return <LoaderComponent rows={3} columns={2} />;
    }

    return (
        <Card>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 p-6 border-r">
                    <h3 className="text-lg font-semibold mb-2">Información General</h3>
                    <p className="text-sm text-muted-foreground">
                        Detalles generales y clasificación del producto.
                    </p>
                </div>
                <div className="col-span-8 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="locationId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ubicación</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value ? String(field.value) : undefined}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una ubicación" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((location) => (
                                                    <SelectItem
                                                        key={location.id}
                                                        value={String(location.id)}
                                                    >
                                                        {location.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="custodianId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Custodio</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value ? String(field.value) : undefined}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione custodio" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((user) => (
                                                    <SelectItem
                                                        key={user.id}
                                                        value={String(user.id)}
                                                    >
                                                        {user.person.firstName} {user.person.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="certificateId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numero de Acta</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value ? String(field.value) : undefined}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione Acta" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {certificates.map((certificate) => (
                                                    <SelectItem
                                                        key={certificate.id}
                                                        value={String(certificate.id)}
                                                    >
                                                        {`${certificate.number} - ${certificate.type}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}; 