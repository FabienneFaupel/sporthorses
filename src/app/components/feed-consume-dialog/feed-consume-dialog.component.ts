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

  constructor(
    public dialogRef: MatDialogRef<FeedConsumeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConsumeDialogData
  ) {}

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