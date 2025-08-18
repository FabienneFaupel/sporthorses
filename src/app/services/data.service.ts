import { Injectable } from '@angular/core';

export interface Vaccination {
  type: string;
  date: string;
  next: string;
  status: string;
}

export type HoofAction = 'ausgeschnitten' | 'beschlagen-alt' | 'beschlagen-neu';

export interface Hoof {
  position: 'VL' | 'VR' | 'HL' | 'HR';
  action: HoofAction;
}

export interface FarrierEntry {
  date: string;
  type: string;
  comment?: string;
  hooves: Hoof[];
}


export interface Horse {
  name: string;
  breed: string;
  age: number;
  birth: string;
  image: string;
  gender: string;
  vaccinations: Vaccination[];
  farrierEntries: FarrierEntry[];
}


@Injectable({
  providedIn: 'root'
})
export class DataService {

 private horses: Horse[] = [
    {
      name: 'Check Point Charly',
      breed: 'Hannoveraner',
      age: 7,
      birth: '12.05.2025',
      image: '/images/horse.svg',
      gender: 'Wallach',
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
      ],
      farrierEntries: [
        {
          date: '2025-07-15',
          type: 'Beschlagen',
          comment: 'Sehr ruhig und brav.',
          hooves: [
            { position: 'VL', action: 'beschlagen-neu' },
            { position: 'VR', action: 'beschlagen-neu' }
          ]
        },
      ]
    },
    {
      name: 'Bella',
      breed: 'Friese',
      age: 10,
      birth: '01.04.2025',
      image: '/images/horse.svg',
      gender: 'Stute',
      vaccinations: [
        {
          type: 'Herpes',
          date: '2025-02-10',
          next: '2025-08-10',
          status: 'geimpft'
        }
      ],
      farrierEntries: [
        {
          date: '2025-07-15',
          type: 'Beschlagen',
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
    },
    {
      name: 'Holly',
      breed: 'Oldenburger',
      age: 7,
      birth: '15.03.2025',
      image: '/images/horse.svg',
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
      ],
      farrierEntries: [
        {
          date: '2025-07-15',
          type: 'Beschlagen',
          comment: 'Sehr brav, hinten alte Eisen belassen.',
          hooves: [
            { position: 'VL', action: 'beschlagen-neu' },
            { position: 'VR', action: 'beschlagen-neu' },
            { position: 'HL', action: 'beschlagen-alt' },
            { position: 'HR', action: 'beschlagen-alt' }
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

  constructor() {}

  getHorses(): Horse[] {
    return this.horses;
  }

  addHorse(horse: Horse) {
    this.horses.push(horse);
  }
}