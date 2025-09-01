import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';


type DayKey = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun';

type HayPortion = 'klein'|'mittel'|'groß';
type ScoopSize = '¼'|'½'|'1';

type Supplement = {
  name: string;         // z.B. Pellets / Elektrolyte / Medizin
  qty: number | string; // z.B. 1, 10, "gemäß Etikett"
  unit?: string;        // z.B. "Schippe", "g", "ml", "Tbl"
  note?: string;        // kurzer Hinweis zur Gabe
};

type FeedingSlot = {
  time: string;            // "07:00"
  hay?: { portion: HayPortion };
  oats?: { scoop: ScoopSize; count: 1|2|3 }; // Schippe-Größe × Anzahl
  supplements?: Supplement[];                // optional
};

type DayPlan = { slots: FeedingSlot[] };     // max. 3 Slots
type Week = Record<DayKey, DayPlan>;

type HorseWeekPlan = {
  horse: string;
  week: Week;
};

@Component({
  selector: 'app-futterplan-page',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './futterplan-page.component.html',
  styleUrl: './futterplan-page.component.scss'
})
export class FutterplanPageComponent {
 
  dayOrder: DayKey[] = ['mon','tue','wed','thu','fri','sat','sun'];
  dayLabel: Record<DayKey,string> = { mon:'Mo', tue:'Di', wed:'Mi', thu:'Do', fri:'Fr', sat:'Sa', sun:'So' };

  columns = ['horse', ...this.dayOrder];
    // Neu: Helper gegen den Index-Fehler im Template
  label(d: DayKey): string {
    return this.dayLabel[d];
  }

  weekPlans: HorseWeekPlan[] = [
    {
      horse: 'Somersby',
      week: {
        mon: { slots: [
          { time: '07:00', hay: { portion: 'groß' }, oats: { scoop: '1', count: 1 }, supplements: [{ name:'Mineral', qty:'gemäß Etikett' }] },
          { time: '12:30', hay: { portion: 'mittel' }, oats: { scoop: '½', count: 1 } },
          { time: '18:30', hay: { portion: 'groß' }, oats: { scoop:'1', count: 1 }, supplements: [{ name:'Elektrolyte', qty:10, unit:'g' }] }
        ]},
        tue: { slots: [
          { time: '07:00', hay: { portion: 'groß' }, oats: { scoop: '½', count: 2 } },
          { time: '12:30', hay: { portion: 'klein' }, supplements: [{ name:'Pellets', qty:1, unit:'Schippe' }] },
          { time: '18:30', hay: { portion: 'groß' } }
        ]},
        wed: { slots: [
          { time: '07:00', hay: { portion: 'groß' }, oats: { scoop:'1', count: 1 } },
          { time: '12:30', hay: { portion: 'mittel' } },
          { time: '18:30', hay: { portion: 'groß' }, oats: { scoop:'½', count: 1 } }
        ]},
        thu: { slots: [ { time: '07:00', hay:{ portion:'groß' }, oats:{ scoop:'1', count: 1 } },
                        { time: '18:30', hay:{ portion:'groß' } } ]},
        fri: { slots: [ { time: '07:00', hay:{ portion:'groß' }, oats:{ scoop:'½', count: 2 } },
                        { time: '18:30', hay:{ portion:'groß' } } ]},
        sat: { slots: [ { time: '09:00', hay:{ portion:'mittel' } }, { time: '18:00', hay:{ portion:'groß' } } ]},
        sun: { slots: [ { time: '09:00', hay:{ portion:'mittel' } }, { time: '18:00', hay:{ portion:'groß' } } ]},
      }
    },
    {
      horse: 'test2',
      week: {
        mon: { slots: [
          { time: '07:30', hay:{ portion:'mittel' }, oats:{ scoop:'½', count:1 } },
          { time: '18:30', hay:{ portion:'groß' } }
        ]},
        tue: { slots: [
          { time: '07:30', hay:{ portion:'mittel' }, supplements:[{ name:'Pellets', qty:1, unit:'Schippe' }] },
          { time: '18:30', hay:{ portion:'groß' } }
        ]},
        wed: { slots: [
          { time: '07:30', hay:{ portion:'mittel' }, oats:{ scoop:'¼', count:2 } },
          { time: '12:30', hay:{ portion:'klein' } },
          { time: '18:30', hay:{ portion:'groß' } }
        ]},
        thu: { slots: [ { time:'07:30', hay:{portion:'mittel'} }, { time:'18:30', hay:{portion:'groß'} } ]},
        fri: { slots: [ { time:'07:30', hay:{portion:'mittel'} }, { time:'18:30', hay:{portion:'groß'} } ]},
        sat: { slots: [ { time:'09:30', hay:{portion:'mittel'} } ]},
        sun: { slots: [ { time:'09:30', hay:{portion:'mittel'} } ]},
      }
    },
    {
      horse: 'Check Point Charly',
      week: {
        mon: { slots: [
          { time:'06:45', hay:{portion:'groß'}, oats:{scoop:'1',count:1} },
          { time:'12:15', hay:{portion:'mittel'} },
          { time:'18:45', hay:{portion:'groß'}, supplements:[{ name:'Medizin', qty:2, unit:'Tbl', note:'mit Apfel geben' }] }
        ]},
        tue: { slots: [
          { time:'06:45', hay:{portion:'groß'}, oats:{scoop:'½',count:2} },
          { time:'18:45', hay:{portion:'groß'} }
        ]},
        wed: { slots: [
          { time:'06:45', hay:{portion:'groß'} },
          { time:'12:15', hay:{portion:'klein'}, supplements:[{ name:'Elektrolyte', qty:20, unit:'ml' }] },
          { time:'18:45', hay:{portion:'groß'} }
        ]},
        thu: { slots: [ { time:'06:45', hay:{portion:'groß'} }, { time:'18:45', hay:{portion:'groß'} } ]},
        fri: { slots: [ { time:'06:45', hay:{portion:'groß'}, oats:{scoop:'1',count:1} }, { time:'18:45', hay:{portion:'groß'} } ]},
        sat: { slots: [ { time:'08:00', hay:{portion:'mittel'} }, { time:'18:00', hay:{portion:'groß'} } ]},
        sun: { slots: [ { time:'08:00', hay:{portion:'mittel'} }, { time:'18:00', hay:{portion:'groß'} } ]},
      }
    }
  ];
}