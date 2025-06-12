export enum Role {
  Admin = 0,
  User = 1
}

export interface RegistrationRequest {
  email: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: Role;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  createdDate: string;
  token: string;
  message?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  role: Role;
  isLocked: boolean;
  avatarUrl?: string;
}
