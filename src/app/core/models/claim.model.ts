export enum ClaimStatus {
    PENDING = 'pending',
    UNDER_REVIEW = 'under_review',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    PAID = 'paid'
}

export interface Claim {
    id: string;
    claimNumber: string;
    policyId: string;
    policyNumber: string;
    customerId: string;
    customerName: string;
    status: ClaimStatus;
    amount: number;
    description: string;
    incidentDate: Date;
    filedDate: Date;
    reviewedDate?: Date;
    resolvedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateClaimData {
    policyId: string;
    amount: number;
    description: string;
    incidentDate: Date;
}

export interface UpdateClaimData {
    status: ClaimStatus;
    reviewedDate?: Date;
    resolvedDate?: Date;
}
