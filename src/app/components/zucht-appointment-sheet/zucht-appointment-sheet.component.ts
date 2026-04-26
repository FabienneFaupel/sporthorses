import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

interface VetAppointment {
  id: string;
  type: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  vet: string;
  status: string;
  result?: string;
  resultText?: string;
  note?: string;
}

interface CompleteSheetData {
  appointment: VetAppointment;
  options: string[];
}


@Component({
  selector: 'app-zucht-appointment-sheet',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './zucht-appointment-sheet.component.html',
  styleUrl: './zucht-appointment-sheet.component.scss'
})
export class ZuchtAppointmentSheetComponent {
selectedResult = '';
  note = '';

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ZuchtAppointmentSheetComponent>,
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