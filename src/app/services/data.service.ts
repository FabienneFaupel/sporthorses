import { Injectable } from '@angular/core';

export interface Vaccination {
  type: string;
  date: string;
  next: string;
  status: string;
}

export interface Horse {
  name: string;
  breed: string;
  age: number;
  birth: string;
  image: string;
  gender: string;
  vaccinations: Vaccination[];
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