export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  state: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  displayName: string;
  state: string;
}
