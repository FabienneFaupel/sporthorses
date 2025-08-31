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

import { KraftfutterDelivery, PackageType, KraftfutterType } from '../../models/kraftfutter';





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

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<KraftfutterAddDialogComponent>) {
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

  save() {
    if (this.form.invalid) return;

    const v = this.form.value;
    // Datum normieren (YYYY-MM-DD)
    const dateStr: string = new Date(v.date).toISOString().slice(0, 10);


const payload: Omit<KraftfutterDelivery, '_id'|'_rev'|'createdAt'|'updatedAt'> = {
  docType: 'kraftfutter',
  product: v.product,
  date: new Date(v.date).toISOString().slice(0, 10),
  packageType: v.packageType,
  // nur setzen, wenn Werte vorhanden sind
  weightKg: this.isBigbag ? Number(v.weightKg) : undefined,
  sackWeightKg: this.isSack ? Number(v.sackWeightKg) : undefined,
  count: this.isSack ? Number(v.count) : undefined,
  priceEuro: v.priceEuro != null && v.priceEuro !== '' ? Number(v.priceEuro) : undefined,
  supplier: v.supplier?.trim() ? v.supplier.trim() : undefined,
  note: v.note?.trim() ? v.note.trim() : undefined,
};

    this.dialogRef.close(payload);
  }
}
