import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Horse } from '../../models/horse';

@Component({
  selector: 'app-zucht-horse-select-sheet',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './zucht-horse-select-sheet.component.html',
  styleUrl: './zucht-horse-select-sheet.component.scss'
})
export class ZuchtHorseSelectSheetComponent {
horses: Horse[] = [];
  selectedHorseId: string | null = null;
  search = '';

  constructor(
    public sheetRef: MatBottomSheetRef<ZuchtHorseSelectSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.horses = data.horses ?? [];
    this.selectedHorseId = data.selectedHorseId ?? null;
  }

  get filteredHorses(): Horse[] {
  return this.horses.filter((horse) =>
    horse.name?.toLowerCase().includes(this.search.toLowerCase())
  );
}

select(horse: Horse): void {
  this.sheetRef.dismiss(horse);
}

  close(): void {
    this.sheetRef.dismiss();
  }
}