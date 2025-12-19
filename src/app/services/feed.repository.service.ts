import { Injectable } from '@angular/core';
import { CouchDbService } from './couchdb.service';
import { FeedLogEntry } from '../models/feed'; // ggf. Pfad anpassen

@Injectable({
  providedIn: 'root'
})
export class FeedRepositoryService {
constructor(private db: CouchDbService) {}

  async loadFeed(): Promise<FeedLogEntry[]> {
  const res = await this.db.find({
    selector: { docType: 'feedLog' },
    sort: [{ date: 'desc' }]
  });

  const entries: FeedLogEntry[] = (res.docs || []).map((d: any) => ({
    _id: d._id,
    _rev: d._rev,
    date: new Date(d.date),      // String -> Date
    type: d.type,
    action: d.action,
    amount: d.amount,
    price: d.price,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt
  }));

  return entries;
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
    date: docDate.toISOString().slice(0,10),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  // PUT statt POST -> du bestimmst die ID
  return this.db.putDoc(id, doc);
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
    date: docDate.toISOString().slice(0,10),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  return this.db.putDoc(id, doc);
}



  async remove(entry: FeedLogEntry) {
  if (!entry._id || !entry._rev) throw new Error('id/rev fehlt');
  return this.db.deleteDoc(entry._id, entry._rev);
}

async update(entry: FeedLogEntry) {
  if (!entry._id || !entry._rev) throw new Error('id/rev fehlt');
  const payload = {
    _id: entry._id,
    _rev: entry._rev,
    docType: 'feedLog',
    action: entry.action,
    type: entry.type,
    amount: entry.amount,
    price: entry.price,
    date: entry.date.toISOString().slice(0,10),
    updatedAt: new Date().toISOString()
  };
  return this.db.putDoc(entry._id, payload);
}


}