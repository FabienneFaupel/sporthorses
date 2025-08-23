import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';




export interface ConsumeDialogData {
  type: 'hay' | 'straw';
}

@Component({
  selector: 'app-feed-consume-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule,

  ],
  templateUrl: './feed-consume-dialog.component.html',
  styleUrl: './feed-consume-dialog.component.scss'
})
export class FeedConsumeDialogComponent {
 amount: number = 1;
 date: Date = new Date();
 type: 'heu' | 'stroh' = 'heu'; // Default: Heu
 hayCurrent = 0;
 strawCurrent = 0;

  constructor(
  public dialogRef: MatDialogRef<FeedConsumeDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
) {
  if (data) {
    this.type = data.type ?? this.type;
    this.amount = data.amount ?? this.amount;
    this.date = data.date ? new Date(data.date) : this.date;

    this.hayCurrent = data.hayCurrent ?? 0;
    this.strawCurrent = data.strawCurrent ?? 0;
  }
}


get maxAmount(): number {
  return this.type === 'heu' ? this.hayCurrent : this.strawCurrent;
}

  confirm() {
  this.dialogRef.close({
    type: this.type,
    date: this.date,
    amount: this.amount,
  });
}

  cancel() {
    this.dialogRef.close();
  }
}