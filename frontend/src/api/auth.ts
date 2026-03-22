import type { AuthResponse, LoginRequest } from "../types";

export async function AttemptLogin(credentials: LoginRequest): Promise<AuthResponse> {

  try {
    const response = await fetch('https://devtrack-production.up.railway.app/auth/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),

    });
    if (response.ok) {

      const token: AuthResponse = await response.json();
      return token;
    }
    else throw new Error("Failed to login")
    ;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

