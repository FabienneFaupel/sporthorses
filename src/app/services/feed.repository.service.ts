import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FeedLogEntry } from '../models/feed';

@Injectable({ providedIn: 'root' })
export class FeedRepositoryService {
  constructor(private api: ApiService) {}

async loadFeed(): Promise<FeedLogEntry[]> {
  const res = await this.api.find({
    selector: {
      docType: 'feedLog'
    },
    sort: [{ date: 'desc' }],
    use_index: ['feed_indexes', 'by_docType_date']
  });

  return (res.docs || []).map((d: any) => ({
    _id: d._id,
    _rev: d._rev,
    date: new Date(d.date),
    type: d.type,
    action: d.action,
    amount: d.amount,
    price: d.price,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt
  }));
}


  async add(type: 'heu'|'stroh', amount: number, price?: number, date?: Date) {
    const now = new Date();
    const docDate = date ?? now;

    const id = `feed:add:${crypto.randomUUID()}`;
    const doc = {
      _id: id,
      docType: 'feedLog',
      action: 'add',
      type,
      amount,
      price,
      date: docDate.toISOString().slice(0, 10),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    return this.api.createDoc(id, doc);
  }

  async consume(type: 'heu'|'stroh', amount: number, date?: Date) {
    const now = new Date();
    const docDate = date ?? now;

    const id = `feed:consume:${crypto.randomUUID()}`;
    const doc = {
      _id: id,
      docType: 'feedLog',
      action: 'consume',
      type,
      amount,
      date: docDate.toISOString().slice(0, 10),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    return this.api.createDoc(id, doc);
  }

  async remove(entry: FeedLogEntry) {
    if (!entry._id || !entry._rev) throw new Error('id/rev fehlt');
    return this.api.deleteDoc(entry._id, entry._rev);
  }

  async update(entry: FeedLogEntry) {
    if (!entry._id || !entry._rev) throw new Error('id/rev fehlt');

    const payload = {
      ...entry,
      _id: entry._id,
      _rev: entry._rev,
      docType: 'feedLog',
      date: entry.date.toISOString().slice(0, 10),
      updatedAt: new Date().toISOString()
    };

    return this.api.updateDoc(entry._id, payload);
  }
}
