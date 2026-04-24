import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-bottom-sheet',
  imports: [MatIconModule, MatListModule, NgFor],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss'
})
export class BottomSheetComponent {
constructor(
    private router: Router,
    private ref: MatBottomSheetRef<BottomSheetComponent>
  ) {}

  items = [
    { label: 'Futterplan',    icon: 'event_note',   link: '/futterplan' },
    { label: 'Futtersorten',   icon: 'inventory_2',     link: '/futtersorten' },
    { label: 'Zuchtplaner',   icon: 'inventory_2',     link: '/zucht' },
    { label: 'Statistik',    icon: 'bar_chart', link: '/more/turnierbericht' },
    

  ];

  go(link: string) {
    this.ref.dismiss();           // Sheet schließen
    this.router.navigateByUrl(link);
  }
}