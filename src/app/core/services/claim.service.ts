import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Claim, ClaimStatus, CreateClaimData, UpdateClaimData } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ClaimService {
    private readonly API_URL = 'http://localhost:3000/claims';

    constructor(private http: HttpClient) { }

    getAllClaims(): Observable<Claim[]> {
        return this.http.get<Claim[]>(this.API_URL);
    }

    getClaimById(id: string): Observable<Claim> {
        return this.http.get<Claim>(`${this.API_URL}/${id}`);
    }

    getClaimsByCustomer(customerId: string): Observable<Claim[]> {
        return this.http.get<Claim[]>(`${this.API_URL}?customerId=${customerId}`);
    }

    getClaimsByPolicy(policyId: string): Observable<Claim[]> {
        return this.http.get<Claim[]>(`${this.API_URL}?policyId=${policyId}`);
    }

    createClaim(data: CreateClaimData): Observable<Claim> {
        const newClaim: Partial<Claim> = {
            ...data,
            claimNumber: 'CLM-' + Math.floor(100000 + Math.random() * 900000),
            status: data.status || ClaimStatus.PENDING_AGENT_REVIEW,
            filedDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return this.http.post<Claim>(this.API_URL, newClaim);
    }

    updateClaim(id: string, data: UpdateClaimData): Observable<Claim> {
        return this.http.patch<Claim>(`${this.API_URL}/${id}`, {
            ...data,
            updatedAt: new Date()
        });
    }

    deleteClaim(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    updateClaimStatus(id: string, status: ClaimStatus): Observable<Claim> {
        const updateData: UpdateClaimData = { status };

        if (status === ClaimStatus.UNDER_REVIEW) {
            updateData.reviewedDate = new Date();
        } else if (status === ClaimStatus.APPROVED || status === ClaimStatus.REJECTED || status === ClaimStatus.PAID) {
            updateData.resolvedDate = new Date();
        }

        return this.updateClaim(id, updateData);
    }
}
