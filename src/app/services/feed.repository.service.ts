import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FeedLogEntry } from '../models/feed';
import { newId } from '../utils/id';

@Injectable({ providedIn: 'root' })
export class FeedRepositoryService {
  constructor(private api: ApiService) {}

  async loadFeed(): Promise<FeedLogEntry[]> {
    const res = await this.api.find({
      selector: { docType: 'feedLog' }
    });

    return (res.docs || []).map((d: any) => ({
      ...d,
      date: new Date(d.date)
    }));
  }

  async add(type: 'heu' | 'stroh', amount: number, price?: number, date?: Date) {
    const now = new Date();
    const id = newId('feed:add:');

    const doc = {
      _id: id,
      docType: 'feedLog',
      action: 'add',
      type,
      amount,
      price,
      date: (date ?? now).toISOString().slice(0, 10),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    return this.api.createDoc(id, doc);
  }

  async consume(type: 'heu' | 'stroh', amount: number, date?: Date) {
    const now = new Date();
    const id = newId('feed:consume:');

    const doc = {
      _id: id,
      docType: 'feedLog',
      action: 'consume',
      type,
      amount,
      date: (date ?? now).toISOString().slice(0, 10),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    return this.api.createDoc(id, doc);
  }

  async remove(entry: FeedLogEntry) {
    return this.api.deleteDoc(entry._id!, entry._rev!);
  }

  async update(entry: FeedLogEntry) {
    return this.api.updateDoc(entry._id!, {
      ...entry,
      date: entry.date.toISOString().slice(0, 10),
      updatedAt: new Date().toISOString()
    });
  }
}
