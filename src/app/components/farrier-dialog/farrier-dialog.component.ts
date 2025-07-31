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
  treatmentDate: Date | null = null;
  selectedHooves: boolean[] = [false, false, false, false];
  hoofIron: (string | null)[] = [null, null, null, null];


  hooves = [
    { name: 'Vorne Links', short: 'VL' },
    { name: 'Vorne Rechts', short: 'VR' },
    { name: 'Hinten Links', short: 'HL' },
    { name: 'Hinten Rechts', short: 'HR' }
  ];

  

  isSaveDisabled(): boolean {
  // Keine Auswahl von Pferd, Typ oder Hufen
  return (
    !this.selectedHorse ||
    !this.treatmentType ||
    this.selectedHooves.every(h => !h)
  );
}



  constructor(
    public dialogRef: MatDialogRef<FarrierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  toggleHoof(index: number) {
    this.selectedHooves[index] = !this.selectedHooves[index];

    // Wenn Huf abgewählt -> Auswahl für Eisen löschen
    if (!this.selectedHooves[index]) {
      this.hoofIron[index] = null;
    }
  }

  save() {
    const newTreatment = {
      horse: this.selectedHorse,
      type: this.treatmentType,
      date: this.treatmentDate,
      hooves: this.selectedHooves
        .map((selected, i) =>
          selected
            ? {
                hoof: this.hooves[i].name,
                iron: this.treatmentType === 'beschlagen' ? this.hoofIron[i] : null
              }
            : null
        )
        .filter(h => h)
    };

    this.dialogRef.close(newTreatment);
  }

  close(): void {
    this.dialogRef.close();
  }
}