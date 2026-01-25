export enum PolicyType {
    AUTO = 'auto',
    HOME = 'home',
    LIFE = 'life',
    BUSINESS = 'business'
}

export enum PolicyStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled'
}

export interface Policy {
    id: string;
    policyNumber: string;
    type: PolicyType;
    status: PolicyStatus;
    customerId: string;
    customerName: string;
    agentId?: string;
    agentName?: string;
    premium: number;
    coverage: number;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePolicyData {
    type: PolicyType;
    customerId: string;
    agentId?: string;
    premium: number;
    coverage: number;
    startDate: Date;
    endDate: Date;
}
