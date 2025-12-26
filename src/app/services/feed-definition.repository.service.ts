import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FeedDefinition } from '../models/feed-definition';
import { newId } from '../utils/id';

@Injectable({ providedIn: 'root' })
export class FeedDefinitionRepositoryService {
  constructor(private api: ApiService) {}

  async loadAll(stallId: string): Promise<FeedDefinition[]> {
    const res = await this.api.find({
      selector: { docType: 'feed_definition', stallId }
    });
    return (res.docs || []) as FeedDefinition[];
  }

  async create(stallId: string, def: Omit<FeedDefinition, '_id'|'_rev'|'docType'|'stallId'|'createdAt'|'updatedAt'>) {
    const now = new Date().toISOString();
    const id = newId('feeddef:');

    const payload: FeedDefinition = {
      ...def,
      _id: id,
      docType: 'feed_definition',
      stallId,
      createdAt: now,
      updatedAt: now
    };

    return this.api.createDoc(id, payload);
  }

  async update(def: FeedDefinition) {
    if (!def._id || !def._rev) throw new Error('id/rev fehlt');
    return this.api.updateDoc(def._id, {
      ...def,
      updatedAt: new Date().toISOString()
    });
  }

  async remove(def: FeedDefinition) {
    return this.api.deleteDoc(def._id!, def._rev!);
  }
}
