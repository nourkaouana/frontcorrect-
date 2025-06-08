export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: number;
    username?: string;
    email?: string;
    role: 'Admin' | 'user';
  };
}
