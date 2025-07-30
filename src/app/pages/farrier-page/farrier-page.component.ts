import { Component } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card'; // optional
import { MatButtonModule } from '@angular/material/button'; // optional
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


interface Hoof {
  position: string;
}

interface FarrierEntry {
  hooves: Hoof[];
  // ... weitere Eigenschaften, falls vorhanden
}

@Component({
  selector: 'app-farrier-page',
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,       // optional
    MatButtonModule,
    MatIconModule

  ],
  templateUrl: './farrier-page.component.html',
  styleUrl: './farrier-page.component.scss'
})
export class FarrierPageComponent {

  isHoofActive(entry: FarrierEntry, pos: string): boolean {
  return entry.hooves?.some((h: Hoof) => h.position === pos);
}

  horses = [
  {
    name: 'Bella',
    age: 7,
    gender: 'Stute',
    farrierEntries: [
      {
        date: '2025-07-15',
        type: 'Beschlagen (neu)',
        comment: 'Sehr ruhig und brav.',
        hooves: [
          { position: 'VL' },
          { position: 'VR' }
        ]
      },
      {
        date: '2025-04-15',
        type: 'Nur ausgeschnitten',
        hooves: [
          { position: 'HL' },
          { position: 'HR' }
        ]
      }
    ]
  },
  // weitere Pferde …
];


}
