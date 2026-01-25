import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div class="px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h1 class="text-xl font-bold text-gray-900">Agent Dashboard</h1>
                  <p class="text-sm text-gray-600">Manage customers and applications</p>
                </div>
              </div>
              <button (click)="logout()" class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                Sign Out
              </button>
            </div>
          </div>
        </header>
  
        <main class="px-4 sm:px-6 lg:px-8 py-8">
          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-medium transition-all animate-fade-in">
              <div class="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="text-2xl font-bold text-gray-900 mb-1">{{ assignedRequests.length }}</div>
              <div class="text-sm text-gray-600">Assigned Requests</div>
            </div>
  
            <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-medium transition-all animate-fade-in" style="animation-delay: 0.1s;">
              <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="text-2xl font-bold text-gray-900 mb-1">{{ pendingApplications.length }}</div>
              <div class="text-sm text-gray-600">Pending Applications</div>
            </div>
  
            <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-medium transition-all animate-fade-in" style="animation-delay: 0.2s;">
              <div class="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-2xl font-bold text-gray-900 mb-1">{{ pendingClaims.length }}</div>
              <div class="text-sm text-gray-600">Claims to Review</div>
            </div>
  
            <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-medium transition-all animate-fade-in" style="animation-delay: 0.3s;">
              <div class="h-12 w-12 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                <svg class="h-6 w-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-2xl font-bold text-gray-900 mb-1">₹{{ totalCommission | number }}</div>
              <div class="text-sm text-gray-600">Total Commission</div>
            </div>
          </div>
  
          <!-- Assigned Requests -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 animate-fade-in-up">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-900">Assigned Insurance Requests</h2>
              <p class="text-sm text-gray-600">Contact customers and help them choose the right plan</p>
            </div>
            <div class="overflow-x-auto">
              <table class="table-modern">
                <thead>
                  <tr>
                    <th>Request #</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Insurance Type</th>
                    <th>Coverage</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (request of assignedRequests; track request.requestNumber) {
                    <tr>
                      <td class="font-semibold text-primary-600">{{ request.requestNumber }}</td>
                      <td>{{ request.customerName }}</td>
                      <td>{{ request.customerPhone }}</td>
                      <td><span class="badge badge-info">{{ request.insuranceType }}</span></td>
                      <td class="font-semibold">₹{{ request.requestedCoverage | number }}</td>
                      <td><span class="badge badge-warning">{{ request.status }}</span></td>
                      <td>
                        <a [routerLink]="['/agent/recommendations']" [queryParams]="{requestId: request.id}" 
                           class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                          </svg>
                          Send Recommendations
                        </a>
                      </td>
                    </tr>
                  }
                  @if (assignedRequests.length === 0) {
                    <tr>
                      <td colspan="7" class="text-center py-8 text-gray-500">No assigned requests</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
  
          <!-- Pending Claims -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in-up">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-bold text-gray-900">Claims to Review</h2>
              <p class="text-sm text-gray-600">Review claims and forward to admin</p>
            </div>
            <div class="overflow-x-auto">
              <table class="table-modern">
                <thead>
                  <tr>
                    <th>Claim #</th>
                    <th>Customer</th>
                    <th>Policy #</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Filed Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (claim of pendingClaims; track claim.claimNumber) {
                    <tr>
                      <td class="font-semibold text-primary-600">{{ claim.claimNumber }}</td>
                      <td>{{ claim.customerName }}</td>
                      <td>{{ claim.policyNumber }}</td>
                      <td><span class="badge badge-info">{{ claim.type }}</span></td>
                      <td class="font-semibold">₹{{ claim.amount | number }}</td>
                      <td>{{ claim.filedDate | date:'MMM d, y' }}</td>
                      <td>
                        <button (click)="reviewClaim(claim)" class="btn-primary text-sm py-1 px-3">
                          Review
                        </button>
                      </td>
                    </tr>
                  }
                  @if (pendingClaims.length === 0) {
                    <tr>
                      <td colspan="7" class="text-center py-8 text-gray-500">No pending claims</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </main>
  
        <!-- Review Claim Modal -->
        @if (showReviewModal) {
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div class="bg-white rounded-2xl max-w-2xl w-full animate-scale-in">
              <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-xl font-bold text-gray-900">Review Claim</h2>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p class="text-sm text-gray-600">Claim #</p>
                    <p class="font-semibold">{{ selectedClaim?.claimNumber }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Customer</p>
                    <p class="font-semibold">{{ selectedClaim?.customerName }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Amount</p>
                    <p class="font-semibold">₹{{ selectedClaim?.amount | number }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Type</p>
                    <p class="font-semibold">{{ selectedClaim?.type }}</p>
                  </div>
                </div>
  
                <div class="mb-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Agent Notes</label>
                  <textarea [(ngModel)]="agentNotes" rows="4" class="input-modern" placeholder="Add your verification notes and recommendation..."></textarea>
                </div>
  
                <div class="flex gap-3">
                  <button (click)="forwardToAdmin()" class="btn-primary flex-1">
                    Forward to Admin
                  </button>
                  <button (click)="showReviewModal = false" class="btn-outline flex-1">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
  `
})
export class AgentDashboardComponent implements OnInit {
  private apiUrl = 'http://localhost:3000';

  assignedRequests: any[] = [];
  pendingApplications: any[] = [];
  pendingClaims: any[] = [];
  totalCommission = 125000;

  showReviewModal = false;
  selectedClaim: any = null;
  agentNotes = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Load assigned requests for this agent
    this.http.get<any[]>(`${this.apiUrl}/insuranceRequests?agentId=${currentUser.id}`)
      .subscribe(data => {
        this.assignedRequests = data.filter(r => r.status === 'agent_assigned' || r.status === 'recommendations_sent');
      });

    // Load pending claims for this agent
    this.http.get<any[]>(`${this.apiUrl}/claims?agentId=${currentUser.id}&status=pending_agent_review`)
      .subscribe(data => {
        this.pendingClaims = data;
      });
  }

  reviewClaim(claim: any) {
    this.selectedClaim = claim;
    this.agentNotes = '';
    this.showReviewModal = true;
  }

  forwardToAdmin() {
    if (!this.selectedClaim) return;

    const updatedClaim = {
      ...this.selectedClaim,
      status: 'agent_reviewed',
      agentNotes: this.agentNotes,
      agentReviewDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.http.put(`${this.apiUrl}/claims/${this.selectedClaim.id}`, updatedClaim)
      .subscribe(() => {
        this.showReviewModal = false;
        this.loadData();
        alert('Claim forwarded to admin for approval!');
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
