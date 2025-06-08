import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    email: '',
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'Admin' | 'user'
  };
  message: string = '';
  isLoading: boolean = false;
  passwordStrength: number = 0;
  availableRoles = ['Admin', 'user'];
  formErrors = {
    email: '',
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private apiService: ApiService, private router: Router) {}

  validateField(field: string): boolean {
    switch(field) {
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!this.user.email) {
          this.formErrors.email = 'Email is required';
          return false;
        }
        if (!emailRegex.test(this.user.email)) {
          this.formErrors.email = 'Please enter a valid email address';
          return false;
        }
        this.formErrors.email = '';
        return true;

      case 'username':
        if (!this.user.username) {
          this.formErrors.username = 'Username is required';
          return false;
        }
        if (this.user.username.length < 3) {
          this.formErrors.username = 'Username must be at least 3 characters long';
          return false;
        }
        this.formErrors.username = '';
        return true;

      case 'firstname':
        if (!this.user.firstname) {
          this.formErrors.firstname = 'First name is required';
          return false;
        }
        this.formErrors.firstname = '';
        return true;

      case 'lastname':
        if (!this.user.lastname) {
          this.formErrors.lastname = 'Last name is required';
          return false;
        }
        this.formErrors.lastname = '';
        return true;

      case 'password':
        if (!this.user.password) {
          this.formErrors.password = 'Password is required';
          return false;
        }
        if (this.user.password.length < 8) {
          this.formErrors.password = 'Password must be at least 8 characters long';
          return false;
        }
        this.formErrors.password = '';
        return true;

      case 'confirmPassword':
        if (!this.user.confirmPassword) {
          this.formErrors.confirmPassword = 'Please confirm your password';
          return false;
        }
        if (this.user.password !== this.user.confirmPassword) {
          this.formErrors.confirmPassword = 'Passwords do not match';
          return false;
        }
        this.formErrors.confirmPassword = '';
        return true;

      default:
        return true;
    }
  }

  checkPasswordStrength(password: string): void {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;
    this.passwordStrength = score;
  }

  onPasswordChange(): void {
    this.checkPasswordStrength(this.user.password);
    this.validateField('password');
    if (this.user.confirmPassword) {
      this.validateField('confirmPassword');
    }
  }

  validateForm(): boolean {
    const fields = ['email', 'username', 'firstname', 'lastname', 'password', 'confirmPassword'];
    return fields.every(field => this.validateField(field));
  }

  onRegister(): void {
    if (!this.validateForm()) {
      this.message = 'Please fix the errors in the form';
      return;
    }

    this.isLoading = true;
    const userData: Partial<User> = {
      email: this.user.email,
      username: this.user.username,
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      password: this.user.password,
      role: this.user.role
    };

    this.apiService.register(userData).subscribe({
      next: (response) => {
        this.message = 'Registration successful!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.message = 'Registration failed: ' + error.message;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
