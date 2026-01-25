import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <img src="/assets/hartford-logo.png" alt="The Hartford" class="h-10 transition-transform duration-300 group-hover:scale-105">
          </a>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <a routerLink="/" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </a>
            <a routerLink="/browse-policies" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Browse Policies
            </a>
            <a routerLink="/calculators" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Calculators
            </a>
            <a *ngIf="currentUserRole === 'customer'" routerLink="/customer" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              My Dashboard
            </a>
            <a *ngIf="currentUserRole === 'agent'" routerLink="/agent" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Agent Portal
            </a>
            <a *ngIf="currentUserRole === 'admin'" routerLink="/admin" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Admin Portal
            </a>
          </nav>

          <!-- User Actions -->
          <div class="flex items-center gap-3">
            <div *ngIf="currentUserName" class="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                {{ currentUserName.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium text-gray-700">{{ currentUserName }}</span>
            </div>
            <button *ngIf="currentUserName" (click)="logout()" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
              Sign Out
            </button>
            <a *ngIf="!currentUserName" routerLink="/login" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
              Sign In
            </a>
            <a *ngIf="!currentUserName" routerLink="/register" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent implements OnInit {
  @Input() userName: string = '';
  @Input() userRole: string = '';

  currentUserName: string = '';
  currentUserRole: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Check if user is logged in from localStorage or AuthService
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserName = currentUser.name;
      this.currentUserRole = currentUser.role;
    } else {
      // Fallback to input properties
      this.currentUserName = this.userName;
      this.currentUserRole = this.userRole;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
