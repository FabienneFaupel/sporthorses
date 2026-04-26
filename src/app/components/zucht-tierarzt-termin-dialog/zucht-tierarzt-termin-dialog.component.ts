import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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

interface DialogData {
  mode: 'create' | 'edit';
  appointment: VetAppointment | null;
  lastStallion: string;
  stallions: string[];
}


@Component({
  selector: 'app-zucht-tierarzt-termin-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './zucht-tierarzt-termin-dialog.component.html',
  styleUrl: './zucht-tierarzt-termin-dialog.component.scss'
})
export class ZuchtTierarztTerminDialogComponent {
form: VetAppointment = {
    id: 0,
    type: '',
    date: this.getToday(),
    day: this.getDay(this.getToday()),
    month: this.getMonth(this.getToday()),
    time: '',
    location: '',
    vet: '',
    status: 'geplant',
    result: '',
    resultText: '',
    note: '',
  };

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

  constructor(
    private dialogRef: MatDialogRef<ZuchtTierarztTerminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.appointment) {
      this.form = { ...data.appointment };
    }
    if (data.mode === 'create' && data.lastStallion) {
    this.form.stallion = data.lastStallion;
  }
  }

  get title(): string {
    return this.data.mode === 'edit'
      ? 'Tierarzttermin bearbeiten'
      : 'Tierarzttermin hinzufügen';
  }

  get isValid(): boolean {
    return !!this.form.type?.trim() && !!this.form.date;
  }

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getDay(date: string): string {
    return new Date(date).getDate().toString().padStart(2, '0');
  }

  private getMonth(date: string): string {
    return new Intl.DateTimeFormat('de-DE', { month: 'short' })
      .format(new Date(date))
      .replace('.', '');
  }

  onDateChange(): void {
    this.form.day = this.getDay(this.form.date);
    this.form.month = this.getMonth(this.form.date);
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
  if (!this.isValid) return;

  this.onDateChange();

  if (this.form.result === 'Besamt') {
    // Priorität:
    // 1. explizit gesetzter Hengst im Termin
    // 2. letzter Hengst aus Bestellung (nur wenn keiner gesetzt ist)

    const stallion =
      this.form.stallion?.trim() || this.data.lastStallion || '';

    this.form.stallion = stallion; // wichtig: speichern!
    this.form.resultText = stallion
      ? `Besamt mit ${stallion}`
      : 'Besamt';
  } 
  else if (this.form.result?.trim()) {
    this.form.resultText = this.form.result.trim();
  } 
  else {
    this.form.resultText = '';
  }

  this.dialogRef.close({
  action: 'save',
  appointment: this.form,
});
}

delete(): void {
  const confirmed = confirm('Möchtest du diesen Tierarzttermin wirklich löschen?');

  if (!confirmed) return;

  this.dialogRef.close({
    action: 'delete',
    appointment: this.form,
  });
}
}
