import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Pendiente";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "PPP 'a las' HH:mm", { locale: es }) : "Fecha inválida";
}; 