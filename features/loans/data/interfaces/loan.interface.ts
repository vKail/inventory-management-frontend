export enum LoanStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    DELIVERED = "DELIVERED",
    RETURNED = "RETURNED",
    OVERDUE = "OVERDUE"
}

export interface LoanDetail {
    itemId: number;
    exitConditionId: number;
    exitObservations?: string;
    item?: {
        id: number;
        code: string;
        name: string;
        identifier: string;
    };
}

export interface Loan {
    id: number;
    loanCode: string;
    requestDate: string;
    approvalDate: string;
    deliveryDate: string;
    scheduledReturnDate: string;
    actualReturnDate: string;
    status: LoanStatus;
    requestorId: number;
    approverId: number;
    reason: string;
    associatedEvent: string;
    externalLocation: string;
    notes: string;
    responsibilityDocument: string;
    reminderSent: boolean;
    loanDetails: LoanDetail[];
}

export interface LoanReturn {
    loanId: number;
    actualReturnDate: string;
    returnedItems: ReturnedItem[];
    notes: string;
}

export interface ReturnedItem {
    loanDetailId: string;
    returnConditionId: number;
    returnObservations: string;
}

export interface RequestorInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
}

export interface LoanCreate {
    requestorId: string;
    scheduledReturnDate: string;
    reason: string;
    notes: string;
    blockBlackListed: boolean;
    loanDetails: LoanDetail[];
}

export interface LoanResponse {
    success: boolean;
    message: {
        content: string[];
        displayable: boolean;
    };
    data: {
        total: number;
        limit: number;
        page: number;
        pages: number;
        records: Loan[];
    };
}

export interface PaginatedResponse<T> {
    total: number;
    limit: number;
    page: number;
    pages: number;
    records: T[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: {
        content: string[];
        displayable: boolean;
    };
    data: T;
} 