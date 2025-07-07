import { useConditionStore } from "@/features/conditions/context/condition-store";
import { useEffect, useState } from "react";
import { Loan } from "@/features/loans/data/interfaces/loan.interface";

interface LoanDetailsViewProps {
    loan: Loan;
}

export function LoanDetailsView({ loan }: LoanDetailsViewProps) {
    const { conditions, getConditions } = useConditionStore();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        getConditions().then(() => setReady(true));
    }, [getConditions]);

    // Helper para buscar el nombre de la condición
    const getConditionName = (id: number | string | undefined) => {
        if (!id) return 'N/A';
        const found = conditions.find(c => c.id === id.toString());
        return found ? found.name : id;
    };

    if (!ready) return <div>Cargando condiciones...</div>;

    return (
        <div>
            <h2>Detalles del Préstamo #{loan.loanCode}</h2>
            <ul>
                {loan.loanDetails.map((detail, idx) => (
                    <li key={idx}>
                        <div>
                            <strong>Item ID:</strong> {detail.itemId}
                        </div>
                        <div>
                            <strong>Condición de salida:</strong> {getConditionName(detail.exitConditionId)}
                        </div>
                        {/* Puedes agregar más campos aquí según lo necesites */}
                    </li>
                ))}
            </ul>
        </div>
    );
}
