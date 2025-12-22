import { Injectable } from '@angular/core';
import { AuthService, LoginResponse } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private baseUrl = '/api';

  constructor(private auth: AuthService) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) throw new Error(await res.text());

    const data = (await res.json()) as LoginResponse;
    this.auth.setSession(data);
    return data;
  }

  logout() {
    this.auth.logout();
  }
}
