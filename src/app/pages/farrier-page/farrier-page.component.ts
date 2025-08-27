import { Component } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card'; // optional
import { MatButtonModule } from '@angular/material/button'; // optional
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FarrierDialogComponent } from '../../components/farrier-dialog/farrier-dialog.component';

import { DataService } from '../../services/data.service';
import { Horse, Hoof, FarrierEntry } from '../../models/horse';




@Component({
  selector: 'app-farrier-page',
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,       // optional
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FarrierDialogComponent

  ],
  templateUrl: './farrier-page.component.html',
  styleUrl: './farrier-page.component.scss'
})
export class FarrierPageComponent {

  


  horses: Horse[] = [];
  hoofPositions: Hoof['position'][] = ['VL', 'VR', 'HL', 'HR'];

  constructor(
    private dialog: MatDialog,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.horses = this.dataService.getHorses();
  }

  getHoofClass(entry: FarrierEntry, pos: Hoof['position']): string {
    const hoof = entry.hooves.find(h => h.position === pos);
    if (!hoof) return 'hoof-inactive';

    switch (hoof.action) {
      case 'beschlagen-neu':
      case 'beschlagen-alt':
        return 'hoof-beschlagen';
      case 'ausgeschnitten':
        return 'hoof-ausgeschnitten';
      default:
        return 'hoof-inactive';
    }
  }

  openFarrierDialog(): void {
  const ref = this.dialog.open(FarrierDialogComponent, {
    width: '400px',
    data: { horses: this.horses }
  });

  ref.afterClosed().subscribe((res?: { horseName: string; entry: FarrierEntry }) => {
    if (!res) return;
    const horse = this.horses.find(h => h.name === res.horseName);
    if (!horse) return;

    // vorne einfügen (neuester zuerst)
    horse.farrierEntries = [res.entry, ...(horse.farrierEntries ?? [])];
  });
}


}