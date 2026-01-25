export interface Agent {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    specialization: string[];
    customersCount: number;
    policiesSold: number;
    totalCommission: number;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateAgentData {
    userId: string;
    licenseNumber: string;
    specialization: string[];
}
