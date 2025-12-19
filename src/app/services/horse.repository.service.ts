import { Injectable } from '@angular/core';
import { CouchDbService } from './couchdb.service';
import { Horse } from '../models/horse';

@Injectable({ providedIn: 'root' })

export class HorseRepositoryService {
  constructor(private db: CouchDbService) {}

  async loadAll(): Promise<Horse[]> {
    // nutzt den Index: ["horse_indexes","by_docType_name"]
    const res = await this.db.find(
  {
    selector: { docType: 'horse' },
    sort: [{ name: 'asc' }],
    use_index: ['horse_indexes', 'by_docType_name']
  }
);

    return (res.docs || []) as Horse[];
  }

  async create(horse: Omit<Horse, '_id'|'_rev'>) {
  const now = new Date().toISOString();

  const id = `horse:${crypto.randomUUID()}`;

  const payload: Horse = {
    ...horse,
    _id: id,
    docType: 'horse',
    createdAt: now,
    updatedAt: now
  } as Horse;

  return this.db.putDoc(id, payload); // -> { ok, id, rev }
}


  async update(horse: Horse) {
    if (!horse._id || !horse._rev) throw new Error('id/rev fehlt');
    const now = new Date().toISOString();
    const payload = { ...horse, updatedAt: now };
    return this.db.putDoc(horse._id, payload); // -> { ok, id, rev }
  }

  async remove(horse: Horse) {
    if (!horse._id || !horse._rev) throw new Error('id/rev fehlt');
    return this.db.deleteDoc(horse._id, horse._rev); // -> { ok, id, rev }
  }
}
