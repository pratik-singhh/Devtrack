export type Project = {
  id: number;
  name: string;
  user_id: number;
}

export type AuthResponse = {
  token: string;
}

export type LoginRequest = {
  email: string;
  password: string;
}
