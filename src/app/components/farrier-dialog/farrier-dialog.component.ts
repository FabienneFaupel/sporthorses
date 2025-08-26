import { Component, Inject  } from '@angular/core';

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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';






@Component({
  selector: 'app-farrier-dialog',
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
    CommonModule,
    MatButtonToggleModule,
    MatCardModule,
    
  ],
  templateUrl: './farrier-dialog.component.html',
  styleUrl: './farrier-dialog.component.scss'
})
export class FarrierDialogComponent {

 // --- Neue Properties für ngModel ---
  selectedHorse: string | null = null;
  treatmentType: 'beschlagen' | 'ausgeschnitten' = 'beschlagen';
  treatmentDate: Date | null = new Date();
  comment: string = '';
  selectedHooves: boolean[] = [false, false, false, false];
  hoofIron: (string | null)[] = [null, null, null, null];


  hooves = [
    { name: 'Vorne Links', short: 'VL' },
    { name: 'Vorne Rechts', short: 'VR' },
    { name: 'Hinten Links', short: 'HL' },
    { name: 'Hinten Rechts', short: 'HR' }
  ];

  
  constructor(
    public dialogRef: MatDialogRef<FarrierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  toggleHoof(index: number) {
  this.selectedHooves[index] = !this.selectedHooves[index];

  if (!this.selectedHooves[index]) {
    this.hoofIron[index] = null;
  } else {
    if (this.treatmentType === 'beschlagen' && this.hoofIron[index] == null) {
      this.hoofIron[index] = 'neu'; // 👈 Default
    }
  }
}

onTreatmentTypeChange(next: 'beschlagen' | 'ausgeschnitten') {
  if (next === 'beschlagen') {
    this.selectedHooves.forEach((sel, i) => {
      if (sel && this.hoofIron[i] == null) this.hoofIron[i] = 'neu';
    });
  } else {
    this.hoofIron = this.hoofIron.map(() => null);
  }
}

 isSaveDisabled(): boolean {
  // Keine Auswahl von Pferd, Typ oder Hufen
  return (
    !this.selectedHorse ||
    !this.treatmentType ||
    this.selectedHooves.every(h => !h)
  );
}

  private formatDate(d: Date | null): string {
  const date = d ?? new Date();
  // ISO yyyy-mm-dd
  return new Date(date).toISOString().slice(0, 10);
}

save() {
  // Mappe ausgewählte Hufe auf deine Action-Enums
  const hoovesMapped = this.selectedHooves
    .map((selected, i) => {
      if (!selected) return null;

      let action: 'ausgeschnitten' | 'beschlagen-alt' | 'beschlagen-neu';
      if (this.treatmentType === 'ausgeschnitten') {
        action = 'ausgeschnitten';
      } else {
        action = this.hoofIron[i] === 'alt' ? 'beschlagen-alt' : 'beschlagen-neu';
      }

      // Position entspricht deinem Enum ('VL'|'VR'|'HL'|'HR')
      const position = this.hooves[i].short as 'VL' | 'VR' | 'HL' | 'HR';
      return { position, action };
    })
    .filter(Boolean) as { position: 'VL'|'VR'|'HL'|'HR'; action: 'ausgeschnitten'|'beschlagen-alt'|'beschlagen-neu' }[];

  const entry = {
    date: this.formatDate(this.treatmentDate),
    type: this.treatmentType === 'beschlagen' ? 'Beschlagen' : 'Nur ausgeschnitten',
    comment: this.comment?.trim() || undefined,
    hooves: hoovesMapped
  };

  this.dialogRef.close({
    horseName: this.selectedHorse, // String
    entry                              // FarrierEntry
  });
}

  close(): void {
    this.dialogRef.close();
  }
}