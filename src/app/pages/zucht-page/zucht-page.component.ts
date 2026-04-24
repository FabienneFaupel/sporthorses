import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
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
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

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

interface CompleteSheetData {
  appointment: VetAppointment;
  options: string[];
}

interface CompleteSheetResult {
  result: string;
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
    MatBottomSheetModule
  ],
  templateUrl: './zucht-page.component.html',
  styleUrl: './zucht-page.component.scss'
})

export class ZuchtPageComponent {
constructor(private bottomSheet: MatBottomSheet) {}

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
    const sheetRef = this.bottomSheet.open(CompleteVetAppointmentSheetComponent, {
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

  markCancelled(appointment: VetAppointment): void {
    appointment.status = 'ausgefallen';
    appointment.result = '';
    appointment.resultText = 'Termin ist ausgefallen';
    appointment.note = '';
  }
}

@Component({
  selector: 'app-complete-vet-appointment-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  template: `
    <div class="complete-sheet">
      <div class="sheet-handle"></div>

      <div class="sheet-header">
        <div>
          <span>Termin abschließen</span>
          <h3>{{ data.appointment.type }}</h3>
          <p>
            {{ data.appointment.date }} · {{ data.appointment.time }}<br />
            {{ data.appointment.location }} · {{ data.appointment.vet }}
          </p>
        </div>

        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-form-field appearance="outline" class="sheet-field">
        <mat-label>Ergebnis</mat-label>
        <mat-select [(ngModel)]="selectedResult">
          <mat-option *ngFor="let option of data.options" [value]="option">
            {{ option }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="sheet-field">
        <mat-label>Notiz</mat-label>
        <textarea
          matInput
          rows="3"
          [(ngModel)]="note"
          placeholder="z. B. Kontrolle in 14 Tagen, Follikel sichtbar..."
        ></textarea>
      </mat-form-field>

      <div class="sheet-actions">
        <button mat-button (click)="close()">Abbrechen</button>

        <button
          mat-raised-button
          class="save-button"
          [disabled]="!selectedResult"
          (click)="save()"
        >
          Speichern
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .complete-sheet {
        padding: 10px 16px 22px;
      }

      .sheet-handle {
        width: 42px;
        height: 4px;
        border-radius: 999px;
        background: #ddd;
        margin: 0 auto 14px;
      }

      .sheet-header {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
      }

      .sheet-header span {
        color: #777;
        font-size: 13px;
      }

      .sheet-header h3 {
        margin: 2px 0 4px;
        font-size: 22px;
        font-weight: 800;
      }

      .sheet-header p {
        margin: 0;
        color: #666;
        font-size: 13px;
        line-height: 1.4;
      }

      .sheet-field {
        width: 100%;
        margin-bottom: 10px;
      }

      .sheet-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .sheet-actions button {
        border-radius: 999px;
      }

      .save-button {
        background: #e235d6 !important;
        color: white !important;
      }
    `,
  ],
})
export class CompleteVetAppointmentSheetComponent {
  selectedResult = '';
  note = '';

  constructor(
    private bottomSheetRef: MatBottomSheetRef<CompleteVetAppointmentSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: CompleteSheetData
  ) {}

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  save(): void {
    if (!this.selectedResult) return;

    this.bottomSheetRef.dismiss({
      result: this.selectedResult,
      note: this.note.trim(),
    });
  }
}
