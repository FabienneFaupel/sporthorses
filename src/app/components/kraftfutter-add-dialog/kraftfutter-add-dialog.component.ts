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
    this.form = this.fb.group({
      product: ['hafer' as KraftfutterType, Validators.required],
      date: [new Date(), Validators.required],
      packageType: ['bigbag' as PackageType, Validators.required],

      // BigBag
      weightKg: [1000],                 // required, wenn packageType = bigbag

      // Sack
      sackWeightKg: [20],               // required, wenn packageType = sack
      count: [1],                    // required, wenn packageType = sack

      // Optional
      priceEuro: [null],
      supplier: [''],
      note: [''],
    });

    // initial & dynamische Pflichtfelder je nach Verpackung
    this.configurePackageValidators(this.form.value.packageType as PackageType);
    this.form.get('packageType')!.valueChanges.subscribe((val: PackageType) => {
      this.configurePackageValidators(val);
    });
  }

  private configurePackageValidators(pkg: PackageType) {
    const weight = this.form.get('weightKg')!;
    const sackW  = this.form.get('sackWeightKg')!;
    const count  = this.form.get('count')!;

    if (pkg === 'bigbag') {
      weight.setValidators([Validators.required, Validators.min(1)]);
      sackW.clearValidators();
      count.clearValidators();
      sackW.setValue(sackW.value); // trigger UI refresh
      count.setValue(count.value);
    } else {
      weight.clearValidators();
      sackW.setValidators([Validators.required, Validators.min(1)]);
      count.setValidators([Validators.required, Validators.min(1)]);
      weight.setValue(weight.value);
    }

    weight.updateValueAndValidity({ emitEvent: false });
    sackW.updateValueAndValidity({ emitEvent: false });
    count.updateValueAndValidity({ emitEvent: false });
  }

  get isBigbag() { return this.form.value.packageType === 'bigbag'; }
  get isSack()   { return this.form.value.packageType === 'sack'; }
}