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
horses = [
    {
      name: 'Bella',
      age: 7,
      gender: 'Stute',
      vaccinations: [
        {
          type: 'Influenza',
          date: '2025-04-12',
          next: '2025-10-12',
          status: 'geimpft'
        },
        {
          type: 'Tetanus',
          date: '2024-01-05',
          next: '2025-01-05',
          status: 'überfällig'
        }
      ]
    },
    {
      name: 'Max',
      age: 10,
      gender: 'Wallach',
      vaccinations: [
        {
          type: 'Herpes',
          date: '2025-02-10',
          next: '2025-08-10',
          status: 'geimpft'
        }
      ]
    },
    {
      name: 'Holly',
      age: 7,
      gender: 'Stute',
      vaccinations: [
        {
          type: 'Influenza',
          date: '2025-04-12',
          next: '2025-10-12',
          status: 'geimpft'
        },
        {
          type: 'Tetanus',
          date: '2024-01-05',
          next: '2025-01-05',
          status: 'überfällig'
        },
        {
          type: 'Influenza',
          date: '2025-04-12',
          next: '2025-10-12',
          status: 'geimpft'
        },
        {
          type: 'Tetanus',
          date: '2024-01-05',
          next: '2025-01-05',
          status: 'überfällig'
        }
      ]
    },
  ];
constructor(private dialog: MatDialog) {}

  openVaccinationDialog(): void {
    this.dialog.open(VaccinationDialogComponent, {
      width: '400px',
      data: { horses: this.horses }
    });
  }
}