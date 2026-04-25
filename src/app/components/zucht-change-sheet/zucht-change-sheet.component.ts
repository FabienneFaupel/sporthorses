import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
@Component({
  selector: 'app-zucht-change-sheet',
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './zucht-change-sheet.component.html',
  styleUrl: './zucht-change-sheet.component.scss'
})
export class ZuchtChangeSheetComponent {
constructor(
    private bottomSheetRef: MatBottomSheetRef<ZuchtChangeSheetComponent>
  ) {}

  close(): void {
    this.bottomSheetRef.dismiss();
  }
}