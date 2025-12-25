import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { VaccinationDialogComponent } from '../../components/vaccination-dialog/vaccination-dialog.component';

import { DataService} from '../../services/data.service';
import { Horse, Vaccination } from '../../models/horse';
import { VaccinationSchedule } from '../../models/vaccination-schedule';


@Component({
  selector: 'app-vaccination-page',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    VaccinationDialogComponent,
    
  ],
  templateUrl: './vaccination-page.component.html',
  styleUrl: './vaccination-page.component.scss'
})
export class VaccinationPageComponent {
  horses: Horse[] = [];

  schedule: VaccinationSchedule | null = null;
  selectedVisit: Date | null = null;
  remindDaysBefore = 14;

  editPlan = false;
  editDueMonth: string | null = null;     // "YYYY-MM"
  editReminderDays: number = 14;

  private todayYYYYMM(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

startEditPlan() {
  this.editPlan = true;

  // defaults aus current schedule oder heute
  const s = this.schedule;
  this.editDueMonth = s?.dueMonth ?? this.todayYYYYMM();
  this.editReminderDays = s?.remindDaysBefore ?? 14;
}

async savePlanSettings() {
  if (!this.editDueMonth) return;

  // Plan auf neuen dueMonth setzen, Termin löschen (weil sonst inkonsistent)
  await this.dataService.saveVaccinationScheduleDueMonth(
    this.editDueMonth,
    this.schedule?.intervalMonths ?? 6,
    Number(this.editReminderDays) || 14
  );

  this.schedule = this.dataService.getVaccinationSchedule();
  this.editPlan = false;
}

cancelEditPlan() {
  this.editPlan = false;
}






  constructor(
    private dialog: MatDialog,
    public dataService: DataService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.dataService.loadHorsesFromDb();
    this.horses = this.dataService.getHorses();

    await this.dataService.loadVaccinationScheduleFromDb();
    this.schedule = this.dataService.getVaccinationSchedule();

    // UI defaults, falls Schedule existiert:
    if (this.schedule?.remindDaysBefore != null) {
      this.remindDaysBefore = this.schedule.remindDaysBefore;
    }
  }

  // ---------- Helpers ----------

  get scheduleStatus(): 'ok' | 'soon' | 'overdue' | 'none' {
    if (!this.schedule) return 'none';
    return this.dataService.getScheduleStatus(this.schedule);
  }

  formatDate(iso?: string): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return iso;
    return `${d}.${m}.${y}`;
  }

  formatMonth(yyyymm?: string): string {
    if (!yyyymm) return '';
    const [y, m] = yyyymm.split('-');
    const names = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
    const idx = Number(m) - 1;
    return `${names[idx] ?? m} ${y}`;
  }

  private toISODate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  private addMonthsToYYYYMM(yyyymm: string, add: number): string {
  const [y, m] = yyyymm.split('-').map(Number);
  const d = new Date(y, m - 1, 1);
  d.setMonth(d.getMonth() + add);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}


  // ---------- Schedule Actions ----------

  /**
   * Setzt/ändert einen konkreten Termin (und damit automatisch dueMonth).
   * Wenn bereits ein dueMonth existiert (z.B. "2026-06"), muss das Datum in diesem Monat liegen.
   */
  async setSchedule(): Promise<void> {
  if (!this.selectedVisit) return;

  const iso = this.toISODate(this.selectedVisit);
  const chosenMonth = iso.slice(0, 7);

  if (this.schedule?.dueMonth) {
    const due = this.schedule.dueMonth;
    const dueMinus1 = this.addMonthsToYYYYMM(due, -1);
    const duePlus1  = this.addMonthsToYYYYMM(due, 1);

    const ok = chosenMonth === due || chosenMonth === dueMinus1 || chosenMonth === duePlus1;
    if (!ok) {
      alert(
        `Bitte ein Datum im fälligen Monat (${this.formatMonth(due)}) ` +
        `oder 1 Monat davor (${this.formatMonth(dueMinus1)}) / danach (${this.formatMonth(duePlus1)}) wählen.`
      );
      return;
    }
  }

  await this.dataService.saveVaccinationScheduleDate(
    iso,
    this.schedule?.intervalMonths ?? 6,
    Number(this.remindDaysBefore) || 14
  );

  this.schedule = this.dataService.getVaccinationSchedule();
  this.selectedVisit = null;
}


  /**
   * ✅ erledigt -> springt 6 Monate weiter (nur Monat), Datum wird leer.
   */
  async markVisitDone(): Promise<void> {
    await this.dataService.markScheduleDoneMoveToNextMonth();
    this.schedule = this.dataService.getVaccinationSchedule();
    this.selectedVisit = null;
  }

  // ---------- Vaccinations ----------

  openVaccinationDialog(): void {
    const ref = this.dialog.open(VaccinationDialogComponent, {
      width: '400px',
      data: { mode: 'new', horses: this.horses }
    });

    ref.afterClosed().subscribe(async (res?: { horseIds: string[]; entry: Vaccination }) => {
      if (!res) return;
      try {
        for (const id of res.horseIds) {
          await this.dataService.addVaccination(id, res.entry);
        }
        this.horses = this.dataService.getHorses();
      } catch (e) {
        console.error('Save vaccination failed', e);
      }
    });
  }

  editVaccination(horseId: string, index: number, original: Vaccination) {
    const ref = this.dialog.open(VaccinationDialogComponent, {
      width: '400px',
      data: { mode: 'edit', horses: this.horses, horseId, vaccination: original }
    });

    ref.afterClosed().subscribe(async (res?: { horseId: string; entry: Vaccination }) => {
      if (!res) return;
      try {
        await this.dataService.updateVaccination(horseId, index, res.entry);
        this.horses = this.dataService.getHorses();
      } catch (e) {
        console.error('Update vaccination failed', e);
      }
    });
  }

  async deleteVaccination(horseId: string, index: number) {
    if (!confirm('Diesen Impfeintrag wirklich löschen?')) return;
    try {
      await this.dataService.deleteVaccination(horseId, index);
      this.horses = this.dataService.getHorses();
    } catch (e) {
      console.error('Delete vaccination failed', e);
    }
  }

  getVaccinationDisplayStatus(vac: Vaccination): 'geimpft' | 'geplant' | 'überfällig' {
  if (vac.status === 'geimpft') return 'geimpft';

  // falls kein Datum da ist: als geplant behandeln
  if (!vac.date) return 'geplant';

  const today = new Date();
  today.setHours(0,0,0,0);

  const d = new Date(vac.date + 'T00:00:00');
  return d < today ? 'überfällig' : 'geplant';
}

getVaccinationStatusLabel(st: 'geimpft' | 'geplant' | 'überfällig'): string {
  if (st === 'geimpft') return 'geimpft';
  if (st === 'überfällig') return 'überfällig';
  return 'geplant';
}

async markVaccinationDone(horseId: string, index: number) {
  await this.dataService.updateVaccination(horseId, index, { status: 'geimpft' });
  this.horses = this.dataService.getHorses();
}


async resetSchedule() {
  const ok = confirm('Plan wirklich zurücksetzen?\nTermin/Reminder werden entfernt.');
  if (!ok) return;

  await this.dataService.resetVaccinationSchedule();
  this.schedule = this.dataService.getVaccinationSchedule(); // ist dann null

  this.selectedVisit = null;
  this.editPlan = false;
}




}