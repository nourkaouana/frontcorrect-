import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8 flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div class="flex space-x-4">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
                placeholder="Search users..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              [(ngModel)]="searchType"
              class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="email">Search by Email</option>
              <option value="username">Search by Username</option>
            </select>
          </div>
        </div>

        <!-- User Management Section -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800">User Management</h2>
              <button
                (click)="refreshUsers()"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <!-- Users Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let user of users" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" [src]="'https://ui-avatars.com/api/?name=' + user.username" [alt]="user.username">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                        <div class="text-sm text-gray-500">{{ user.firstname }} {{ user.lastname }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="user.role === 0 ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800' : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'">
                      {{ user.role === 0 ? 'Admin' : 'User' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="user.isLocked ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800' : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'">
                      {{ user.isLocked ? 'Locked' : 'Active' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      (click)="toggleUserLock(user)"
                      [class]="user.isLocked ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'"
                      class="focus:outline-none"
                    >
                      {{ user.isLocked ? 'Unlock' : 'Lock' }}
                    </button>
                    <button
                      (click)="showUpdatePasswordModal(user)"
                      class="text-blue-600 hover:text-blue-900 focus:outline-none"
                    >
                      Update Password
                    </button>
                    <button
                      (click)="deleteUser(user)"
                      class="text-red-600 hover:text-red-900 focus:outline-none"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Update Password Modal -->
        <div *ngIf="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Update Password</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  [(ngModel)]="newPassword"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  (click)="closeModal()"
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  (click)="updatePassword()"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  searchQuery: string = '';
  searchType: 'email' | 'username' = 'email';
  showModal: boolean = false;
  selectedUser: User | null = null;
  newPassword: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        // You might want to show an error message to the user
      }
    });
  }

  refreshUsers() {
    this.loadUsers();
  }

  onSearch() {
    if (!this.searchQuery) {
      this.loadUsers();
      return;
    }

    if (this.searchType === 'email') {
      this.apiService.getUserByEmail(this.searchQuery).subscribe({
        next: (user) => {
          this.users = user ? [user] : [];
        },
        error: (error) => {
          console.error('Error searching user by email:', error);
          this.users = [];
        }
      });
    } else {
      this.apiService.getUserByUsername(this.searchQuery).subscribe({
        next: (user) => {
          this.users = user ? [user] : [];
        },
        error: (error) => {
          console.error('Error searching user by username:', error);
          this.users = [];
        }
      });
    }
  }

  toggleUserLock(user: User) {
    if (user.isLocked) {
      this.apiService.unlockUser(user.id).subscribe({
        next: () => {
          user.isLocked = false;
        },
        error: (error) => {
          console.error('Error unlocking user:', error);
        }
      });
    } else {
      this.apiService.lockUser(user.id).subscribe({
        next: () => {
          user.isLocked = true;
        },
        error: (error) => {
          console.error('Error locking user:', error);
        }
      });
    }
  }

  showUpdatePasswordModal(user: User) {
    this.selectedUser = user;
    this.newPassword = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
    this.newPassword = '';
  }

  updatePassword() {
    if (!this.selectedUser || !this.newPassword) return;

    this.apiService.updatePassword({
      email: this.selectedUser.email,
      username: this.selectedUser.username,
      newpassword: this.newPassword
    }).subscribe({
      next: () => {
        this.closeModal();
        // You might want to show a success message
      },
      error: (error) => {
        console.error('Error updating password:', error);
        // You might want to show an error message
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.apiService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
} 