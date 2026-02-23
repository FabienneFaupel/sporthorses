import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FeedLogEntry } from '../models/feed';
import { newId } from '../utils/id';
import { toDateOnlyIsoLocal, fromDateOnlyIsoLocal } from '../utils/date';

@Injectable({ providedIn: 'root' })
export class FeedRepositoryService {
  constructor(private api: ApiService) {}

  async loadFeed(stallId: string): Promise<FeedLogEntry[]> {
  const res = await this.api.find({
    selector: { docType: 'feedLog' }, // stallId NICHT mitsenden (Backend setzt es aus Token)
    sort: [{ date: 'desc' }, { createdAt: 'desc' }],
    limit: 1000
  });

  return (res.docs || []) as FeedLogEntry[];
}


  async add(stallId: string, type: 'heu' | 'stroh', amount: number, price?: number, dateIso?: string) {
  const now = new Date();
  const id = newId('feed:add:');

  const doc = {
    _id: id,
    docType: 'feedLog',
    stallId,
    action: 'add',
    type,
    amount,
    price,
    date: dateIso ?? toDateOnlyIsoLocal(new Date()),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  return this.api.createDoc(id, doc);
}


  async consume(stallId: string, type: 'heu' | 'stroh', amount: number, dateIso?: string) {
  const now = new Date();
  const id = newId('feed:consume:');

  const doc = {
    _id: id,
    docType: 'feedLog',
    stallId,
    action: 'consume',
    type,
    amount,
    date: dateIso ?? toDateOnlyIsoLocal(new Date()),
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
      date: entry.date,
      updatedAt: new Date().toISOString()
    });
  }
}
