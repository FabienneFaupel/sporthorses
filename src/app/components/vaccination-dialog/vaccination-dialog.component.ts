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
 // STATE + Defaults
  selectedHorseIds: string[] = [];
  vaccineType: 'Influenza' | 'Tetanus' | 'Herpes' | null = null;
  vaccinationDate: Date | null = new Date(); // heute vorgewählt
  status: 'geimpft' | 'überfällig' | 'geplant' = 'geimpft'; // Default

  constructor(
    public dialogRef: MatDialogRef<VaccinationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { horses: Array<{ _id?: string; name: string }> }
  ) {}

  isDisabled(): boolean {
    return (
      !this.selectedHorseIds.length ||
      !this.vaccineType ||
      !this.vaccinationDate ||
      !this.status
    );
  }

  private toIsoDate(d: Date | null): string {
    const date = d ?? new Date();
    return new Date(date).toISOString().slice(0, 10); // YYYY-MM-DD
  }

  save(): void {
    // Noch keine DB-Schreiberei – wir geben die Werte nur sauber zurück.
    this.dialogRef.close({
      horseIds: this.selectedHorseIds,
      entry: {
        type: this.vaccineType!,
        date: this.toIsoDate(this.vaccinationDate),
        status: this.status
        // "next" können wir später ergänzen, wenn du möchtest (z.B. automatisch +6 Monate bei Influenza)
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}