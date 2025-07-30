import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // oder MatMomentDateModule
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; // für die Delete-Buttons

interface Impfung {
  name: string;
  datum: string;
  naechste: string;
  status: 'Geimpft' | 'Fällig';
}

interface Pferd {
  name: string;
  bild: string;
  impfungen: Impfung[];
}






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
    MatButtonModule
  ],
  templateUrl: './vaccination-page.component.html',
  styleUrl: './vaccination-page.component.scss'
})
export class VaccinationPageComponent {
pferde: Pferd[] = [
    {
      name: 'Check Point Charly',
      bild: 'images/horse.svg',
      impfungen: [
        { name: 'Tetanus', datum: '2025-03-01', naechste: '2026-03-01', status: 'Geimpft' },
        { name: 'Influenza', datum: '2025-02-10', naechste: '2025-08-10', status: 'Fällig' },
      ],
    },
    {
      name: 'Bella',
      bild: 'images/horse.svg',
      impfungen: [
        { name: 'Tetanus', datum: '2025-01-15', naechste: '2026-01-15', status: 'Geimpft' },
        { name: 'Herpes', datum: '2025-02-01', naechste: '2025-08-01', status: 'Fällig' },
      ],
    },
  ];
}
