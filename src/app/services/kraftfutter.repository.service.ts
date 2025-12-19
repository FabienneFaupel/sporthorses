import { Injectable } from '@angular/core';
import { CouchDbService } from './couchdb.service';
import { KraftfutterDelivery } from '../models/kraftfutter';

@Injectable({
  providedIn: 'root'
})
export class KraftfutterRepositoryService {
constructor(private db: CouchDbService) {}

  async loadAll(): Promise<KraftfutterDelivery[]> {
    // ohne Mango-Sort (Index) – wir sortieren später im Client
    const res = await this.db.find({ selector: { docType: 'kraftfutter' } });
    const docs = (res.docs || []) as KraftfutterDelivery[];
    // neueste oben
    docs.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
    return docs;
  }

  // kraftfutter.repository.service.ts
async create(
  delivery: Omit<KraftfutterDelivery, '_id'|'_rev'|'docType'|'createdAt'|'updatedAt'>
) {
  const now = new Date().toISOString();

  const id = `kraftfutter:${crypto.randomUUID()}`;

  const payload = {
    ...delivery,
    _id: id,
    docType: 'kraftfutter',
    createdAt: now,
    updatedAt: now
  };

  return this.db.putDoc(id, payload);
}



  async update(delivery: KraftfutterDelivery) {
    if (!delivery._id || !delivery._rev) throw new Error('id/rev fehlt');
    const now = new Date().toISOString();
    return this.db.putDoc(delivery._id, { ...delivery, updatedAt: now });
  }

  async remove(delivery: KraftfutterDelivery) {
    if (!delivery._id || !delivery._rev) throw new Error('id/rev fehlt');
    return this.db.deleteDoc(delivery._id, delivery._rev);
  }
}