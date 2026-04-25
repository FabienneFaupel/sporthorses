import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

import { ZuchtAppointmentSheetComponent } from '../../components/zucht-appointment-sheet/zucht-appointment-sheet.component';
import { ZuchtChangeSheetComponent } from '../../components/zucht-change-sheet/zucht-change-sheet.component';

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
  ],
  templateUrl: './zucht-page.component.html',
  styleUrl: './zucht-page.component.scss'
})

export class ZuchtPageComponent {
constructor(private bottomSheet: MatBottomSheet,
  private dialog: MatDialog
) {}

  vetAppointments: VetAppointment[] = [
    {
      id: 1,
      type: 'Besamung',
      date: '05.05.2026',
      day: '05',
      month: 'Mai',
      time: '10:30 Uhr',
      location: 'Tierarztpraxis Müller',
      vet: 'Dr. Müller',
      status: 'erledigt',
      result: 'Besamt',
      resultText: 'Besamt mit Diamond Star',
      note: 'Kühlsamen von Diamond Star verwendet.',
    },
    {
      id: 2,
      type: 'Trächtigkeitskontrolle',
      date: '19.05.2026',
      day: '19',
      month: 'Mai',
      time: '10:30 Uhr',
      location: 'Tierarztpraxis Müller',
      vet: 'Ultraschall',
      status: 'geplant',
      result: '',
    },
    {
      id: 3,
      type: 'Nachkontrolle',
      date: '26.05.2026',
      day: '26',
      month: 'Mai',
      time: '09:00 Uhr',
      location: 'Stall Fampel',
      vet: 'Dr. Schneider',
      status: 'fällig',
      result: '',
    },
  ];

  resultOptions: Record<string, string[]> = {
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
    this.bottomSheet.open(ZuchtChangeSheetComponent, {
      panelClass: 'vet-bottom-sheet',
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

  dialogRef.afterClosed().subscribe((result?: HeatCycle) => {
    if (!result) return;

    if (heatCycle) {
      const index = this.heatCycles.findIndex(h => h.id === heatCycle.id);

      if (index !== -1) {
        this.heatCycles[index] = {
          ...result,
          id: heatCycle.id,
        };
      }

      return;
    }

    this.heatCycles.push({
      ...result,
      id: Date.now(),
    });
  });
}
}