import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ZuchtRosseDialogComponent } from '../../components/zucht-rosse-dialog/zucht-rosse-dialog.component';
import { ZuchtZyklusSettingsDialogComponent } from '../../components/zucht-zyklus-settings-dialog/zucht-zyklus-settings-dialog.component';
import { ZuchtAppointmentSheetComponent } from '../../components/zucht-appointment-sheet/zucht-appointment-sheet.component';
import { ZuchtChangeSheetComponent } from '../../components/zucht-change-sheet/zucht-change-sheet.component';
import { ZuchtSamenBestellenDialogComponent } from '../../components/zucht-samen-bestellen-dialog/zucht-samen-bestellen-dialog.component';
import { ZuchtTierarztTerminDialogComponent } from '../../components/zucht-tierarzt-termin-dialog/zucht-tierarzt-termin-dialog.component';

import { DataService } from '../../services/data.service';
import { Horse } from '../../models/horse';
import { MatMenuModule } from '@angular/material/menu';
import { ZuchtHorseSelectSheetComponent } from '../../components/zucht-horse-select-sheet/zucht-horse-select-sheet.component';

type VetStatus = 'geplant' | 'fällig' | 'erledigt' | 'ausgefallen';

interface VetAppointment {
  id: number;
  type: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  vet: string;
  status: VetStatus;
  result?: string;
  resultText?: string;
  note?: string;
  stallion?: string;
}

interface CompleteSheetResult {
  result: string;
  note: string;
}

interface HeatCycle {
  id: number;
  startDate: string;
  endDate: string;
  intensity: 'leicht' | 'normal' | 'stark';
  note: string;
}

interface InseminationOrder {
  id: number;
  stallion: string;
  semenType: 'Frischsamen' | 'Kühlsamen' | 'TG-Samen';
  orderDate: string;
  orderTime: string;
  costs: number;
  stallionStation: string; // bleibt
  inseminationDate: string;
  inseminationTime: string;
  vet: string;
  location: string;
   hasAppointment?: boolean;
}

interface BreedingCycle {
  id: number;
  horseId: string;
  year: number;
  stallion: string;
  status: 'aktiv' | 'fohlen geboren' | 'nicht tragend';
}


@Component({
  selector: 'app-zucht-page',
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatBottomSheetModule,
    ZuchtAppointmentSheetComponent,
    ZuchtChangeSheetComponent,
    MatDialogModule,
ZuchtRosseDialogComponent,
ZuchtZyklusSettingsDialogComponent,
ZuchtSamenBestellenDialogComponent,
ZuchtTierarztTerminDialogComponent,
MatMenuModule,
ZuchtHorseSelectSheetComponent,
  ],
  templateUrl: './zucht-page.component.html',
  styleUrl: './zucht-page.component.scss'
})

export class ZuchtPageComponent {
  
constructor(
  private bottomSheet: MatBottomSheet,
  private dialog: MatDialog,
  private data: DataService
) {}

horses: Horse[] = [];
selectedHorse: Horse | null = null;
breedingCycles: BreedingCycle[] = [];
activeCycleId: number | null = null;

async ngOnInit(): Promise<void> {
  if (this.data.getHorses().length === 0) {
    await this.data.loadHorsesFromDb();
  }

  this.horses = this.data.getHorses();
  this.selectedHorse =
  this.mares.find(h => h.name.toLowerCase().includes('dorina')) ??
  this.mares[0] ??
  this.horses[0] ??
  null;
}

selectHorse(horse: Horse): void {
  this.selectedHorse = horse;
}

getSelectedHorseSubtitle(): string {
  if (!this.selectedHorse) return '';

  const age = this.data.getDisplayAge(this.selectedHorse);
  const gender =
    (this.selectedHorse as any).gender ||
    (this.selectedHorse as any).sex ||
    'Pferd';

  return `${age} Jahre · ${gender}`;
}

  vetAppointments: VetAppointment[] = [];

