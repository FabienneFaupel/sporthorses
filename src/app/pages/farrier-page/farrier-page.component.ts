import { Component } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card'; // optional
import { MatButtonModule } from '@angular/material/button'; // optional
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


type HoofAction = 'ausgeschnitten' | 'beschlagen-alt' | 'beschlagen-neu';



interface Hoof {
  position: 'VL' | 'VR' | 'HL' | 'HR';
  action: HoofAction;
}

interface FarrierEntry {
  date: string;
  type: string;
  comment?: string;
  hooves: Hoof[];
}

interface Horse {
  name: string;
  age: number;
  gender: string;
  farrierEntries: FarrierEntry[];
}


@Component({
  selector: 'app-farrier-page',
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,       // optional
    MatButtonModule,
    MatIconModule,

  ],
  templateUrl: './farrier-page.component.html',
  styleUrl: './farrier-page.component.scss'
})
export class FarrierPageComponent {

  hoofPositions: Hoof['position'][] = ['VL', 'VR', 'HL', 'HR'];
  
 isHoofActive(entry: FarrierEntry, pos: Hoof['position']): boolean {
    return entry.hooves.some((h) => h.position === pos);
  }

  horses: Horse[] = [
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
            { position: 'VL', action: 'beschlagen-neu' },
            { position: 'VR', action: 'beschlagen-neu' }
          ]
        },
        {
          date: '2025-04-15',
          type: 'Nur ausgeschnitten',
          hooves: [
            { position: 'HL', action: 'ausgeschnitten' },
            { position: 'HR', action: 'ausgeschnitten' }
          ]
        }
      ]
    }
  ];
}