import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { VaccinationSchedule } from '../models/vaccination-schedule';

@Injectable({ providedIn: 'root' })
export class VaccinationScheduleRepositoryService {
  constructor(private api: ApiService) {}

  async loadOne(stallId: string): Promise<VaccinationSchedule | null> {
    const res = await this.api.find({
      selector: { docType: 'vaccination_schedule', stallId },
      limit: 1
    });
    const doc = (res.docs || [])[0] as VaccinationSchedule | undefined;
    return doc ?? null;
  }

  async upsert(stallId: string, patch: Partial<VaccinationSchedule>) {
    const existing = await this.loadOne(stallId);
    const now = new Date().toISOString();

    if (!existing) {
      const id = `vaccination_schedule:${stallId}`;

      const payload: VaccinationSchedule = {
        _id: id,
        docType: 'vaccination_schedule',
        stallId,
        createdAt: now,
        updatedAt: now,

        // ✅ wichtig: dueMonth muss vorhanden sein
        dueMonth: patch.dueMonth ?? now.slice(0, 7),
        nextVisitDate: patch.nextVisitDate,

        intervalMonths: patch.intervalMonths ?? 6,
        remindDaysBefore: patch.remindDaysBefore ?? 14
      };

      return this.api.createDoc(id, payload);
    }

    return this.api.updateDoc(existing._id!, {
      ...existing,
      ...patch,
      updatedAt: now
    });
  }

  async remove(doc: VaccinationSchedule): Promise<void> {
  if (!doc._id || !doc._rev) throw new Error('id/rev fehlt');
  await this.api.deleteDoc(doc._id, doc._rev);
}


}
