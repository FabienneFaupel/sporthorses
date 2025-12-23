import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Horse } from '../models/horse';
import { newId } from '../utils/id';

@Injectable({ providedIn: 'root' })
export class HorseRepositoryService {
  constructor(private api: ApiService) {}

  async loadAll(stallId: string): Promise<Horse[]> {
  const res = await this.api.find({
    selector: { docType: 'horse', stallId }
  });
  return (res.docs || []) as Horse[];
}


  async create(stallId: string, horse: Omit<Horse, '_id' | '_rev'>) {
  const now = new Date().toISOString();
  const id = newId('horse:');

  const payload: Horse = {
    ...horse,
    _id: id,
    docType: 'horse',
    stallId,
    createdAt: now,
    updatedAt: now
  } as Horse;

  return this.api.createDoc(id, payload);
}


  async update(horse: Horse) {
    if (!horse._id || !horse._rev) throw new Error('id/rev fehlt');
    return this.api.updateDoc(horse._id, {
      ...horse,
      updatedAt: new Date().toISOString()
    });
  }

  async remove(horse: Horse) {
    return this.api.deleteDoc(horse._id!, horse._rev!);
  }
}
