import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
    selector: 'app-customer-recommendations',
    standalone: true,
    imports: [CommonModule, NavbarComponent, RouterLink],
    templateUrl: './customer-recommendations.component.html',
    animations: [
        trigger('fadeInUp', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ]),
        trigger('staggerFade', [
            transition(':enter', [
                query('div', [
                    style({ opacity: 0, transform: 'translateY(20px)' }),
                    stagger('100ms', [
                        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
                    ])
                ], { optional: true })
            ])
        ])
    ]
})
export class CustomerRecommendationsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private http = inject(HttpClient);

    requestId: string | null = null;
    request: any = null;
    recommendation: any = null;
    loading = true;
    acceptingPolicy = false;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.requestId = params['requestId'];
            if (this.requestId) {
                this.loadData();
            } else {
                // Handle error or redirect
                this.router.navigate(['/customer/requests']);
            }
        });
    }

    loadData() {
        this.loading = true;

        // Load request details
        this.http.get<any>(`http://localhost:3000/insuranceRequests/${this.requestId}`)
            .subscribe({
                next: (req) => {
                    this.request = req;
                    this.loadRecommendations();
                },
                error: (err) => {
                    console.error('Error loading request', err);
                    this.loading = false;
                }
            });
    }

    loadRecommendations() {
        // In json-server, we search by requestId. Note: JSON server might return an array for filtering
        this.http.get<any[]>(`http://localhost:3000/policyRecommendations?requestId=${this.requestId}`)
            .subscribe({
                next: (recs) => {
                    if (recs && recs.length > 0) {
                        // Get the filtering result. Assuming the first one is the correct one.
                        this.recommendation = recs[0];
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading recommendations', err);
                    this.loading = false;
                }
            });
    }

    selectPolicy(pkg: any) {
        if (confirm(`Are you sure you want to proceed with the "${pkg.name}" plan? This will initiate the application process.`)) {
            this.acceptingPolicy = true;

            // Update request status
            const updatedRequest = {
                ...this.request,
                status: 'application_in_progress',
                selectedPolicy: pkg,
                updatedAt: new Date().toISOString()
            };

            this.http.put(`http://localhost:3000/insuranceRequests/${this.requestId}`, updatedRequest)
                .subscribe({
                    next: () => {
                        // Create a new active policy (mocking this step for now, or we could just leave it as request update)
                        // Ideally we might want to post to a 'applications' endpoint or similar.
                        // For now, let's just create a mock policy that is 'pending_approval' or similar if we have a policies endpoint.
                        // But based on the flow, updating the request status is the key step.

                        // Create a notification or just redirect
                        alert('Excellent choice! Your application is now in progress.');
                        this.router.navigate(['/customer/requests']);
                    },
                    error: (err) => {
                        console.error('Error selecting policy', err);
                        this.acceptingPolicy = false;
                        alert('Something went wrong. Please try again.');
                    }
                });
        }
    }

    getCoverageAmount(amount: number): string {
        if (amount === -1) return 'Unlimited'; // Example for specific code
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
}
