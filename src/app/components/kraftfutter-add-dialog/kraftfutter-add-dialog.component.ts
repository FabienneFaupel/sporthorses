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
import { toDateOnlyIsoLocal, fromDateOnlyIsoLocal } from '../../utils/date';
import { KraftfutterDelivery, PackageType } from '../../models/kraftfutter';
import { FeedDefinition } from '../../models/feed-definition';

export interface KraftfutterDialogData {
  delivery?: KraftfutterDelivery;
  feedDefs: FeedDefinition[];
}


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
  ],
  templateUrl: './kraftfutter-add-dialog.component.html',
  styleUrl: './kraftfutter-add-dialog.component.scss'
})
export class KraftfutterAddDialogComponent {
  form: FormGroup;
  isEdit = false;
  original?: KraftfutterDelivery;

  options: FeedDefinition[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<KraftfutterAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KraftfutterDialogData
  ) {
    this.isEdit = !!data?.delivery;
    this.original = data?.delivery;

    this.options = (data.feedDefs ?? [])
  .filter(d => d.scope === 'both')
  .filter(d => ['hafer', 'muesli', 'mash', 'pellets', 'zusatzfutter'].includes(d.baseType));


    const initFeedDefId =
      this.original?.feedDefId ??
      this.options[0]?._id ??
      null;

    this.form = this.fb.group({
      feedDefId: [initFeedDefId, Validators.required],
      date: [this.original?.date ? fromDateOnlyIsoLocal(this.original.date) : new Date(), Validators.required],
      packageType: [(this.original?.packageType ?? 'bigbag') as PackageType, Validators.required],

      weightKg: [this.original?.weightKg ?? 750],
      sackWeightKg: [this.original?.sackWeightKg ?? 20],
      count: [this.original?.count ?? 1],

      priceEuro: [this.original?.priceEuro ?? undefined],
      supplier: [this.original?.supplier ?? ''],
      note: [this.original?.note ?? ''],
    });

    this.configurePackageValidators(this.form.value.packageType as PackageType);
    this.form.get('packageType')!.valueChanges.subscribe((val: PackageType) => {
      this.configurePackageValidators(val);
    });
  }

  private configurePackageValidators(pkg: PackageType) {
    const weight = this.form.get('weightKg')!;
    const sackW = this.form.get('sackWeightKg')!;
    const count = this.form.get('count')!;

    if (pkg === 'bigbag') {
      weight.setValidators([Validators.required, Validators.min(1)]);
      sackW.clearValidators();
      count.clearValidators();
    } else {
      weight.clearValidators();
      sackW.setValidators([Validators.required, Validators.min(1)]);
      count.setValidators([Validators.required, Validators.min(1)]);
    }

    weight.updateValueAndValidity({ emitEvent: false });
    sackW.updateValueAndValidity({ emitEvent: false });
    count.updateValueAndValidity({ emitEvent: false });
  }

  get isBigbag() { return this.form.value.packageType === 'bigbag'; }
  get isSack() { return this.form.value.packageType === 'sack'; }

  private getSelectedDef(): FeedDefinition | null {
    const id = this.form.value.feedDefId as string | null;
    if (!id) return null;
    return this.options.find(d => d._id === id) ?? null;
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value;

    const def = this.getSelectedDef();
    if (!def?._id) return;

    const base = {
      feedDefId: def._id,
      baseType: def.baseType,
      name: def.name,

      date: toDateOnlyIsoLocal(new Date(v.date)),
      packageType: v.packageType as PackageType,

      weightKg: this.isBigbag ? Number(v.weightKg) : undefined,
      sackWeightKg: this.isSack ? Number(v.sackWeightKg) : undefined,
      count: this.isSack ? Number(v.count) : undefined,

      priceEuro: v.priceEuro != null && v.priceEuro !== '' ? Number(v.priceEuro) : undefined,
      supplier: v.supplier?.trim() || undefined,
      note: v.note?.trim() || undefined,
    } satisfies Omit<KraftfutterDelivery, '_id' | '_rev' | 'createdAt' | 'updatedAt' | 'docType' | 'stallId'>;

    if (this.isEdit && this.original?._id && this.original?._rev) {
      this.dialogRef.close({ mode: 'edit', delivery: { ...this.original, ...base } });
    } else {
      this.dialogRef.close({ mode: 'add', delivery: base });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}