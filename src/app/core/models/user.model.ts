export enum UserRole {
    ADMIN = 'admin',
    AGENT = 'agent',
    CUSTOMER = 'customer'
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
