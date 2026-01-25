import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models';
import { AuthService } from '../services';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        const currentUser = authService.getCurrentUser();

        if (!currentUser) {
            router.navigate(['/login']);
            return false;
        }

        if (allowedRoles.includes(currentUser.role)) {
            return true;
        }

        // Redirect to appropriate dashboard based on role
        switch (currentUser.role) {
            case UserRole.ADMIN:
                router.navigate(['/admin']);
                break;
            case UserRole.AGENT:
                router.navigate(['/agent']);
                break;
            case UserRole.CUSTOMER:
                router.navigate(['/customer']);
                break;
            default:
                router.navigate(['/']);
        }

        return false;
    };
};
