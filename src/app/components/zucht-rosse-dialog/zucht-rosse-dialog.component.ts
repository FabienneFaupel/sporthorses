import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

interface HeatCycle {
  id: number;
  startDate: string;
  endDate: string;
  intensity: 'leicht' | 'normal' | 'stark';
  note: string;
}

interface DialogData {
  mode: 'create' | 'edit';
  heatCycle: HeatCycle | null;
}

interface HeatDialogResult {
  action: 'save' | 'delete';
  heatCycle?: HeatCycle;
}


@Component({
  selector: 'app-zucht-rosse-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
MatNativeDateModule,
MatIconModule,
  ],
  templateUrl: './zucht-rosse-dialog.component.html',
  styleUrl: './zucht-rosse-dialog.component.scss'
})
export class ZuchtRosseDialogComponent {
form: HeatCycle = {
  id: 0,
  startDate: this.getToday(),
  endDate: '',
  intensity: 'normal',
  note: '',
};

private getToday(): string {
  return new Date().toISOString().split('T')[0];
}

get isValid(): boolean {
  return !!this.form.startDate && !!this.form.intensity;
}

  constructor(
    private dialogRef: MatDialogRef<ZuchtRosseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.heatCycle) {
      this.form = { ...data.heatCycle };
    }
  }

  get title(): string {
    return this.data.mode === 'edit' ? 'Rosse bearbeiten' : 'Rosse hinzufügen';
  }

  close(): void {
    this.dialogRef.close();
  }

 save(): void {
  if (!this.isValid) return;

  this.dialogRef.close({
    action: 'save',
    heatCycle: this.form,
  });
}

delete(): void {
  const confirmed = confirm('Möchtest du diesen Rosse-Eintrag wirklich löschen?');

  if (!confirmed) return;

  this.dialogRef.close({
    action: 'delete',
    heatCycle: this.form,
  });
}
}