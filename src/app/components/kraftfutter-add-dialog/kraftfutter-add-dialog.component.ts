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
 isEdit = false;
original?: KraftfutterDelivery;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<KraftfutterAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { delivery?: KraftfutterDelivery } | null
  ) {
    this.isEdit = !!data?.delivery;
    this.original = data?.delivery;

    this.form = this.fb.group({
      product: [ (this.original?.product ?? 'hafer') as KraftfutterType, Validators.required ],
      date:    [ this.original ? new Date(this.original.date) : new Date(), Validators.required ],
      packageType: [ (this.original?.packageType ?? 'bigbag') as PackageType, Validators.required ],
      // BigBag
      weightKg:     [ this.original?.weightKg ?? 1000 ],
      // Sack
      sackWeightKg: [ this.original?.sackWeightKg ?? 20 ],
      count:        [ this.original?.count ?? 1 ],
      // Optional
      priceEuro: [ this.original?.priceEuro ?? undefined ],
      supplier:  [ this.original?.supplier ?? '' ],
      note:      [ this.original?.note ?? '' ],
    });

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
      sackW.setValue(sackW.value);
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

    // gemeinsame Payload – OHNE docType
    const base = {
      product: v.product as KraftfutterType,
      date: new Date(v.date).toISOString().slice(0, 10),
      packageType: v.packageType as PackageType,
      weightKg: this.isBigbag ? Number(v.weightKg) : undefined,
      sackWeightKg: this.isSack ? Number(v.sackWeightKg) : undefined,
      count: this.isSack ? Number(v.count) : undefined,
      priceEuro: v.priceEuro != null && v.priceEuro !== '' ? Number(v.priceEuro) : undefined,
      supplier: v.supplier?.trim() || undefined,
      note: v.note?.trim() || undefined,
    } satisfies Omit<KraftfutterDelivery,'_id'|'_rev'|'createdAt'|'updatedAt'|'docType'>;

    if (this.isEdit && this.original?._id && this.original?._rev) {
      const updated: KraftfutterDelivery = { ...this.original, ...base };
      this.dialogRef.close({ mode: 'edit', delivery: updated });
    } else {
      this.dialogRef.close({ mode: 'add', delivery: base });
    }
  }
}