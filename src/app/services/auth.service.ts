import { Injectable } from '@angular/core';

export type LoginResponse = {
  ok: boolean;
  token: string;
  user: {
    username: string;
    displayName: string;
    role: string;
    stallId: string;
  };
};



@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'sporthorses_token';
  private readonly USER_KEY = 'sporthorses_user';

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get user(): LoginResponse['user'] | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  setSession(data: LoginResponse) {
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
