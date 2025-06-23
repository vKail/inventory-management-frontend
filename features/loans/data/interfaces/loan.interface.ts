// =============================================================================
// LOAN INTERFACES
// =============================================================================

/**
 * Loan Status Enum
 * Defines all possible states a loan can be in
 */
export enum LoanStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    DELIVERED = "DELIVERED",
    RETURNED = "RETURNED",
    OVERDUE = "OVERDUE"
}

// =============================================================================
// CORE LOAN INTERFACES
// =============================================================================

/**
 * Loan Detail Interface (Response from API)
 * Represents a loan detail item as returned by the backend
 */
export interface LoanDetail {
    id: number;
    loanId: number;
    itemId: number;
    exitConditionId: number;
    returnConditionId?: number;
    exitObservations?: string;
    returnObservations?: string;
    quantity?: number;
    item?: {
        id: number;
        code: string;
        name: string;
        identifier: string;
    };
}

/**
 * Loan Detail Create Interface
 * Represents the data needed to create a new loan detail
 */
export interface LoanDetailCreate {
    itemId: number;
    exitConditionId: number;
    exitObservations?: string;
    quantity?: number;
}

/**
 * Main Loan Interface (Response from API)
 * Represents a complete loan as returned by the backend
 */
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

/**
 * Loan Create Interface
 * Represents the data needed to create a new loan
 */
export interface LoanCreate {
    requestorId: string;
    scheduledReturnDate: string;
    reason: string;
    notes: string;
    blockBlackListed: boolean;
    loanDetails: LoanDetailCreate[];
}

// =============================================================================
// LOAN RETURN INTERFACES
// =============================================================================

/**
 * Returned Item Interface
 * Represents an item being returned as part of a loan return
 */
export interface ReturnedItem {
    loanDetailId: string;
    returnConditionId: number;
    returnObservations: string;
}

/**
 * Loan Return Interface
 * Represents the data needed to return a loan
 */
export interface LoanReturn {
    loanId: number;
    actualReturnDate: string;
    returnedItems: ReturnedItem[];
    notes: string;
}

// =============================================================================
// REQUESTOR INTERFACES
// =============================================================================

/**
 * Requestor Information Interface
 * Represents the information of a loan requestor
 */
export interface RequestorInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
}

// =============================================================================
// API RESPONSE INTERFACES
// =============================================================================

/**
 * Generic API Response Interface
 * Standard response structure for all API calls
 */
export interface ApiResponse<T> {
    success: boolean;
    message: {
        content: string[];
        displayable: boolean;
    };
    data: T;
}

/**
 * Paginated Response Interface
 * Standard structure for paginated API responses
 */
export interface PaginatedResponse<T> {
    total: number;
    limit: number;
    page: number;
    pages: number;
    records: T[];
}

/**
 * Loan Response Interface
 * Specific response structure for loan-related API calls
 */
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

// =============================================================================
// STORE & SERVICE INTERFACES
// =============================================================================

/**
 * Loan Filters Interface
 * Represents the filters that can be applied to loan queries
 */
export interface LoanFilters {
    search?: string;
    status?: string;
    view?: 'table' | 'grid' | 'list';
}

/**
 * Loan State Interface
 * Represents the state structure for the loan store
 */
export interface LoanState {
    loans: Loan[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    selectedLoan: Loan | null;
    filters: LoanFilters;
    getLoans: (page?: number, limit?: number) => Promise<void>;
    getLoanById: (id: number) => Promise<void>;
    getLoanHistoryByDni: (dni: string) => Promise<Loan[]>;
    createLoan: (loan: LoanCreate) => Promise<void>;
    returnLoan: (loanId: number, loanReturn: LoanReturn) => Promise<void>;
    setSelectedLoan: (loan: Loan | null) => void;
    setPage: (page: number) => void;
    setFilters: (filters: Partial<LoanFilters>) => void;
    refreshTable: () => Promise<void>;
}

/**
 * Loan Service Interface
 * Defines the contract for loan service operations
 */
export interface LoanServiceProps {
    getAll: (queryString: string) => Promise<ApiResponse<PaginatedResponse<Loan>>>;
    getById: (id: number) => Promise<Loan | undefined>;
    getHistoryByDni: (dni: string) => Promise<Loan[]>;
    create: (loan: LoanCreate) => Promise<any>;
    return: (loanReturn: LoanReturn) => Promise<any>;
} 