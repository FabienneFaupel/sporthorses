import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Vaccination, Horse } from '../../models/horse';



@Component({
  selector: 'app-vaccination-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './vaccination-dialog.component.html',
  styleUrl: './vaccination-dialog.component.scss'
})
export class VaccinationDialogComponent {
 selectedHorseIds: string[] = [];
  vaccineType: 'Influenza' | 'Tetanus' | 'Herpes' | null = null;
  vaccinationDate: Date | null = new Date();
  status: 'geimpft' | 'überfällig' | 'geplant' = 'geimpft';

  constructor(
  public dialogRef: MatDialogRef<VaccinationDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: {
    mode?: 'new' | 'edit';
    horses: Horse[];
    horseId?: string;
    vaccination?: Vaccination | { type?: string; date?: string; status?: string }; // <- tolerant
  }
) {
  if (data?.mode === 'edit' && data.vaccination) {
    if (data.horseId) this.selectedHorseIds = [data.horseId];

    // Impfungs-Typ sicher casten
    const allowedTypes = ['Influenza', 'Tetanus', 'Herpes'] as const;
    const inType = (data.vaccination as any).type;
    this.vaccineType = allowedTypes.includes(inType) ? inType : 'Influenza';

    // Datum
    const inDate = (data.vaccination as any).date;
    this.vaccinationDate = inDate ? new Date(inDate) : new Date();

    // Status sicher casten
    const allowedStatus = ['geimpft', 'überfällig', 'geplant'] as const;
    const inStatus = (data.vaccination as any).status;
    this.status = allowedStatus.includes(inStatus) ? inStatus : 'geimpft';
  }
}

  isDisabled(): boolean {
    return (
      !this.selectedHorseIds.length ||
      !this.vaccineType ||
      !this.vaccinationDate ||
      !this.status
    );
  }

  private toIsoDate(d: Date | null): string {
    return new Date(d ?? new Date()).toISOString().slice(0, 10);
  }

  save(): void {
    const entry: Vaccination = {
      type: this.vaccineType!,
      date: this.toIsoDate(this.vaccinationDate),
      status: this.status
      // next: können wir später automatisch berechnen, wenn du magst
    };

    if (this.data?.mode === 'edit') {
      this.dialogRef.close({
        horseId: this.selectedHorseIds[0],
        entry
      });
    } else {
      this.dialogRef.close({
        horseIds: this.selectedHorseIds,
        entry
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}