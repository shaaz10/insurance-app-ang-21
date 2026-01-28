import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ThemeService } from '../../../core/services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  @Input() userName: string = '';
  @Input() userRole: string = '';

  currentUserName: string = '';
  currentUserRole: string = '';
  notifications: any[] = [];
  unreadCount: number = 0;

  private cdr=inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  public themeService = inject(ThemeService);

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
      this.loadNotifications(currentUser.id);
    } else {
      // Fallback to input properties
      this.currentUserName = this.userName;
      this.currentUserRole = this.userRole;
    }
  }

  loadNotifications(userId: string) {
    this.http.get<any[]>(`http://localhost:3000/notifications?userId=${userId}&_sort=createdAt&_order=desc&_limit=5`)
      .subscribe(data => {
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.read).length;
      });
  }

  logout() {
    this.authService.logout();
    this.cdr.detectChanges();
    this.router.navigate(['/']);
  }
}
