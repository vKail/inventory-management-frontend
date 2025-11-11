import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User, CheckCircle2, Loader2 } from "lucide-react";
import { RequestorInfo } from "@/features/loans/hooks/use-loan-form";
import { useEffect, useState } from "react";

interface RequestorSectionProps {
    form: UseFormReturn<any>;
    isValidated: boolean;
    requestorInfo: RequestorInfo;
    handleValidate: () => void;
}

export default function RequestorSection({
    form,
    isValidated,
    requestorInfo,
    handleValidate
}: RequestorSectionProps) {
    const [isAutoValidating, setIsAutoValidating] = useState(false);
    const requestorId = form.watch("requestorId");

    useEffect(() => {
        // Auto-validate when DNI reaches 10 characters
        if (requestorId && requestorId.length === 10 && !isValidated && !isAutoValidating) {
            setIsAutoValidating(true);
            handleValidate();
            // Reset auto-validating state after a delay
            setTimeout(() => setIsAutoValidating(false), 1000);
        }
    }, [requestorId, isValidated, isAutoValidating, handleValidate]);

    return (
        <Card data-section="requestor">
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Left Side - Title and Description */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-sm">Solicitante</h3>
                            {isValidated && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Ingrese el DNI/Número de Identidad para buscar en el sistema
                        </p>
                    </div>

                    {/* Red Separator Line - Hidden on mobile */}
                    <div className="hidden md:block w-px bg-destructive/30" />
                    <div className="md:hidden h-px bg-destructive/30" />

                    {/* Right Side - Form */}
                    <div className="flex-1 space-y-3">
                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="requestorId"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="text-xs">Cédula / DNI</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej: 1234567890"
                                                {...field}
                                                disabled={isValidated}
                                                className="h-8 text-sm"
                                                maxLength={10}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    onClick={handleValidate}
                                    disabled={isValidated || !requestorId || requestorId.length < 10}
                                    size="sm"
                                    className="h-8"
                                >
                                    {isAutoValidating ? (
                                        <>
                                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                            <span className="hidden sm:inline">Validando</span>
                                        </>
                                    ) : (
                                        "Validar"
                                    )}
                                </Button>
                            </div>
                        </div>

                        {isValidated && (
                            <div className="space-y-2 text-xs p-3 bg-muted/50 rounded">
                                {/* Primera fila: Nombre y Tipo */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-muted-foreground mb-0.5">Nombre Completo</p>
                                        <p className="font-medium truncate">{requestorInfo.firstName} {requestorInfo.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-0.5">Tipo de Usuario</p>
                                        <p className="font-medium">{requestorInfo.type}</p>
                                    </div>
                                </div>

                                {/* Segunda fila: Email y Teléfono */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-muted-foreground mb-0.5">Email</p>
                                        <p className="font-medium truncate">{requestorInfo.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-0.5">Teléfono</p>
                                        <p className="font-medium">{requestorInfo.phone}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
