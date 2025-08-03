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
 selectedDate: Date = new Date();
 selectedFeed: 'hay' | 'straw' = 'hay'; // Default: Heu

  constructor(
    public dialogRef: MatDialogRef<FeedAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddDialogData
  ) {}

  confirm() {
    this.dialogRef.close({ amount: this.amount, price: this.price });
  }

  cancel() {
    this.dialogRef.close();
  }
}