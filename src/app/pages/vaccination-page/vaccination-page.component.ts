import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { VaccinationDialogComponent } from '../../components/vaccination-dialog/vaccination-dialog.component';

import { DataService} from '../../services/data.service';
import { Horse, Vaccination } from '../../models/horse';


@Component({
  selector: 'app-vaccination-page',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    VaccinationDialogComponent
  ],
  templateUrl: './vaccination-page.component.html',
  styleUrl: './vaccination-page.component.scss'
})
export class VaccinationPageComponent {
 horses: Horse[] = [];

  constructor(
    private dialog: MatDialog,
    private dataService: DataService
  ) {}

  async ngOnInit(): Promise<void> {
    // Falls die Seite frisch geöffnet wird, ensure DB ist geladen:
    await this.dataService.loadHorsesFromDb();
    this.horses = this.dataService.getHorses();
  }

  openVaccinationDialog(): void {
    const ref = this.dialog.open(VaccinationDialogComponent, {
      width: '400px',
      data: { mode: 'new', horses: this.horses }
    });

    ref.afterClosed().subscribe(async (res?: { horseIds: string[]; entry: Vaccination }) => {
      if (!res) return;
      try {
        // Für jedes ausgewählte Pferd speichern
        for (const id of res.horseIds) {
          await this.dataService.addVaccination(id, res.entry);
        }
        // View auffrischen
        this.horses = this.dataService.getHorses();
      } catch (e) {
        console.error('Save vaccination failed', e);
      }
    });
  }

  editVaccination(horseId: string, index: number, original: Vaccination) {
    const ref = this.dialog.open(VaccinationDialogComponent, {
      width: '400px',
      data: { mode: 'edit', horses: this.horses, horseId, vaccination: original }
    });

    ref.afterClosed().subscribe(async (res?: { horseId: string; entry: Vaccination }) => {
      if (!res) return;
      try {
        await this.dataService.updateVaccination(horseId, index, res.entry);
        this.horses = this.dataService.getHorses();
      } catch (e) {
        console.error('Update vaccination failed', e);
      }
    });
  }

  async deleteVaccination(horseId: string, index: number) {
    if (!confirm('Diesen Impfeintrag wirklich löschen?')) return;
    try {
      await this.dataService.deleteVaccination(horseId, index);
      this.horses = this.dataService.getHorses();
    } catch (e) {
      console.error('Delete vaccination failed', e);
    }
  }
}