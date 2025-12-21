import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { KraftfutterDelivery } from '../models/kraftfutter';

@Injectable({ providedIn: 'root' })
export class KraftfutterRepositoryService {
  constructor(private api: ApiService) {}

  async loadAll(): Promise<KraftfutterDelivery[]> {
    const res = await this.api.find({
      selector: { docType: 'kraftfutter' }
    });

    const docs = (res.docs || []) as KraftfutterDelivery[];
    docs.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
    return docs;
  }

  async create(delivery: Omit<KraftfutterDelivery, '_id'|'_rev'|'docType'|'createdAt'|'updatedAt'>) {
    const now = new Date().toISOString();
    const id = `kraftfutter:${crypto.randomUUID()}`;

    const payload = {
      ...delivery,
      _id: id,
      docType: 'kraftfutter',
      createdAt: now,
      updatedAt: now
    };

    return this.api.createDoc(id, payload);
  }

  async update(delivery: KraftfutterDelivery) {
    if (!delivery._id || !delivery._rev) throw new Error('id/rev fehlt');
    const now = new Date().toISOString();
    return this.api.updateDoc(delivery._id, { ...delivery, updatedAt: now });
  }

  async remove(delivery: KraftfutterDelivery) {
    if (!delivery._id || !delivery._rev) throw new Error('id/rev fehlt');
    return this.api.deleteDoc(delivery._id, delivery._rev);
  }
}
