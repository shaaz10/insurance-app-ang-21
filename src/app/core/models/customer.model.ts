export interface Customer {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: Date;
    agentId?: string;
    agentName?: string;
    policiesCount: number;
    claimsCount: number;
    totalPremium: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCustomerData {
    userId: string;
    address: string;
    dateOfBirth: Date;
    agentId?: string;
}