  resultOptions: Record<string, string[]> = {
  Follikelkontrolle: [
    'Follikel vorhanden',
    'Follikel noch zu klein',
    'Eisprung erfolgt',
    'Keine Besamung empfohlen',
    'Kontrolle nötig',
  ],
  Besamung: ['Besamt', 'Nicht besamt', 'Verschoben'],
  Trächtigkeitskontrolle: [
    'Tragend',
    'Nicht tragend',
    'Unklar',
    'Nachkontrolle nötig',
  ],
  Nachkontrolle: [
    'Alles unauffällig',
    'Weitere Kontrolle nötig',
    'Behandlung nötig',
  ],
  Sonstiges: ['Erledigt', 'Kontrolle nötig', 'Unklar'],
};

  get nextAppointments(): VetAppointment[] {
    return this.vetAppointments.filter(
      appointment =>
        appointment.status === 'geplant' || appointment.status === 'fällig'
    );
  }

  openCompleteSheet(appointment: VetAppointment): void {
    const sheetRef = this.bottomSheet.open(ZuchtAppointmentSheetComponent, {
      data: {
        appointment,
        options: this.resultOptions[appointment.type] ?? ['Erledigt'],
      },
      panelClass: 'vet-bottom-sheet',
    });

    sheetRef.afterDismissed().subscribe((result?: CompleteSheetResult) => {
      if (!result) return;

      appointment.status = 'erledigt';
      appointment.result = result.result;
      appointment.resultText = result.result;
      appointment.note = result.note;
    });
  }

  openCycleSheet(): void {
  const sheetRef = this.bottomSheet.open(ZuchtChangeSheetComponent, {
    panelClass: 'vet-bottom-sheet',
    data: {
      cycles: this.selectedHorseCycles,
      activeCycleId: this.activeCycleId,
      currentYear: new Date().getFullYear(),
      defaultStallion:
        this.latestInseminationOrder?.stallion ||
        this.activeCycle?.stallion ||
        '',
      horseId: this.selectedHorse?._id,
    },
  });

  sheetRef.afterDismissed().subscribe(result => {
    if (!result || !this.selectedHorse?._id) return;

    if (result.action === 'select') {
      this.activeCycleId = result.cycleId;
      return;
    }

    if (result.action === 'create') {
      const newCycle: BreedingCycle = {
        id: Date.now(),
        horseId: this.selectedHorse._id,
        year: result.year,
        stallion: this.latestInseminationOrder?.stallion || '',
        status: 'aktiv',
      };

      this.breedingCycles.push(newCycle);
      this.activeCycleId = newCycle.id;
      return;
    }

    if (result.action === 'delete') {
      this.breedingCycles = this.breedingCycles.filter(
        cycle => cycle.id !== result.cycleId
      );

      if (this.activeCycleId === result.cycleId) {
        this.activeCycleId = this.selectedHorseCycles[0]?.id ?? null;
      }
    }
  });
}

  markCancelled(appointment: VetAppointment): void {
    appointment.status = 'ausgefallen';
    appointment.result = '';
    appointment.resultText = 'Termin ist ausgefallen';
    appointment.note = '';
  }

  heatCycles: HeatCycle[] = [];

openHeatDialog(heatCycle?: HeatCycle): void {
  const dialogRef = this.dialog.open(ZuchtRosseDialogComponent, {
    width: '90vw',
    maxWidth: '420px',
    data: {
      mode: heatCycle ? 'edit' : 'create',
      heatCycle: heatCycle ? { ...heatCycle } : null,
    },
  });

  dialogRef.afterClosed().subscribe((result?: any) => {
  if (!result) return;

  if (result.action === 'delete' && heatCycle) {
    this.heatCycles = this.heatCycles.filter(h => h.id !== heatCycle.id);
    return;
  }

  if (result.action !== 'save' || !result.heatCycle) return;

  if (heatCycle) {
    const index = this.heatCycles.findIndex(h => h.id === heatCycle.id);

    if (index !== -1) {
      this.heatCycles[index] = {
        ...result.heatCycle,
        id: heatCycle.id,
      };
    }

    return;
  }

  this.heatCycles.push({
    ...result.heatCycle,
    id: Date.now(),
  });
});
}

cycleSettings = {
  heatCycleDays: 21,
  pregnancyDays: 350,
};

pregnancyConfirmed = false;

get lastHeatCycle(): HeatCycle | null {
  if (this.heatCycles.length === 0) return null;
  return this.heatCycles[this.heatCycles.length - 1];
}

get nextExpectedHeatDate(): Date | null {
  if (!this.lastHeatCycle) return null;

  const startDate = new Date(this.lastHeatCycle.startDate);
  startDate.setDate(startDate.getDate() + this.cycleSettings.heatCycleDays);

  return startDate;
}

formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('de-DE').format(new Date(date));
}

