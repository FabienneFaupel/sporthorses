import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CouchDbService {
  private couchUrl = 'http://127.0.0.1:5984';
  private dbName = 'family';
  private user = 'family_user';
  private pass = 'MaNaFaJa2005';

  private authHeader() {
    return { 'Authorization': 'Basic ' + btoa(`${this.user}:${this.pass}`) };
  }

  async postDoc(doc: any) {
    const res = await fetch(`${this.couchUrl}/${this.dbName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.authHeader() },
      body: JSON.stringify(doc)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async find(selector: any, sort?: any[], limit = 10000) {
    const body = { selector, sort, limit };
    const res = await fetch(`${this.couchUrl}/${this.dbName}/_find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.authHeader() },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // {docs: [...]}
  }

  async deleteDoc(id: string, rev: string) {
  const res = await fetch(
    `${this.couchUrl}/${this.dbName}/${encodeURIComponent(id)}?rev=${encodeURIComponent(rev)}`,
    {
      method: 'DELETE',
      headers: { ...this.authHeader() }
    }
  );
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json(); // { ok: true, id, rev }
}

async putDoc(id: string, doc: any) {
  const res = await fetch(
    `${this.couchUrl}/${this.dbName}/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...this.authHeader() },
      body: JSON.stringify(doc)
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { ok, id, rev }
}


}
