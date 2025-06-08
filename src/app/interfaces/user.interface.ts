export interface User {
  id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  role: 'Admin' | 'user';
  isLocked: boolean;
  avatarUrl?: string;  // Optional avatar URL
}

export interface login {
  email: string;
  password: string;
}
