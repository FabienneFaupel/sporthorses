import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface CycleSettings {
  heatCycleDays: number;
  pregnancyDays: number;
}

@Component({
  selector: 'app-zucht-zyklus-settings-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './zucht-zyklus-settings-dialog.component.html',
  styleUrl: './zucht-zyklus-settings-dialog.component.scss'
})
export class ZuchtZyklusSettingsDialogComponent {
form: CycleSettings = {
    heatCycleDays: 21,
    pregnancyDays: 350,
  };

  constructor(
    private dialogRef: MatDialogRef<ZuchtZyklusSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CycleSettings
  ) {
    this.form = { ...data };
  }

  get isValid(): boolean {
    return (
      this.form.heatCycleDays > 0 &&
      this.form.pregnancyDays > 0
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (!this.isValid) return;
    this.dialogRef.close(this.form);
  }
}