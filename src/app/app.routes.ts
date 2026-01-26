import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards';
import { UserRole } from './core/models';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/public/landing/landing.component').then(m => m.LandingComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/public/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/public/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'calculators',
        loadComponent: () => import('./features/public/calculators/calculators.component').then(m => m.CalculatorsComponent)
    },
    {
        path: 'browse-policies',
        loadComponent: () => import('./features/public/browse-policies/browse-policies.component').then(m => m.BrowsePoliciesComponent)
    },
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard([UserRole.ADMIN])],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'policies',
                loadComponent: () => import('./features/admin/admin-policies/admin-policies.component').then(m => m.AdminPoliciesComponent)
            },
            {
                path: 'agents',
                loadComponent: () => import('./features/admin/admin-agents/admin-agents.component').then(m => m.AdminAgentsComponent)
            },
            {
                path: 'claims',
                loadComponent: () => import('./features/admin/admin-claims/admin-claims.component').then(m => m.AdminClaimsComponent)
            }
        ]
    },
    {
        path: 'agent',
        canActivate: [authGuard, roleGuard([UserRole.AGENT])],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/agent/agent-dashboard/agent-dashboard.component').then(m => m.AgentDashboardComponent)
            },
            {
                path: 'customers',
                loadComponent: () => import('./features/agent/agent-customers/agent-customers.component').then(m => m.AgentCustomersComponent)
            },
            {
                path: 'policy-sales',
                loadComponent: () => import('./features/agent/agent-policy-sales/agent-policy-sales.component').then(m => m.AgentPolicySalesComponent)
            },
            {
                path: 'claims',
                loadComponent: () => import('./features/agent/agent-claims/agent-claims.component').then(m => m.AgentClaimsComponent)
            },
            {
                path: 'recommendations',
                loadComponent: () => import('./features/agent/agent-recommendations/agent-recommendations.component').then(m => m.AgentRecommendationsComponent)
            }
        ]
    },
    {
        path: 'customer',
        canActivate: [authGuard, roleGuard([UserRole.CUSTOMER])],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/customer/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent)
            },
            {
                path: 'policies',
                loadComponent: () => import('./features/customer/customer-policies/customer-policies.component').then(m => m.CustomerPoliciesComponent)
            },
            {
                path: 'file-claim',
                loadComponent: () => import('./features/customer/customer-file-claim/customer-file-claim.component').then(m => m.CustomerFileClaimComponent)
            },
            {
                path: 'claims',
                loadComponent: () => import('./features/customer/customer-claim-history/customer-claim-history.component').then(m => m.CustomerClaimHistoryComponent)
            },
            {
                path: 'requests',
                loadComponent: () => import('./features/customer/customer-requests/customer-requests.component').then(m => m.CustomerRequestsComponent)
            },
            {
                path: 'recommendations',
                loadComponent: () => import('./features/customer/customer-recommendations/customer-recommendations.component').then(m => m.CustomerRecommendationsComponent)
            }
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./features/public/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
