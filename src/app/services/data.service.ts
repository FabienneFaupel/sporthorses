import { Injectable } from '@angular/core';
import { FeedRepositoryService } from './feed.repository.service';
import { HorseRepositoryService } from './horse.repository.service';
import { Horse, FarrierEntry, Vaccination } from '../models/horse';
import { KraftfutterRepositoryService } from './kraftfutter.repository.service';
import { KraftfutterDelivery } from '../models/kraftfutter';
import { FeedLogEntry } from '../models/feed';
import { AuthService } from './auth.service';
import { VaccinationSchedule } from '../models/vaccination-schedule';
import { VaccinationScheduleRepositoryService } from './vaccination-schedule.repository.service';




@Injectable({
  providedIn: 'root'
})
export class DataService {

 constructor(
  private feedRepo: FeedRepositoryService,
  private horseRepo: HorseRepositoryService,
  private kraftRepo: KraftfutterRepositoryService,
  private auth: AuthService,
  private vacScheduleRepo: VaccinationScheduleRepositoryService
) {}

private get stallId(): string {
  const sid = this.auth.user?.stallId;
  if (!sid) throw new Error('Keine stallId im Login-User gefunden. Bitte neu einloggen.');
  return sid;
}

getDisplayAge(h: Horse, ref = new Date()): number {
  const year = ref.getFullYear();

  // Fall 1: birth vorhanden -> Stichtagsalter aus Geburtsjahr
  if (h.birth && /^\d{4}-\d{2}-\d{2}$/.test(h.birth)) {
    const by = Number(h.birth.slice(0, 4));
    return Math.max(0, year - by);
  }

  // Fall 2: nur age -> mit ageBaseYear hochrechnen
  const baseYear = h.ageBaseYear ?? year; // für alte Daten
  return Math.max(0, Number(h.age ?? 0) + (year - baseYear));
}




