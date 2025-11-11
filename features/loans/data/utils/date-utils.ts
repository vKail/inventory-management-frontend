/**
 * Calculates the minimum and maximum dates allowed for loan returns
 * based on user type and configuration
 */
export interface DateLimits {
    minDate: Date;
    maxDate: Date;
}

export const calculateLoanDateLimits = (
    userType: string,
    allowLongLoan: boolean = false
): DateLimits => {
    const now = new Date();
    const minDate = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

    let maxDate: Date;

    if (userType === "DOCENTES") {
        // 10 days from now for teachers
        maxDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
        maxDate.setHours(23, 59, 0, 0);
    } else {
        // Students: 23:59 today (no extended loan option)
        maxDate = new Date(now);
        maxDate.setHours(23, 59, 0, 0);

        // If 23:59 today is less than 2 hours from now, use minDate as fallback
        if (maxDate < minDate) {
            maxDate = new Date(minDate);
        }
    }

    return { minDate, maxDate };
};

export const getDateValidationMessage = (
    userType: string,
    allowLongLoan: boolean = false
): string => {
    if (userType === "DOCENTES") {
        return "La fecha de devolución debe ser mínimo 2 horas y máximo 10 días desde ahora";
    }
    return "La fecha de devolución debe ser mínimo 2 horas y máximo hasta las 23:59 de hoy";
};

/**
 * Gets the default return date based on user type
 * Students: 23:59 today (or 2 hours from now if 23:59 has passed)
 * Teachers: 23:59 today (default, but can extend up to 10 days)
 */
export const getDefaultReturnDate = (userType: string = ""): Date => {
    const today2359 = new Date();
    today2359.setHours(23, 59, 0, 0);

    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // If 23:59 today is less than 2 hours from now, use 2 hours from now
    if (today2359 < twoHoursFromNow) {
        return twoHoursFromNow;
    }

    // Otherwise use 23:59 today
    return today2359;
};
