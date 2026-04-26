import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BreedingCycle } from '../models/breeding-cycle';
import { newId } from '../utils/id';

@Injectable({ providedIn: 'root' })
export class BreedingCycleRepositoryService {
  constructor(private api: ApiService) {}

  async loadByHorse(stallId: string, horseId: string): Promise<BreedingCycle[]> {
    const res = await this.api.find({
      selector: {
        docType: 'breeding_cycle',
        stallId,
        horseId,
      },
    });

    return (res.docs || []) as BreedingCycle[];
  }

  async create(
    stallId: string,
    cycle: Omit<BreedingCycle, '_id' | '_rev' | 'docType' | 'stallId' | 'createdAt' | 'updatedAt'>
  ) {
    const now = new Date().toISOString();
    const id = newId('breeding-cycle:');

    const doc: BreedingCycle = {
      ...cycle,
      _id: id,
      docType: 'breeding_cycle',
      stallId,
      createdAt: now,
      updatedAt: now,
    };

    return this.api.createDoc(id, doc);
  }

  async update(cycle: BreedingCycle) {
    if (!cycle._id || !cycle._rev) throw new Error('id/rev fehlt');

    return this.api.updateDoc(cycle._id, {
      ...cycle,
      updatedAt: new Date().toISOString(),
    });
  }

  async remove(cycle: BreedingCycle) {
    if (!cycle._id || !cycle._rev) throw new Error('id/rev fehlt');
    return this.api.deleteDoc(cycle._id, cycle._rev);
  }
}