 // --- HORSES (aus DB) ---

private horses: Horse[] = [];

async loadHorsesFromDb() {
  this.horses = await this.horseRepo.loadAll(this.stallId);
}


getHorses(): Horse[] {
  return this.horses;
}

async addHorse(horse: Omit<Horse, '_id' | '_rev' | 'docType' | 'createdAt' | 'updatedAt'>) {
  // docType hier ergänzen, Repo erwartet 'horse'
  const res = await this.horseRepo.create(this.stallId, {
  ...horse,
  docType: 'horse'
} as Horse);

  this.horses.push({ ...horse, docType: 'horse', stallId: this.stallId, _id: res.id, _rev: res.rev } as Horse);

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


// in data.service.ts
async addFarrierEntry(horseId: string, entry: FarrierEntry) {
  const h = this.horses.find(x => x._id === horseId);
  if (!h) throw new Error('Horse not found');

  // vorne einfügen (neuester zuerst)
  h.farrierEntries = [entry, ...(h.farrierEntries ?? [])];

  const res = await this.horseRepo.update(h);
  h._rev = res.rev;
  // Array „touch“ für Change Detection
  this.horses = [...this.horses];
}

async updateFarrierEntry(horseId: string, index: number, patch: Partial<FarrierEntry>) {
  const h = this.horses.find(x => x._id === horseId);
  if (!h) throw new Error('Horse not found');
  if (!h.farrierEntries || !h.farrierEntries[index]) throw new Error('Entry not found');

  h.farrierEntries[index] = { ...h.farrierEntries[index], ...patch };

  const res = await this.horseRepo.update(h);
  h._rev = res.rev;
  this.horses = [...this.horses];
}

async deleteFarrierEntry(horseId: string, index: number) {
  const h = this.horses.find(x => x._id === horseId);
  if (!h) throw new Error('Horse not found');
  if (!h.farrierEntries || !h.farrierEntries[index]) throw new Error('Entry not found');

  h.farrierEntries = h.farrierEntries.filter((_, i) => i !== index);

  const res = await this.horseRepo.update(h);
  h._rev = res.rev;
  this.horses = [...this.horses];
}


async addVaccination(horseId: string, vac: Vaccination) {
  const i = this.horses.findIndex(h => h._id === horseId);
  if (i < 0) throw new Error('Horse not found');

  const horse = { ...this.horses[i] };
  const list = Array.isArray(horse.vaccinations) ? [...horse.vaccinations] : [];
  list.unshift(vac);           // neueste oben
  horse.vaccinations = list;

  const res = await this.horseRepo.update(horse);
  horse._rev = res.rev;
  this.horses[i] = horse;
}

async updateVaccination(horseId: string, index: number, patch: Partial<Vaccination>) {
  const i = this.horses.findIndex(h => h._id === horseId);
  if (i < 0) throw new Error('Horse not found');

  const horse = { ...this.horses[i] };
  const list = Array.isArray(horse.vaccinations) ? [...horse.vaccinations] : [];
  if (index < 0 || index >= list.length) throw new Error('Vaccination index out of range');

  list[index] = { ...list[index], ...patch };
  horse.vaccinations = list;

  const res = await this.horseRepo.update(horse);
  horse._rev = res.rev;
  this.horses[i] = horse;
}

async deleteVaccination(horseId: string, index: number) {
  const i = this.horses.findIndex(h => h._id === horseId);
  if (i < 0) throw new Error('Horse not found');

  const horse = { ...this.horses[i] };
  const list = Array.isArray(horse.vaccinations) ? [...horse.vaccinations] : [];
  if (index < 0 || index >= list.length) throw new Error('Vaccination index out of range');

  list.splice(index, 1);
  horse.vaccinations = list;

  const res = await this.horseRepo.update(horse);
  horse._rev = res.rev;
  this.horses[i] = horse;
}

// ---------------- Vaccination Schedule ----------------

private vaccinationSchedule: VaccinationSchedule | null = null;

private toYYYYMMFromISODate(iso: string): string {
  // iso: YYYY-MM-DD
  return iso.slice(0, 7);
}

private toYYYYMM(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

async loadVaccinationScheduleFromDb() {
  this.vaccinationSchedule = await this.vacScheduleRepo.loadOne(this.stallId);

  // ✅ Migration: falls altes Doc nur nextVisitDate hat, dueMonth ergänzen
  if (this.vaccinationSchedule && !this.vaccinationSchedule.dueMonth) {
    const nd = this.vaccinationSchedule.nextVisitDate;
    const due = nd ? this.toYYYYMMFromISODate(nd) : this.toYYYYMM(new Date());
    await this.vacScheduleRepo.upsert(this.stallId, {
      ...this.vaccinationSchedule,
      dueMonth: due
    });
    this.vaccinationSchedule = await this.vacScheduleRepo.loadOne(this.stallId);
  }
}

getVaccinationSchedule(): VaccinationSchedule | null {
  return this.vaccinationSchedule;
}

/**
 * Termin setzen/ändern (konkretes Datum).
 * dueMonth wird automatisch aus dem Datum abgeleitet.
 */
async saveVaccinationScheduleDate(nextVisitDateIso: string, intervalMonths = 6, remindDaysBefore = 14) {
  const dueMonth = this.toYYYYMMFromISODate(nextVisitDateIso);

  await this.vacScheduleRepo.upsert(this.stallId, {
    docType: 'vaccination_schedule',
    stallId: this.stallId,
    dueMonth,
    nextVisitDate: nextVisitDateIso,
    intervalMonths,
    remindDaysBefore
  } as VaccinationSchedule);

  await this.loadVaccinationScheduleFromDb();
}

/**
 * Nur den fälligen Monat setzen (wenn du noch keinen konkreten Tag weißt)
 */
async saveVaccinationScheduleDueMonth(dueMonth: string, intervalMonths = 6, remindDaysBefore = 14) {
  await this.vacScheduleRepo.upsert(this.stallId, {
    docType: 'vaccination_schedule',
    stallId: this.stallId,
    dueMonth,
    nextVisitDate: undefined, // ✅ noch kein konkreter Termin
    intervalMonths,
    remindDaysBefore
  } as VaccinationSchedule);

  await this.loadVaccinationScheduleFromDb();
}

/**
 * ✅ "Erledigt" heißt:
 * - Nächster Monat = dueMonth + 6 Monate
 * - nextVisitDate löschen (unbekannt)
 */
async markScheduleDoneMoveToNextMonth() {
  const s = this.vaccinationSchedule;
  if (!s) return;

  const baseIso = `${s.dueMonth}-01`; // ✅ immer Soll-Monat als Basis
  const nextDue = this.computeNextDueMonthFromVisit(baseIso, s.intervalMonths);

  await this.vacScheduleRepo.upsert(this.stallId, {
    ...s,
    dueMonth: nextDue,
    nextVisitDate: undefined
  });

  await this.loadVaccinationScheduleFromDb();
}


computeNextDueMonthFromVisit(visitIso: string, intervalMonths: number): string {
  const d = new Date(visitIso + 'T00:00:00');
  d.setMonth(d.getMonth() + intervalMonths);
  return this.toYYYYMM(d);
}

/**
 * Status:
 * - wenn nextVisitDate existiert -> Reminder relativ zu diesem Datum
 * - sonst Reminder relativ zu Monatsbeginn / Monatsende von dueMonth
 */
getScheduleStatus(s: VaccinationSchedule, ref = new Date()): 'ok' | 'soon' | 'overdue' {
  const ms = 24 * 60 * 60 * 1000;

  // Wenn konkretes Datum bekannt:
  if (s.nextVisitDate) {
    const visit = new Date(s.nextVisitDate + 'T00:00:00');
    const remindFrom = new Date(visit.getTime() - s.remindDaysBefore * ms);
    if (ref > visit) return 'overdue';
    if (ref >= remindFrom) return 'soon';
    return 'ok';
  }

  // Nur fälliger Monat:
  const [y, m] = s.dueMonth.split('-').map(Number);
  const monthStart = new Date(y, m - 1, 1);
  const monthEnd = new Date(y, m, 0); // letzter Tag des Monats
  const remindFrom = new Date(monthStart.getTime() - s.remindDaysBefore * ms);

  if (ref > monthEnd) return 'overdue';
  if (ref >= remindFrom) return 'soon';
  return 'ok';
}

async resetVaccinationSchedule(): Promise<void> {
  const s = this.vaccinationSchedule;

  // Wenn nix da ist -> einfach sicherheitshalber neu laden
  if (!s || !s._id || !s._rev) {
    await this.loadVaccinationScheduleFromDb();
    return;
  }

  await this.vacScheduleRepo.remove(s);
  this.vaccinationSchedule = null;
}




  
// DB Feed

  // Maximalmengen
  private hayMax = 0;
  private strawMax = 0;

  // Aktuelle Mengen
  private hayCurrent = 0;
  private strawCurrent = 0;

  
  private feedLog: FeedLogEntry[] = [];


  private recomputeStocks() {
  let hay = 0, straw = 0;
  let hayMax = 0, strawMax = 0;

  // chronologisch auswerten (wichtig!)
  const sorted = [...this.feedLog].sort((a, b) => {
  const d = a.date.getTime() - b.date.getTime();
  if (d !== 0) return d;

  // gleicher Tag → nach Erstellung sortieren
  return new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();
});



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
  this.feedLog = await this.feedRepo.loadFeed(this.stallId);
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
  const entry: FeedLogEntry = {
    date: date ?? new Date(),
    type,
    action: 'add',
    amount: Number(amount),
    price: price != null ? Number(price) : undefined
  };

  this.feedLog.push(entry);
  this.recomputeStocks();

  try {
    const res = await this.feedRepo.add(this.stallId, type, entry.amount, entry.price, entry.date);

    entry._id = res.id;
    entry._rev = res.rev;
  } catch (e) {
    console.error('Error saving feed:', e);
  }
}

async consumeFeed(type: 'heu' | 'stroh', amount: number, date?: Date) {
  const entry: FeedLogEntry = {
    date: date ?? new Date(),
    type,
    action: 'consume',
    amount: Number(amount)
  };

  this.feedLog.push(entry);
  this.recomputeStocks();

  try {
    const res = await this.feedRepo.consume(this.stallId, type, entry.amount, entry.date);

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

  // wichtig: falls date als String reinkommt
  if (typeof (entry.date as any) === 'string') {
    entry.date = new Date(entry.date as any);
  }

  this.recomputeStocks();

  try {
    const res = await this.feedRepo.update(entry);
    entry._rev = res.rev;
  } catch (e) {
    console.error('Update failed:', e);
    await this.loadFeedFromDb();
  }
}


// --- KRAFTFUTTER ---
  private kraftfutter: KraftfutterDelivery[] = [];

  getKraftfutter(): KraftfutterDelivery[] {
    return this.kraftfutter;
  }

  async loadKraftfutterFromDb() {
  this.kraftfutter = await this.kraftRepo.loadAll(this.stallId);
}


  async addKraftfutter(delivery: Omit<KraftfutterDelivery,'_id'|'_rev'|'createdAt'|'updatedAt'|'docType'>) {
  // Optimistic UI – wir zeigen sofort
  const tmp: KraftfutterDelivery = { ...delivery } as KraftfutterDelivery;
  this.kraftfutter = [tmp, ...this.kraftfutter];

  try {
    const res = await this.kraftRepo.create(this.stallId, delivery);
 // Repo fügt docType & timestamps hinzu
    // in der Liste das temp-Doc durch das „echte“ mit _id/_rev ersetzen
    this.kraftfutter = this.kraftfutter.map(d => d === tmp ? { ...tmp, _id: res.id, _rev: res.rev, docType: 'kraftfutter' } : d);
  } catch (e) {
    console.error('addKraftfutter failed:', e);
    await this.loadKraftfutterFromDb(); // rollback
  }
}

// data.service.ts
async updateKraftfutter(updated: KraftfutterDelivery) {
  // optimistic: lokal ersetzen
  this.kraftfutter = this.kraftfutter.map(d =>
    d._id === updated._id ? { ...updated } : d
  );

  // DB
  const res = await this.kraftRepo.update(updated);
  // _rev aktualisieren + Array „ticken“, damit Angular updated
  this.kraftfutter = this.kraftfutter.map(d =>
    d._id === updated._id ? { ...d, _rev: res.rev } : d
  );
}

async deleteKraftfutter(delivery: KraftfutterDelivery) {
  if (!delivery._id || !delivery._rev) throw new Error('id/rev fehlt');
  // optimistic remove
  this.kraftfutter = this.kraftfutter.filter(d => d._id !== delivery._id);
  try {
    await this.kraftRepo.remove(delivery);
  } catch (e) {
    console.error('deleteKraftfutter failed:', e);
    // Rollback
    await this.loadKraftfutterFromDb();
  }
}


}