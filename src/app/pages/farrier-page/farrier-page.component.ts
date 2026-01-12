import { Component } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card'; // optional
import { MatButtonModule } from '@angular/material/button'; // optional
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';



import { FarrierDialogComponent } from '../../components/farrier-dialog/farrier-dialog.component';

import { DataService } from '../../services/data.service';
import { Horse, Hoof, FarrierEntry } from '../../models/horse';
import { toDateOnlyIsoLocal } from '../../utils/date';
import { newId } from '../../utils/id';


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
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,


  ],
  templateUrl: './farrier-page.component.html',
  styleUrl: './farrier-page.component.scss'
})
export class FarrierPageComponent {
  loading = true;                       // 1) Loader
  horses: Horse[] = [];
  hoofPositions: Hoof['position'][] = ['VL', 'VR', 'HL', 'HR'];

  selectedYear: number | 'all' = new Date().getFullYear();
  availableYears: (number | 'all')[] = [];

  constructor(
    private dialog: MatDialog,
    private dataService: DataService
  ) {}

  async ngOnInit(): Promise<void> {
  try {
    await this.dataService.loadHorsesFromDb();
    this.horses = this.dataService.getHorses();

    // Years vorbereiten (z. B. die letzten 5 Jahre + aktuelles)
    const currentYear = new Date().getFullYear();
    this.availableYears.push('all');        // 👈 zuerst "Alle"
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(currentYear - i);
    }
  } finally {
    this.loading = false;
  }
}

// Filter-Helfer für die Einträge eines Pferdes
filteredFarrierEntries(horse: Horse) {
  return (horse.farrierEntries ?? [])
    .filter(entry => {
      if (this.selectedYear === 'all') return true;
      return Number(entry.date.slice(0, 4)) === this.selectedYear;

    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

  // optional: stabilere *ngFor
  trackHorse = (_: number, h: Horse) => h._id ?? h.name;
  trackFarrierEntry = (_: number, e: FarrierEntry) => `${e.date}-${e.type}-${e.comment ?? ''}`;


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
            : toDateOnlyIsoLocal(new Date(res.entry.date as any));


        const cleanEntry: FarrierEntry = {
          id: res.entry.id ?? newId('farrier:'),
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
  editEntry(horseId: string, original: FarrierEntry) {
  const ref = this.dialog.open(FarrierDialogComponent, {
    width: '400px',
    data: { horses: this.horses, horseId, entry: original }
  });

  ref.afterClosed().subscribe(async (res?: { entry: Partial<FarrierEntry> }) => {
    if (!res) return;

    try {
      if (!original.id) {
        console.error('FarrierEntry hat keine id (Migration noch nicht gelaufen?)', original);
        return;
      }

      const patch: Partial<FarrierEntry> = { ...res.entry };

      if (patch.date && typeof patch.date !== 'string') {
        patch.date = toDateOnlyIsoLocal(patch.date as Date);
      }

      await this.dataService.updateFarrierEntryById(horseId, original.id, patch);
      this.horses = this.dataService.getHorses();
    } catch (e) {
      console.error('Update failed', e);
    }
  });
}


  // 2) DELETE
 async deleteEntry(horseId: string, original: FarrierEntry) {
  if (!confirm('Diesen Eintrag wirklich löschen?')) return;

  try {
    if (!original.id) {
      console.error('FarrierEntry hat keine id (Migration noch nicht gelaufen?)', original);
      return;
    }

    await this.dataService.deleteFarrierEntryById(horseId, original.id);
    this.horses = this.dataService.getHorses();
  } catch (e) {
    console.error('Delete failed', e);
  }
}


}
