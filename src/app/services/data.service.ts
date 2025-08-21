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

export interface FeedLogEntry {
  date: Date;
  type: 'heu' | 'stroh';
  action: 'add' | 'consume';
  amount: number;
  price?: number;
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

  // Maximalmengen
  private hayMax = 0;
  private strawMax = 0;

  // Aktuelle Mengen
  private hayCurrent = 0;
  private strawCurrent = 0;

  // Feed-Historie
  private feedLog: FeedLogEntry[] = [
    { date: new Date('2025-01-01'), type: 'heu', action: 'consume', amount: 1 },
    { date: new Date('2025-02-12'), type: 'stroh', action: 'add', amount: 5, price: 75  },
    { date: new Date('2024-06-23'), type: 'heu', action: 'add', amount: 10, price: 75  },
    { date: new Date('2025-01-01'), type: 'heu', action: 'consume', amount: 1 },
    { date: new Date('2025-03-12'), type: 'stroh', action: 'add', amount: 5, price: 75  },
    { date: new Date('2025-04-23'), type: 'heu', action: 'add', amount: 10, price: 75  },
  ];

  constructor() {}

  getHorses(): Horse[] {
    return this.horses;
  }

  addHorse(horse: Horse) {
    this.horses.push(horse);
  }

   // Getter für Max-Werte
  getHayMax(): number {
    return this.hayMax;
  }

  getStrawMax(): number {
    return this.strawMax;
  }

  // Getter für aktuelle Mengen
  getHayCurrent(): number {
    return this.hayCurrent;
  }

  getStrawCurrent(): number {
    return this.strawCurrent;
  }

  // Getter für Feed-Log
  getFeedLog(): FeedLogEntry[] {
    return this.feedLog;
  }

  // Methoden zum Hinzufügen/Verbrauchen
addFeed(type: 'heu' | 'stroh', amount: number, price?: number) {
  this.feedLog.push({ date: new Date(), type, action: 'add', amount, price });

  if (type === 'heu') {
    this.hayCurrent += amount;       // Bestand erhöhen
    this.hayMax = this.hayCurrent;   // neues Maximum = aktueller Bestand
  }

  if (type === 'stroh'){ 
    this.strawCurrent += amount;
    this.strawMax = this.strawCurrent;
  }
}

consumeFeed(type: 'heu' | 'stroh', amount: number) {
  this.feedLog.push({ date: new Date(), type, action: 'consume', amount });

  if (type === 'heu') {
    this.hayCurrent = Math.max(0, this.hayCurrent - amount);
    // hayMax bleibt gleich!
  }
  
  if (type === 'stroh') {
    this.strawCurrent = Math.max(0, this.strawCurrent - amount);
    // strawMax bleibt gleich!
  }
}

}