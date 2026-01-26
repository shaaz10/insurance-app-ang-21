export enum ClaimStatus {
    PENDING = 'pending',
    PENDING_AGENT_REVIEW = 'pending_agent_review',
    AGENT_REVIEWED = 'agent_reviewed',
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
    agentId?: string;
    agentName?: string;
    status: string | ClaimStatus;
    type: string;
    amount: number;
    description: string;
    incidentDate: string | Date;
    filedDate: string | Date;
    reviewedDate?: string | Date;
    resolvedDate?: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface CreateClaimData {
    policyId: string;
    policyNumber: string;
    customerId: string;
    customerName: string;
    agentId?: string;
    agentName?: string;
    type: string;
    amount: number;
    description: string;
    incidentDate: string;
    status: ClaimStatus;
}

export interface UpdateClaimData {
    status: ClaimStatus;
    reviewedDate?: Date;
    resolvedDate?: Date;
}
