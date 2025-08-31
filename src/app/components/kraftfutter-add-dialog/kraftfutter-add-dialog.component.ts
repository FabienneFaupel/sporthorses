import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';


type KraftfutterType = 'hafer' | 'muesli' | 'zusatz';
type PackageType = 'bigbag' | 'sack';



@Component({
  selector: 'app-kraftfutter-add-dialog',
  imports: [
     CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './kraftfutter-add-dialog.component.html',
  styleUrl: './kraftfutter-add-dialog.component.scss'
})
export class KraftfutterAddDialogComponent {
form: FormGroup;

  constructor(private fb: FormBuilder) {
    // minimal: nur zum Rendern, keine Validierung/Logik
    this.form = this.fb.group({
      product: ['hafer' as KraftfutterType],
      date: [new Date()],
      packageType: ['bigbag' as PackageType],
      // BigBag
      weightKg: [null],
      // Sack
      sackWeightKg: [20],
      count: [null],
      // Allgemein
      priceEuro: [null],
      supplier: [''],
      note: [''],
    });
  }

  get isBigbag() { return this.form.value.packageType === 'bigbag'; }
  get isSack()   { return this.form.value.packageType === 'sack'; }
}