openCycleSettingsDialog(): void {
  const dialogRef = this.dialog.open(ZuchtZyklusSettingsDialogComponent, {
    width: '90vw',
    maxWidth: '420px',
    data: { ...this.cycleSettings },
  });

  dialogRef.afterClosed().subscribe((result?: typeof this.cycleSettings) => {
    if (!result) return;

    this.cycleSettings = result;
  });
}

inseminationOrders: InseminationOrder[] = [];

openInseminationDialog(order?: InseminationOrder): void {
  const dialogRef = this.dialog.open(ZuchtSamenBestellenDialogComponent, {
    width: '90vw',
    maxWidth: '460px',
    data: {
      mode: order ? 'edit' : 'create',
      order: order ? { ...order } : null,
    },
  });

  dialogRef.afterClosed().subscribe((result?: InseminationOrder) => {
    if (!result) return;

    // 🔁 EDIT
    if (order) {
      const index = this.inseminationOrders.findIndex(o => o.id === order.id);

      if (index !== -1) {
        this.inseminationOrders[index] = {
          ...result,
          id: order.id,
        };
      }

      return;
    }

    // ➕ NEU
    const newOrder = {
      ...result,
      id: Date.now(),
    };

    this.inseminationOrders.push(newOrder);

    // 👉 HIER passiert die Magie
    this.createVetAppointmentFromInsemination(newOrder);
  });
}
openVetAppointmentDialog(appointment?: VetAppointment): void {
  const dialogRef = this.dialog.open(ZuchtTierarztTerminDialogComponent, {
    width: '90vw',
    maxWidth: '460px',
    data: {
  mode: appointment ? 'edit' : 'create',
  appointment: appointment ? { ...appointment } : null,
  lastStallion: this.inseminationOrders.length
    ? this.inseminationOrders[this.inseminationOrders.length - 1].stallion
    : '',
  stallions: [...new Set(this.inseminationOrders.map(order => order.stallion))],
},
  });

  dialogRef.afterClosed().subscribe((result?: VetAppointment) => {
    if (!result) return;

    if (appointment) {
      const index = this.vetAppointments.findIndex(a => a.id === appointment.id);

      if (index !== -1) {
        this.vetAppointments[index] = {
          ...result,
          id: appointment.id,
        };
      }

      return;
    }

    this.vetAppointments.push({
      ...result,
      id: Date.now(),
    });
  });
}

private createVetAppointmentFromInsemination(order: InseminationOrder): void {
  if (!order.hasAppointment || !order.inseminationDate) return;

  this.vetAppointments.push({
    id: Date.now(),
    type: 'Besamung',
    date: order.inseminationDate,
    day: new Date(order.inseminationDate).getDate().toString().padStart(2, '0'),
    month: new Intl.DateTimeFormat('de-DE', { month: 'short' })
      .format(new Date(order.inseminationDate))
      .replace('.', ''),
    time: order.inseminationTime || '',
    location: order.location || '',
    vet: order.vet || '',
    status: 'geplant',
    result: '',
    resultText: '',
    note: '',
    stallion: order.stallion,
  });
}

