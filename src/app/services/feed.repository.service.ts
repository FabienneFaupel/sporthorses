import { Injectable } from '@angular/core';
import { CouchDbService } from './couchdb.service';
import { FeedLogEntry } from './data.service'; // ggf. Pfad anpassen

@Injectable({
  providedIn: 'root'
})
export class FeedRepositoryService {
constructor(private db: CouchDbService) {}

  async loadFeed(): Promise<FeedLogEntry[]> {
  // holt sowohl neue als auch alte Dokus
  const res = await this.db.find({
    docType: { $in: ['feedLog', 'lieferung', 'verbrauch'] }
  });

  const entries: FeedLogEntry[] = (res.docs || []).map((d: any) => {
    // action ableiten, falls altes Schema
    const action: 'add' | 'consume' =
      d.action ??
      (d.docType === 'lieferung' ? 'add' :
       d.docType === 'verbrauch' ? 'consume' : 'add');

    // Felder robust lesen (falls alte Namen benutzt wurden)
    const dateStr = d.date ?? d.datum ?? d.createdAt ?? new Date().toISOString();
    const type: 'heu' | 'stroh' = d.type ?? d.futter ?? d.kind ?? 'heu';
    const amount = Number(d.amount ?? d.menge ?? 0);
    const price = d.price ?? d.preis;

    return {
      _id: d._id,         
      _rev: d._rev,
      date: new Date(dateStr),
      type,
      action,
      amount,
      price
    } as FeedLogEntry;
  });

  // für die Anzeige neueste zuerst
  entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  return entries;
}


  async add(type: 'heu'|'stroh', amount: number, price?: number) {
    const now = new Date();
    return this.db.postDoc({
      docType: 'feedLog',
      action: 'add',
      type, amount, price,
      date: now.toISOString().slice(0,10),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    });
  }

  async consume(type: 'heu'|'stroh', amount: number) {
    const now = new Date();
    return this.db.postDoc({
      docType: 'feedLog',
      action: 'consume',
      type, amount,
      date: now.toISOString().slice(0,10),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    });
  }
  
  async remove(entry: FeedLogEntry) {
  if (!entry._id || !entry._rev) throw new Error('id/rev fehlt');
  return this.db.deleteDoc(entry._id, entry._rev);
}

}