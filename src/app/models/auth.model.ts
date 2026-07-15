export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  activo: boolean;
  permisos: string[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario: User;
}
