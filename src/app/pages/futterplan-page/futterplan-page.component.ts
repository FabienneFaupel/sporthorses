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

type Daypart = 'Früh' | 'Mittag' | 'Abend';
type HayPortion = 'klein' | 'mittel' | 'groß';
type ScoopSize = '¼' | '½' | '1';

type Supplement = {
  name: string;           // Pellets / Mineral / Medizin / ...
  qty: number | string;   // 1, 10, "gemäß Etikett"
  unit?: string;          // "Schippe", "g", "ml", "Tbl"
  note?: string;          // z.B. "mit Apfel geben"
};

type FeedSpec = {
  hay?: { portion: HayPortion };
  oats?: { scoop: ScoopSize; count: 1 | 2 | 3 };
  supplements?: Supplement[];
};

type HorsePlan = {
  horse: string;
  feed: Record<Daypart, FeedSpec>;
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
    CommonModule,
  ],
  templateUrl: './futterplan-page.component.html',
  styleUrl: './futterplan-page.component.scss'
})
export class FutterplanPageComponent {
  // Bereiche & fixe Zeiten (einheitlich für alle Pferde)
  dayparts: Daypart[] = ['Früh', 'Mittag', 'Abend'];
  private partTimes: Record<Daypart, string> = { Früh: '07:00', Mittag: '12:30', Abend: '18:30' };
  partTime(p: Daypart): string { return this.partTimes[p]; }

  // Heu-Label (statt |titlecase)
  private hayText: Record<HayPortion, string> = { klein: 'Klein', mittel: 'Mittel', groß: 'Groß' };
  hayLabel(portion?: HayPortion): string { return portion ? this.hayText[portion] : ''; }

  // Daten – täglich identisch
  horsePlans: HorsePlan[] = [
    {
      horse: 'Somersby',
      feed: {
        Früh:   { hay: { portion: 'groß' },  oats: { scoop: '1', count: 1 }, supplements: [{ name: 'Mineral', qty: 'gemäß Etikett' }] },
        Mittag: { hay: { portion: 'mittel' }, oats: { scoop: '½', count: 1 } },
        Abend:  { hay: { portion: 'groß' },  oats: { scoop: '1', count: 1 }, supplements: [{ name: 'Elektrolyte', qty: 10, unit: 'g' }] },
      }
    },
    {
      horse: 'test2',
      feed: {
        Früh:   { hay: { portion: 'mittel' }, oats: { scoop: '½', count: 1 } },
        Mittag: { hay: { portion: 'klein' },  supplements: [{ name: 'Pellets', qty: 1, unit: 'Schippe' }] },
        Abend:  { hay: { portion: 'groß' } },
      }
    },
    {
      horse: 'Check Point Charly',
      feed: {
        Früh:   { hay: { portion: 'groß' },  oats: { scoop: '1', count: 1 } },
        Mittag: { hay: { portion: 'mittel' } },
        Abend:  { hay: { portion: 'groß' },  supplements: [{ name: 'Medizin', qty: 2, unit: 'Tbl', note: 'mit Apfel geben' }] },
      }
    },
  ];

  // Helpers
  feedFor(p: HorsePlan, part: Daypart): FeedSpec | undefined { return p.feed[part]; }
  hasMultipleOats(o?: { scoop: ScoopSize; count: number }): boolean { return !!o && o.count > 1; }
  isMedicine(z: Supplement): boolean { return z.name.toLowerCase().includes('medizin'); }
}