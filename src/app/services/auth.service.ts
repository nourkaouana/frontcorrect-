import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RegistrationRequest, AuthRequest, User, Role } from '../interfaces/user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';

interface StoredUser {
  id: number;
  role: Role;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: Role | null = null;
  private currentUser: StoredUser | null = null;

  constructor(private router: Router, private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  private convertRole(role: string): Role {
    // Convert backend string role to Role enum
    return role.toLowerCase() === 'admin' ? Role.Admin : Role.User;
  }

  private loadUserFromStorage(): void {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user: StoredUser = JSON.parse(userStr);
        this.currentUser = user;
        this.userRole = user.role;
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.logout(); // Clear potentially corrupted data
    }
  }

  register(user: RegistrationRequest): Observable<AuthResponse> {
    return this.apiService.register(user).pipe(
      tap(response => {
        if (response.success && response.user) {
          const storedUser: StoredUser = {
            id: response.user.id,
            role: this.convertRole(response.user.role),  // Convert role
            username: response.user.username
          };
          this.setUser(storedUser);
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
        }
      })
    );
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.apiService.authenticate(credentials).pipe(
      tap(response => {
        if (response.success && response.user) {
          const storedUser: StoredUser = {
            id: response.user.id,
            role: this.convertRole(response.user.role),  // Convert role
            username: response.user.username
          };
          localStorage.setItem('authToken', response.token || '');
          this.setUser(storedUser);
        }
      })
    );
  }

  setUser(user: StoredUser): void {
    try {
      const userToStore = {
        id: user.id,
        role: user.role,
        username: user.username
      };
      localStorage.setItem('user', JSON.stringify(userToStore));
      this.currentUser = userToStore;
      this.userRole = user.role;
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  getCurrentUser(): StoredUser | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken') && !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.isAuthenticated();  // Always return true if user is authenticated
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.currentUser = null;
    this.userRole = null;
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
