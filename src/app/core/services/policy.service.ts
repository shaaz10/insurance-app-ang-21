import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePolicyData, Policy, PolicyStatus } from '../models';

@Injectable({
    providedIn: 'root'
})
export class PolicyService {
    private readonly API_URL = 'http://localhost:3000/policies';

    constructor(private http: HttpClient) { }

    getAllPolicies(): Observable<Policy[]> {
        return this.http.get<Policy[]>(this.API_URL);
    }

    getPolicyById(id: string): Observable<Policy> {
        return this.http.get<Policy>(`${this.API_URL}/${id}`);
    }

    getPoliciesByCustomer(customerId: string): Observable<Policy[]> {
        return this.http.get<Policy[]>(`${this.API_URL}?customerId=${customerId}`);
    }

    getPoliciesByAgent(agentId: string): Observable<Policy[]> {
        return this.http.get<Policy[]>(`${this.API_URL}?agentId=${agentId}`);
    }

    createPolicy(data: CreatePolicyData): Observable<Policy> {
        const newPolicy: Partial<Policy> = {
            ...data,
            policyNumber: 'POL-' + Date.now(),
            status: PolicyStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return this.http.post<Policy>(this.API_URL, newPolicy);
    }

    updatePolicy(id: string, data: Partial<Policy>): Observable<Policy> {
        return this.http.patch<Policy>(`${this.API_URL}/${id}`, {
            ...data,
            updatedAt: new Date()
        });
    }

    deletePolicy(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    updatePolicyStatus(id: string, status: PolicyStatus): Observable<Policy> {
        return this.updatePolicy(id, { status });
    }
}
