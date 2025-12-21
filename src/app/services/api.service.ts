import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3001/api';

  constructor(private auth: AuthService) {}

  private headers(extra?: Record<string, string>) {
    const token = this.auth.token;

    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(extra ?? {})
    };
  }

  async health() {
    const res = await fetch(`${this.baseUrl}/health`);
    return res.json();
  }

  async find(body: any) {
    const res = await fetch(`${this.baseUrl}/find`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async createDoc(id: string, doc: any) {
    const res = await fetch(`${this.baseUrl}/docs/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(doc)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async updateDoc(id: string, doc: any) {
    const res = await fetch(`${this.baseUrl}/docs/${encodeURIComponent(id)}/update`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(doc)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async deleteDoc(id: string, rev: string) {
    const res = await fetch(
      `${this.baseUrl}/docs/${encodeURIComponent(id)}?rev=${encodeURIComponent(rev)}`,
      { method: 'DELETE', headers: this.headers() }
    );
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}
