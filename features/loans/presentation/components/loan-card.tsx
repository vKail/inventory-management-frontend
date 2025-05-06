"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loan } from "@/features/loans/data/interfaces/loan.interface";

interface LoanCardProps {
  loan: Loan;
  onReturnClick?: (loan: Loan) => void;
}

export default function LoanCard({ loan, onReturnClick }: LoanCardProps) {
  const { product, user } = loan;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "returned":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue = loan.status === "active" && new Date() > new Date(loan.dueDate);
  const displayStatus = isOverdue ? "overdue" : loan.status;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{product?.name || "Producto"}</h3>
            <p className="text-muted-foreground text-sm">Código: {product?.barcode || "N/A"}</p>
          </div>
          <Badge className={getStatusColor(displayStatus)} variant="outline">
            {displayStatus === "active"
              ? "Activo"
              : displayStatus === "returned"
              ? "Devuelto"
              : "Vencido"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="py-2 flex-grow">
        <div className="grid gap-3">
          <div className="grid gap-1">
            <span className="text-sm text-muted-foreground">Usuario:</span>
            <span className="text-sm font-medium">
              {user?.name || "Usuario"} {user?.studentId ? `(${user.studentId})` : ""}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-sm text-muted-foreground block">Fecha de inicio:</span>
              <span className="text-sm font-medium">
                {format(new Date(loan.startDate), "dd/MM/yyyy")}
              </span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground block">Fecha de devolución:</span>
              <span className={`text-sm font-medium ${isOverdue ? "text-red-600" : ""}`}>
                {format(new Date(loan.dueDate), "dd/MM/yyyy")}
              </span>
            </div>
          </div>

          {loan.notes && (
            <div>
              <span className="text-sm text-muted-foreground block">Notas:</span>
              <p className="text-sm line-clamp-2">{loan.notes}</p>
            </div>
          )}

          {loan.returnDate && (
            <div>
              <span className="text-sm text-muted-foreground block">Devuelto el:</span>
              <span className="text-sm font-medium">
                {format(new Date(loan.returnDate), "dd/MM/yyyy")}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {loan.status === "active" && (
        <CardFooter className="pt-2">
          <Button onClick={() => onReturnClick?.(loan)} className="w-full">
            Registrar Devolución
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
