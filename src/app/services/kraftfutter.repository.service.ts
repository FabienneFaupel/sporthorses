import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { KraftfutterDelivery } from '../models/kraftfutter';
import { newId } from '../utils/id';

@Injectable({ providedIn: 'root' })
export class KraftfutterRepositoryService {
  constructor(private api: ApiService) {}

  async loadAll(stallId: string): Promise<KraftfutterDelivery[]> {
  const res = await this.api.find({
    selector: { docType: 'kraftfutter', stallId }
  });
  return res.docs || [];
}


  async create(
  stallId: string,
  delivery: Omit<KraftfutterDelivery, '_id' | '_rev' | 'docType' | 'createdAt' | 'updatedAt'>
) {
  const now = new Date().toISOString();
  const id = newId('kraftfutter:');

  return this.api.createDoc(id, {
    ...delivery,
    _id: id,
    docType: 'kraftfutter',
    stallId,
    createdAt: now,
    updatedAt: now
  });
}



  async update(delivery: KraftfutterDelivery) {
    return this.api.updateDoc(delivery._id!, {
      ...delivery,
      updatedAt: new Date().toISOString()
    });
  }

  async remove(delivery: KraftfutterDelivery) {
    return this.api.deleteDoc(delivery._id!, delivery._rev!);
  }
}
