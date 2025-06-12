export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    username: string;
    firstname?: string;
    lastname?: string;
    role: 'Admin' | 'user';
    isLocked: boolean;
  };
}
