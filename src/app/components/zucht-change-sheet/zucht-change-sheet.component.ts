import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-zucht-change-sheet',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './zucht-change-sheet.component.html',
  styleUrl: './zucht-change-sheet.component.scss'
})
export class ZuchtChangeSheetComponent {
cycles: any[] = [];
  activeCycleId: number | null = null;
  showCreateForm = false;

  form = {
    year: new Date().getFullYear(),
  };

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ZuchtChangeSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.cycles = data.cycles ?? [];
    this.activeCycleId = data.activeCycleId ?? null;

    this.showCreateForm = this.cycles.length === 0;

    this.form = {
      year: data.currentYear ?? new Date().getFullYear(),
    };
  }

  selectCycle(cycleId: number): void {
    this.bottomSheetRef.dismiss({
      action: 'select',
      cycleId,
    });
  }

  createCycle(): void {
    if (!this.form.year) return;

    this.bottomSheetRef.dismiss({
      action: 'create',
      year: this.form.year,
    });
  }

  deleteCycle(cycleId: number, event: Event): void {
  event.stopPropagation();

  const confirmed = confirm('Möchtest du diesen Zuchtzyklus wirklich löschen?');

  if (!confirmed) return;

  this.bottomSheetRef.dismiss({
    action: 'delete',
    cycleId,
  });
}

  close(): void {
    this.bottomSheetRef.dismiss();
  }
}