import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Horse } from '../models/horse';

@Injectable({ providedIn: 'root' })
export class HorseRepositoryService {
  constructor(private api: ApiService) {}

  async loadAll(): Promise<Horse[]> {
    const res = await this.api.find({
      selector: { docType: 'horse' },
      sort: [{ name: 'asc' }],
      use_index: ['horse_indexes', 'by_docType_name']
    });
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

    return this.api.createDoc(id, payload);
  }

  async update(horse: Horse) {
    if (!horse._id || !horse._rev) throw new Error('id/rev fehlt');
    const now = new Date().toISOString();
    return this.api.updateDoc(horse._id, { ...horse, updatedAt: now });
  }

  async remove(horse: Horse) {
    if (!horse._id || !horse._rev) throw new Error('id/rev fehlt');
    return this.api.deleteDoc(horse._id, horse._rev);
  }
}
