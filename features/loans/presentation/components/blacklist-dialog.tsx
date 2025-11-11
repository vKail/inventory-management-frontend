import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BlacklistDialogProps {
    open: boolean;
    onContinue: () => void;
    onCancel: () => void;
}

export function BlacklistDialog({ open, onContinue, onCancel }: BlacklistDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onCancel}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                        Usuario en Lista Negra
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                        <div className="space-y-3">
                            <p className="text-base">
                                El usuario no puede hacer préstamos porque está en la lista negra, ¿desea continuar?
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>Nota:</strong> Al continuar, se procederá con el préstamo a pesar de que el usuario se encuentra en la lista negra.
                                </p>
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel
                        onClick={onCancel}
                        className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-900"
                    >
                        Cancelar Préstamo
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onContinue}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                    >
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
