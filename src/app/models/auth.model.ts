export interface Role {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role_id: number;
  created_at: string;
  updated_at: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  role: string;
  user: User;
}
