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
import { toDateOnlyIsoLocal, fromDateOnlyIsoLocal } from '../../utils/date';

export interface AddDialogData {
  type: 'hay' | 'straw';
}


@Component({
  selector: 'app-feed-add-dialog',
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
  templateUrl: './feed-add-dialog.component.html',
  styleUrl: './feed-add-dialog.component.scss'
})
export class FeedAddDialogComponent {
  amount: number = 1;
  price: number = 0;
  date: Date = new Date();
  type: 'heu' | 'stroh' = 'heu'; // Default: Heu

  constructor(
  public dialogRef: MatDialogRef<FeedAddDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
) {
  if (data) {
    this.type = data.type ?? this.type;
    this.amount = data.amount ?? this.amount;
    this.price = data.price ?? this.price;
    this.date = data?.date
  ? (typeof data.date === 'string'
      ? fromDateOnlyIsoLocal(data.date)
      : data.date)
  : this.date;

  }
}


  confirm() {
  this.dialogRef.close({
    type: this.type,
    date: toDateOnlyIsoLocal(this.date),
    amount: this.amount,
    price: this.price
  });
}

  cancel() {
    this.dialogRef.close();
  }
}