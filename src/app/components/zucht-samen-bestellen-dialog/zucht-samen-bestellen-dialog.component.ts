import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface InseminationOrder {
  id: number;
  stallion: string;
  semenType: 'Frischsamen' | 'Kühlsamen' | 'TG-Samen';
  orderDate: string;
  orderTime: string;
  costs: number;
  stallionStation: string; // bleibt
  inseminationDate: string;
  inseminationTime: string;
  vet: string;
  location: string;
   hasAppointment?: boolean;
}

interface DialogData {
  mode: 'create' | 'edit';
  order: InseminationOrder | null;
}


@Component({
  selector: 'app-zucht-samen-bestellen-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './zucht-samen-bestellen-dialog.component.html',
  styleUrl: './zucht-samen-bestellen-dialog.component.scss'
})
export class ZuchtSamenBestellenDialogComponent {

  addInseminationAppointment = false;

form: InseminationOrder = {
  id: 0,
  stallion: '',
  semenType: 'Kühlsamen',
  orderDate: this.getToday(),
  orderTime: '',
  costs: 0,
  stallionStation: '',
  inseminationDate: this.getToday(),
  inseminationTime: '',
  vet: '',
  location: '',
};

  constructor(
    private dialogRef: MatDialogRef<ZuchtSamenBestellenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.order) {
      this.form = { ...data.order };
       this.addInseminationAppointment = !!data.order.hasAppointment;
    }
  }

  get title(): string {
    return this.data.mode === 'edit'
      ? 'Besamung bearbeiten'
      : 'Besamung hinzufügen';
  }

  get isValid(): boolean {
  const baseValid =
    this.form.stallion.trim().length > 0 &&
    !!this.form.semenType &&
    !!this.form.orderDate;

  const appointmentValid =
    !this.addInseminationAppointment || !!this.form.inseminationDate;

  return baseValid && appointmentValid;
}
  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  close(): void {
    this.dialogRef.close();
  }

save(): void {
  if (!this.isValid) return;

  this.dialogRef.close({
    action: 'save',
    order: {
      ...this.form,
      hasAppointment: this.addInseminationAppointment,
    },
  });
}

  delete(): void {
  const confirmed = confirm('Möchtest du diese Besamung wirklich löschen?');

  if (!confirmed) return;

  this.dialogRef.close({
    action: 'delete',
    order: this.form,
  });
}
}