getHorseSubtitle(horse: Horse): string {
  const age = this.data.getDisplayAge(horse);

  const gender =
    (horse as any).gender ||
    (horse as any).sex ||
    'Pferd';

  return `${age} Jahre · ${gender}`;
}

get mares(): Horse[] {
  return this.horses.filter(h => {
    const gender =
      (h as any).gender ||
      (h as any).sex ||
      '';

    return gender.toLowerCase() === 'stute';
  });
}

openHorseSelectSheet(): void {
  const sheetRef = this.bottomSheet.open(ZuchtHorseSelectSheetComponent, {
    panelClass: 'horse-select-sheet-panel',
    data: {
      horses: this.mares,
      selectedHorseId: this.selectedHorse?._id,
    },
  });

  sheetRef.afterDismissed().subscribe((horse?: Horse) => {
    if (!horse) return;
    this.selectHorse(horse);
  });
}

get latestInseminationOrder(): InseminationOrder | null {
  if (this.inseminationOrders.length === 0) return null;

  return [...this.inseminationOrders].sort(
    (a, b) =>
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  )[0];
}

get confirmedPregnancyAppointment(): VetAppointment | null {
  return (
    this.vetAppointments.find(appointment =>
      appointment.type === 'Trächtigkeitskontrolle' &&
      appointment.status === 'erledigt' &&
      appointment.resultText?.toLowerCase() === 'tragend'
    ) ?? null
  );
}

get isPregnant(): boolean {
  return !!this.confirmedPregnancyAppointment;
}

get currentStatusText(): string {
  if (this.isPregnant) return 'Tragend';
  if (this.latestInseminationOrder) return 'Besamt';
  if (this.lastHeatCycle) return 'Rosse erfasst';
  return 'Noch nicht angegeben';
}

get stallionLabel(): string {
  return this.isPregnant ? 'Hengst' : 'Hengst (Samen bestellt)';
}

get currentStallionText(): string {
  return this.latestInseminationOrder?.stallion || 'Noch nicht angegeben';
}

get lastHeatText(): string {
  if (!this.lastHeatCycle) return 'Noch nicht angegeben';

  const start = this.formatDate(this.lastHeatCycle.startDate);

  if (!this.lastHeatCycle.endDate) {
    return start;
  }

  return `${start} – ${this.formatDate(this.lastHeatCycle.endDate)}`;
}

get nextHeatText(): string {
  if (!this.nextExpectedHeatDate) return '-';

  return `ca. ${this.formatDate(this.nextExpectedHeatDate)}`;
}

get foalExpectedDate(): Date | null {
  const appointment = this.confirmedPregnancyAppointment;
  if (!appointment) return null;

  const date = new Date(appointment.date);
  date.setDate(date.getDate() + this.cycleSettings.pregnancyDays);

  return date;
}

get foalExpectedText(): string {
  if (!this.foalExpectedDate) return '';

  return this.formatDate(this.foalExpectedDate);
}

get activeCycleTitle(): string {
  if (!this.activeCycle) return 'Noch kein Zuchtzyklus';

  if (!this.activeCycle.stallion) {
    return `${this.activeCycle.year}`;
  }

  return `${this.activeCycle.year} · ${this.activeCycle.stallion}`;
}

get activeCycleSubtitle(): string {
  if (!this.activeCycle) return 'Lege einen Zyklus für dieses Pferd an';

  if (this.isPregnant) return 'Tragend · Fohlen erwartet';
  if (this.latestInseminationOrder) return 'Besamt · Trächtigkeitskontrolle offen';
  if (this.lastHeatCycle) return 'Rosse erfasst';

  return this.activeCycle.status;
}

get selectedHorseCycles(): BreedingCycle[] {
  if (!this.selectedHorse?._id) return [];

  return this.breedingCycles
    .filter(cycle => cycle.horseId === this.selectedHorse!._id)
    .sort((a, b) => b.year - a.year);
}

get activeCycle(): BreedingCycle | null {
  return this.selectedHorseCycles.find(cycle => cycle.id === this.activeCycleId) ?? null;
}
}