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
import { Horse, FarrierEntry } from '../../models/horse';
import { toDateOnlyIsoLocal, fromDateOnlyIsoLocal } from '../../utils/date';





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
selectedHorseId: string | null = null;

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
    @Inject(MAT_DIALOG_DATA) public data: {
      horses: Horse[];
      horseId?: string;          // optional: für Edit-Vorbelegung
      entry?: FarrierEntry;      // optional: für Edit-Vorbelegung
    }
  ) {
    // Vorbelegung Pferd (Edit-Fall)
    if (data?.horseId) this.selectedHorseId = data.horseId;

    // Vorbelegung Felder (Edit-Fall)
    if (data?.entry) {
      const e = data.entry;
      this.treatmentType = (e.type === 'Beschlagen') ? 'beschlagen' : 'ausgeschnitten';
      this.treatmentDate = e.date ? fromDateOnlyIsoLocal(e.date) : new Date();
      this.comment = e.comment ?? '';

      // Hoof-Arrays aus Entry in UI-Flags umsetzen
      // reset
      this.selectedHooves = [false, false, false, false];
      this.hoofIron = [null, null, null, null];

      const positions = ['VL','VR','HL','HR'] as const;
      positions.forEach((pos, i) => {
        const found = e.hooves.find((h: { position: string }) => h.position === pos);
        if (found) {
          this.selectedHooves[i] = true;
          if (found.action === 'beschlagen-neu') this.hoofIron[i] = 'neu';
          if (found.action === 'beschlagen-alt') this.hoofIron[i] = 'alt';
          // bei ausgeschnitten bleibt null (kein Eisen)
        }
      });
    }
  }

  toggleHoof(index: number) {
    this.selectedHooves[index] = !this.selectedHooves[index];

    if (!this.selectedHooves[index]) {
      this.hoofIron[index] = null;
    } else {
      if (this.treatmentType === 'beschlagen' && this.hoofIron[index] == null) {
        this.hoofIron[index] = 'neu'; // Default
      }
    }
  }

  onTreatmentTypeChange(next: 'beschlagen' | 'ausgeschnitten') {
    this.treatmentType = next;
    if (next === 'beschlagen') {
      this.selectedHooves.forEach((sel, i) => {
        if (sel && this.hoofIron[i] == null) this.hoofIron[i] = 'neu';
      });
    } else {
      this.hoofIron = this.hoofIron.map(() => null);
    }
  }

  isSaveDisabled(): boolean {
    return (
      !this.selectedHorseId ||
      !this.treatmentType ||
      this.selectedHooves.every(h => !h)
    );
  }

  private formatDate(d: Date | null): string {
  return toDateOnlyIsoLocal(d ?? new Date());
}


  save() {
    const hoovesMapped = this.selectedHooves
      .map((selected, i) => {
        if (!selected) return null;

        let action: 'ausgeschnitten' | 'beschlagen-alt' | 'beschlagen-neu';
        if (this.treatmentType === 'ausgeschnitten') {
          action = 'ausgeschnitten';
        } else {
          action = this.hoofIron[i] === 'alt' ? 'beschlagen-alt' : 'beschlagen-neu';
        }

        const position = this.hooves[i].short as 'VL' | 'VR' | 'HL' | 'HR';
        return { position, action };
      })
      .filter(Boolean) as FarrierEntry['hooves'];

    const entry: FarrierEntry = {
      id: this.data.entry?.id,
      date: this.formatDate(this.treatmentDate),
      type: this.treatmentType === 'beschlagen' ? 'Beschlagen' : 'Ausgeschnitten',
      comment: this.comment?.trim() || undefined,
      hooves: hoovesMapped
    };

    this.dialogRef.close({
      horseId: this.selectedHorseId, // ⬅️ ID statt Name
      entry
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}