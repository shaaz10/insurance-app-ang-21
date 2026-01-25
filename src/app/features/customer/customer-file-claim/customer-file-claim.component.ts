import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Policy {
    id: number;
    policyNumber: string;
    type: string;
    coverageAmount: number;
    status: string;
}

interface ClaimData {
    policyId: number | null;
    type: string;
    incidentDate: string;
    amount: number;
    description: string;
}

@Component({
    selector: 'app-customer-file-claim',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './customer-file-claim.component.html'
})
export class CustomerFileClaimComponent implements OnInit {
    steps = ['Select Policy', 'Claim Details', 'Documents', 'Review'];
    currentStep = 0;

    policies: Policy[] = [];
    uploadedFiles: any[] = [];
    showSuccessModal = false;
    claimNumber = '';

    claimData: ClaimData = {
        policyId: null,
        type: '',
        incidentDate: '',
        amount: 0,
        description: ''
    };

    constructor(private router: Router) { }

    ngOnInit() {
        this.loadPolicies();
    }

    loadPolicies() {
        // Sample active policies
        this.policies = [
            {
                id: 1,
                policyNumber: 'POL-2024-001',
                type: 'Health',
                coverageAmount: 50000,
                status: 'Active'
            },
            {
                id: 2,
                policyNumber: 'POL-2024-002',
                type: 'Auto',
                coverageAmount: 25000,
                status: 'Active'
            }
        ];
    }

    selectPolicy(policy: Policy) {
        this.claimData.policyId = policy.id;
    }

    getSelectedPolicy(): Policy | undefined {
        return this.policies.find(p => p.id === this.claimData.policyId);
    }

    canProceed(): boolean {
        switch (this.currentStep) {
            case 0:
                return this.claimData.policyId !== null;
            case 1:
                return !!(this.claimData.type && this.claimData.incidentDate &&
                    this.claimData.amount && this.claimData.description);
            case 2:
                return true; // Documents are optional
            case 3:
                return true;
            default:
                return false;
        }
    }

    nextStep() {
        if (this.canProceed() && this.currentStep < this.steps.length - 1) {
            this.currentStep++;
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    submitClaim() {
        // Generate claim number
        this.claimNumber = Math.floor(100000 + Math.random() * 900000).toString();

        // Show success modal
        this.showSuccessModal = true;

        // Reset form after delay
        setTimeout(() => {
            this.router.navigate(['/customer/claims']);
        }, 3000);
    }
}
