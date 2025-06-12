import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User, Role } from '../../interfaces/user.interface';
import { ApiService } from '../../services/api.service';

interface UserStats {
  totalDocuments: number;
  documentsThisMonth: number;
  successRate: number;
  lastActive: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  errorMessage: string = '';
  stats: UserStats = {
    totalDocuments: 12,
    documentsThisMonth: 4,
    successRate: 95,
    lastActive: 'Today'
  };

  constructor(@Inject(ApiService) private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // ApiService does not have getUserProfile method, simulate user data here
    this.user = {
      id: 1,
      username: 'user1',
      email: 'user1@example.com',
      firstname: 'John',
      lastname: 'Doe',
      role: Role.User,
      isLocked: false,
      avatarUrl: undefined
    };
    this.errorMessage = '';
    this.loadUserStats();
  }

  getAvatarUrl(): string {
    if (this.user?.avatarUrl) {
      return this.user.avatarUrl;
    }
    // Generate avatar using ui-avatars service
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.user?.username || 'U')}&background=random`;
  }

  private loadUserStats(): void {
    // Dans un cas réel, ces données viendraient de l'API
    // Pour l'instant, nous utilisons des données statiques
    this.stats = {
      totalDocuments: 12,
      documentsThisMonth: 4,
      successRate: 95,
      lastActive: 'Today'
    };
  }

  onEditProfile(): void {
    // À implémenter: logique pour éditer le profil
    console.log('Edit profile clicked');
  }
}
