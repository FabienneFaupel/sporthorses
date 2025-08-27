import { Injectable } from '@angular/core';
import { FeedRepositoryService } from './feed.repository.service';
import { HorseRepositoryService } from './horse.repository.service';
import { Horse } from '../models/horse';




export interface FeedLogEntry {
  _id?: string;   // neu
  _rev?: string;  // neu
  date: Date;
  type: 'heu' | 'stroh';
  action: 'add' | 'consume';
  amount: number;
  price?: number;
}




@Injectable({
  providedIn: 'root'
})
export class DataService {

 
// --- HORSES (aus DB) ---

private horses: Horse[] = [];

async loadHorsesFromDb() {
  this.horses = await this.horseRepo.loadAll();
}

getHorses(): Horse[] {
  return this.horses;
}

async addHorse(horse: Omit<Horse, '_id' | '_rev' | 'docType' | 'createdAt' | 'updatedAt'>) {
  // docType hier ergänzen, Repo erwartet 'horse'
  const res = await this.horseRepo.create({
    ...horse,
    docType: 'horse'
  } as Horse);
  this.horses.push({ ...horse, docType: 'horse', _id: res.id, _rev: res.rev });
}

async updateHorse(h: Horse) {
  const res = await this.horseRepo.update(h);
  const i = this.horses.findIndex(x => x._id === h._id);
  if (i >= 0) {
    // komplettes Objekt ersetzen + neue _rev setzen
    this.horses[i] = { ...h, _rev: res.rev };
    // Array neu zuweisen, damit Angular Updates sicher mitbekommt
    this.horses = [...this.horses];
  }
}


async deleteHorse(h: Horse) {
  await this.horseRepo.remove(h);
  this.horses = this.horses.filter(x => x !== h);
}

  
// DB Feed

  // Maximalmengen
  private hayMax = 0;
  private strawMax = 0;

  // Aktuelle Mengen
  private hayCurrent = 0;
  private strawCurrent = 0;

  // Feed-Historie
  private feedLog: FeedLogEntry[] = [
    { date: new Date('2025-01-01'), type: 'heu', action: 'consume', amount: 1 },
    { date: new Date('2025-02-12'), type: 'stroh', action: 'add', amount: 5, price: 75  },
    { date: new Date('2024-06-23'), type: 'heu', action: 'add', amount: 10, price: 75  },
    { date: new Date('2025-01-01'), type: 'heu', action: 'consume', amount: 1 },
    { date: new Date('2025-03-12'), type: 'stroh', action: 'add', amount: 5, price: 75  },
    { date: new Date('2025-04-23'), type: 'heu', action: 'add', amount: 10, price: 75  },
  ];

  constructor(private feedRepo: FeedRepositoryService, private horseRepo: HorseRepositoryService) {}

  private recomputeStocks() {
  let hay = 0, straw = 0;
  let hayMax = 0, strawMax = 0;

  // chronologisch auswerten (wichtig!)
  const sorted = [...this.feedLog].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const e of sorted) {
    if (e.type === 'heu') {
      if (e.action === 'add') {
        hay += e.amount;
        hayMax = hay;               // <- neues Maximum = aktueller Bestand
      } else {
        hay = Math.max(0, hay - e.amount);  // Max bleibt gleich
      }
    } else { // stroh
      if (e.action === 'add') {
        straw += e.amount;
        strawMax = straw;           // <- neues Maximum = aktueller Bestand
      } else {
        straw = Math.max(0, straw - e.amount);
      }
    }
  }

  this.hayCurrent = hay;
  this.strawCurrent = straw;
  this.hayMax = hayMax;
  this.strawMax = strawMax;
}


  
  async loadFeedFromDb() {
  this.feedLog = await this.feedRepo.loadFeed();
  this.recomputeStocks();
}

   // Getter für Max-Werte
  getHayMax(): number {
    return this.hayMax;
  }

  getStrawMax(): number {
    return this.strawMax;
  }

  // Getter für aktuelle Mengen
  getHayCurrent(): number {
    return this.hayCurrent;
  }

  getStrawCurrent(): number {
    return this.strawCurrent;
  }

  // Getter für Feed-Log
  getFeedLog(): FeedLogEntry[] {
    return this.feedLog;
  }

  async addFeed(type: 'heu' | 'stroh', amount: number, price?: number, date?: Date) {
  const entry: FeedLogEntry = { date: date ?? new Date(), type, action: 'add', amount, price };
  this.feedLog.push(entry);
  this.recomputeStocks();

  try {
    const res = await this.feedRepo.add(type, amount, price, date); // { id, rev }
    entry._id = res.id;
    entry._rev = res.rev;
  } catch (e) {
    console.error('Error saving feed:', e);
  }
}

async consumeFeed(type: 'heu' | 'stroh', amount: number, date?: Date) {
  const entry: FeedLogEntry = { date: date ?? new Date(), type, action: 'consume', amount };
  this.feedLog.push(entry);
  this.recomputeStocks();

  try {
    const res = await this.feedRepo.consume(type, amount, date); // { id, rev }
    entry._id = res.id;
    entry._rev = res.rev;
  } catch (e) {
    console.error('Error consuming feed:', e);
  }
}

canConsume(type: 'heu' | 'stroh', amount: number): boolean {
  const stock = type === 'heu' ? this.hayCurrent : this.strawCurrent;
  return amount > 0 && amount <= stock;
}



async deleteFeed(entry: FeedLogEntry) {
  if (!entry._id || !entry._rev) {
    console.error('Kein _id/_rev im Eintrag – erst neu laden oder IDs korrekt setzen.');
    return;
  }

  // Optimistic UI: sofort entfernen
  const prev = this.feedLog;
  this.feedLog = this.feedLog.filter(e => e !== entry);
  this.recomputeStocks();

  try {
    await this.feedRepo.remove(entry);
  } catch (e) {
    console.error('Delete failed:', e);
    // Rollback bei Fehler
    this.feedLog = prev;
    this.recomputeStocks();
  }
}

async updateFeed(entry: FeedLogEntry, patch: Partial<FeedLogEntry>) {
  Object.assign(entry, patch);
  this.recomputeStocks();

  try {
    const res = await this.feedRepo.update(entry);
    entry._rev = res.rev; // neue revision aus couchdb übernehmen
  } catch (e) {
    console.error('Update failed:', e);
    await this.loadFeedFromDb(); // fallback: neu laden
  }
}




}