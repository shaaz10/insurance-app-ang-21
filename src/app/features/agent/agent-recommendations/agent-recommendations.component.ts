import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

interface PolicyPackage {
    name: string;
    coverage: number;
    premium: number;
    features: string[];
    recommended?: boolean;
}

@Component({
    selector: 'app-agent-recommendations',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
    templateUrl: './agent-recommendations.component.html',
    styleUrls: ['./agent-recommendations.component.scss']
})
export class AgentRecommendationsComponent implements OnInit {
    currentUser: any = null;
    request: any = null;
    requestId: string = '';
    loading = true;

    packages: PolicyPackage[] = [];
    newPackage: PolicyPackage = {
        name: '',
        coverage: 0,
        premium: 0,
        features: [''],
        recommended: false
    };
    customMessage: string = 'Based on your requirements, I have prepared the following policy recommendations.';

    constructor(
        private authService: AuthService,
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser();
        this.route.queryParams.subscribe(params => {
            this.requestId = params['requestId'];
            if (this.requestId) {
                this.loadRequest();
            }
        });
    }

    loadRequest() {
        this.loading = true;
        this.http.get<any>(`http://localhost:3000/insuranceRequests/${this.requestId}`)
            .subscribe({
                next: (request) => {
                    this.request = request;
                    this.loading = false;
                    this.initializePackages();
                },
                error: (err) => {
                    console.error('Error loading request', err);
                    this.loading = false;
                }
            });
    }

    initializePackages() {
        // Pre-populate with common packages based on insurance type
        const type = this.request.insuranceType.toLowerCase();

        if (type === 'health') {
            this.packages = [
                {
                    name: 'Basic Health Plan',
                    coverage: 300000,
                    premium: 800,
                    features: ['OPD Coverage', 'Hospitalization', 'Pre-existing after 2 years'],
                    recommended: false
                },
                {
                    name: 'Premium Health Plan',
                    coverage: 500000,
                    premium: 1200,
                    features: ['OPD Coverage', 'Hospitalization', 'Pre-existing covered', 'Maternity', 'Day Care'],
                    recommended: true
                },
                {
                    name: 'Family Floater Plan',
                    coverage: 1000000,
                    premium: 2000,
                    features: ['Family Coverage', 'OPD', 'Hospitalization', 'Pre-existing', 'Maternity', 'Critical Illness'],
                    recommended: false
                }
            ];
        } else if (type === 'auto') {
            this.packages = [
                {
                    name: 'Third Party Only',
                    coverage: 0,
                    premium: 500,
                    features: ['Third Party Liability', 'Legal Cover'],
                    recommended: false
                },
                {
                    name: 'Comprehensive',
                    coverage: 500000,
                    premium: 1200,
                    features: ['Own Damage', 'Third Party', 'Zero Depreciation', 'Roadside Assistance'],
                    recommended: true
                },
                {
                    name: 'Premium Comprehensive',
                    coverage: 1000000,
                    premium: 1800,
                    features: ['Own Damage', 'Third Party', 'Zero Depreciation', 'Engine Protection', 'NCB Protection', 'Roadside Assistance'],
                    recommended: false
                }
            ];
        } else if (type === 'life') {
            this.packages = [
                {
                    name: 'Term Life Basic',
                    coverage: 2500000,
                    premium: 500,
                    features: ['Pure Life Cover', 'Tax Benefits', '30 Year Term'],
                    recommended: false
                },
                {
                    name: 'Term Life Plus',
                    coverage: 5000000,
                    premium: 800,
                    features: ['Life Cover', 'Accidental Death Benefit', 'Tax Benefits', '30 Year Term'],
                    recommended: true
                },
                {
                    name: 'Whole Life Plan',
                    coverage: 10000000,
                    premium: 1500,
                    features: ['Lifetime Cover', 'Maturity Benefit', 'Accidental Death', 'Tax Benefits'],
                    recommended: false
                }
            ];
        }
    }

    addFeature(packageIndex: number) {
        this.packages[packageIndex].features.push('');
    }

    removeFeature(packageIndex: number, featureIndex: number) {
        this.packages[packageIndex].features.splice(featureIndex, 1);
    }

    addPackage() {
        this.packages.push({
            name: this.newPackage.name,
            coverage: this.newPackage.coverage,
            premium: this.newPackage.premium,
            features: [...this.newPackage.features],
            recommended: this.newPackage.recommended
        });

        // Reset form
        this.newPackage = {
            name: '',
            coverage: 0,
            premium: 0,
            features: [''],
            recommended: false
        };
    }

    removePackage(index: number) {
        this.packages.splice(index, 1);
    }

    sendRecommendations() {
        if (!this.currentUser) {
            alert('Session expired. Please login again.');
            this.router.navigate(['/login']);
            return;
        }

        if (this.packages.length === 0) {
            alert('Please add at least one policy package');
            return;
        }

        const recommendations = {
            requestId: this.requestId,
            agentId: this.currentUser.id,
            agentName: this.currentUser.name,
            packages: this.packages,
            notes: this.customMessage,
            createdAt: new Date().toISOString()
        };

        // Create recommendations
        this.http.post('http://localhost:3000/policyRecommendations', recommendations)
            .subscribe({
                next: () => {
                    // Update request status
                    this.http.patch(`http://localhost:3000/insuranceRequests/${this.requestId}`, {
                        status: 'recommendations_sent',
                        updatedAt: new Date().toISOString()
                    }).subscribe({
                        next: () => {
                            // Create notification for customer
                            const notification = {
                                userId: this.request.customerId,
                                title: 'New Recommendations Ready',
                                message: `Your agent ${this.currentUser.name} has prepared policy recommendations for your ${this.request.insuranceType} insurance request.`,
                                type: 'info',
                                read: false,
                                createdAt: new Date().toISOString()
                            };
                            this.http.post('http://localhost:3000/notifications', notification).subscribe();

                            alert('Policy recommendations sent successfully!');
                            this.router.navigate(['/agent']);
                        },
                        error: (err) => {
                            console.error('Error updating request', err);
                        }
                    });
                },
                error: (err) => {
                    console.error('Error sending recommendations', err);
                    alert('Failed to send recommendations. Please try again.');
                }
            });
    }

    trackByIndex(index: number): number {
        return index;
    }
}
