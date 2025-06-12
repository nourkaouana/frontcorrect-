import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from '../../interfaces/auth-response.interface';
import { AuthRequest } from '../../interfaces/user.interface';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: AuthRequest = {
    email: '',
    password: ''
  };
  message: string = '';

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response: AuthResponse) => {
        if (response.token) {
          this.message = 'Login successful!';
          setTimeout(() => this.router.navigate(['/home']), 2000);
        } else {
          this.message = response.message || 'Login failed!';
        }
      },
      error: (error) => {
        this.message = 'Login failed: ' + error.message;
      }
    });
  }
}
