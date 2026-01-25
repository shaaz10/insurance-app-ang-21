import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginCredentials, RegisterData, User, UserRole } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = 'http://localhost:3000';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const userJson = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');

        if (userJson && token) {
            const user = JSON.parse(userJson);
            this.currentUserSubject.next(user);
        }
    }

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        // In a real app, this would call the backend API
        // For now, we'll simulate with JSON server
        return this.http.get<User[]>(`${this.API_URL}/users?email=${credentials.email}`)
            .pipe(
                tap(users => {
                    if (users && users.length > 0) {
                        const user = users[0];
                        const token = 'mock-jwt-token-' + user.id;
                        const authResponse: AuthResponse = { user, token };

                        localStorage.setItem('currentUser', JSON.stringify(user));
                        localStorage.setItem('token', token);
                        this.currentUserSubject.next(user);
                    }
                })
            ) as any;
    }

    register(data: RegisterData): Observable<User> {
        const newUser: Partial<User> = {
            email: data.email,
            name: data.name,
            role: data.role,
            phone: data.phone,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return this.http.post<User>(`${this.API_URL}/users`, newUser)
            .pipe(
                tap(user => {
                    const token = 'mock-jwt-token-' + user.id;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('token', token);
                    this.currentUserSubject.next(user);
                })
            );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    hasRole(role: UserRole): boolean {
        const user = this.currentUserSubject.value;
        return user ? user.role === role : false;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}
