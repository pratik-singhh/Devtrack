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

export type Task = {
  id: number
  name: string
  project_id: number
  completed: boolean
  created_at: string
}
