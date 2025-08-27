import { Component } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card'; // optional
import { MatButtonModule } from '@angular/material/button'; // optional
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';


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
    FarrierDialogComponent,
    MatProgressBarModule

  ],
  templateUrl: './farrier-page.component.html',
  styleUrl: './farrier-page.component.scss'
})
export class FarrierPageComponent {
  loading = true;                       // 1) Loader
  horses: Horse[] = [];
  hoofPositions: Hoof['position'][] = ['VL', 'VR', 'HL', 'HR'];

  constructor(
    private dialog: MatDialog,
    private dataService: DataService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.dataService.loadHorsesFromDb();
      this.horses = this.dataService.getHorses();
    } finally {
      this.loading = false;             // Loader aus
    }
  }

  // optional: stabilere *ngFor
  trackHorse = (_: number, h: Horse) => h._id ?? h.name;

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
      data: { horses: this.horses }     // Dialog liefert {horseId, entry} zurück
    });

    ref.afterClosed().subscribe(async (res?: { horseId: string; entry: FarrierEntry }) => {
      if (!res) return;
      try {
        const dateStr =
          typeof res.entry.date === 'string'
            ? res.entry.date
            : new Date(res.entry.date as any).toISOString().slice(0, 10);

        const cleanEntry: FarrierEntry = {
          ...res.entry,
          date: dateStr,
          comment: res.entry.comment ?? '',
          hooves: [...(res.entry.hooves ?? [])]
        };

        await this.dataService.addFarrierEntry(res.horseId, cleanEntry);
        this.horses = this.dataService.getHorses();   // View auffrischen
      } catch (e) {
        console.error('Farrier save failed', e);
      }
    });
  }

  // 2) EDIT
  editEntry(horseId: string, index: number, original: FarrierEntry) {
    const ref = this.dialog.open(FarrierDialogComponent, {
      width: '400px',
      data: { horses: this.horses, horseId, entry: original }
    });

    ref.afterClosed().subscribe(async (res?: { entry: Partial<FarrierEntry> }) => {
      if (!res) return;
      try {
        const patch: Partial<FarrierEntry> = { ...res.entry };
        if (patch.date && typeof patch.date !== 'string') {
          patch.date = (patch.date as Date).toISOString().slice(0, 10);
        }

        await this.dataService.updateFarrierEntry(horseId, index, patch);
        this.horses = this.dataService.getHorses();
      } catch (e) {
        console.error('Update failed', e);
      }
    });
  }

  // 2) DELETE
  async deleteEntry(horseId: string, index: number) {
    if (!confirm('Diesen Eintrag wirklich löschen?')) return;
    try {
      await this.dataService.deleteFarrierEntry(horseId, index);
      this.horses = this.dataService.getHorses();
    } catch (e) {
      console.error('Delete failed', e);
    }
  }
}
