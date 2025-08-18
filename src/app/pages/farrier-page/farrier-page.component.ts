import { Component } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card'; // optional
import { MatButtonModule } from '@angular/material/button'; // optional
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FarrierDialogComponent } from '../../components/farrier-dialog/farrier-dialog.component';

import { DataService, Horse, FarrierEntry, Hoof } from '../../services/data.service';




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
    this.dialog.open(FarrierDialogComponent, {
      width: '400px',
      data: { horses: this.horses }
    });
  }

}