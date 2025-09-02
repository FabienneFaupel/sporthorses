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
import { MatTooltipModule } from '@angular/material/tooltip';

type Daypart = 'Früh' | 'Mittag' | 'Abend';
type HayPortion = 'klein' | 'mittel' | 'groß';
type ScoopSize = '¼' | '½' | '1';

type Supplement = {
  kind: 'supplement' | 'medicine'; // robust statt Name-Check
  name: string;
  qty: number | string;
  unit?: string;   // "Schippe", "g", "ml", "Tbl"
  note?: string;   // z.B. "mit Apfel geben"
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
    MatTooltipModule,
    CommonModule,
  ],
  templateUrl: './futterplan-page.component.html',
  styleUrl: './futterplan-page.component.scss'
})
export class FutterplanPageComponent {
  compact = false;

  // Bereiche & fixe Zeiten (einheitlich für alle Pferde)
  dayparts: Daypart[] = ['Früh', 'Mittag', 'Abend'];
  private partTimes: Record<Daypart, string> = { Früh: '07:00', Mittag: '12:30', Abend: '18:30' };
  partTime(p: Daypart): string { return this.partTimes[p]; }

  // Heu-Label & Kurzform
  private hayText: Record<HayPortion, string> = { klein: 'Klein', mittel: 'Mittel', groß: 'Groß' };
  private hayShortText: Record<HayPortion, string> = { klein: 'K', mittel: 'M', groß: 'G' };
  hayLabel(portion?: HayPortion): string { return portion ? this.hayText[portion] : ''; }
  hayShort(portion?: HayPortion): string { return portion ? this.hayShortText[portion] : ''; }

  // Statische Beispiel-Daten
  horsePlans: HorsePlan[] = [
    {
      horse: 'Somersby',
      feed: {
        Früh:   { hay: { portion: 'groß' },  oats: { scoop: '1', count: 1 }, supplements: [{ kind: 'supplement', name: 'Mineral', qty: 'gemäß Etikett' }] },
        Mittag: { hay: { portion: 'mittel' }, oats: { scoop: '½', count: 1 } },
        Abend:  { hay: { portion: 'groß' },  oats: { scoop: '1', count: 1 }, supplements: [{ kind: 'supplement', name: 'Elektrolyte', qty: 10, unit: 'g' }] },
      }
    },
    {
      horse: 'test2',
      feed: {
        Früh:   { hay: { portion: 'mittel' }, oats: { scoop: '½', count: 1 } },
        Mittag: { hay: { portion: 'klein' },  supplements: [{ kind: 'supplement', name: 'Pellets', qty: 1, unit: 'Schippe' }] },
        Abend:  { hay: { portion: 'groß' } },
      }
    },
    {
      horse: 'Check Point Charly',
      feed: {
        Früh:   { hay: { portion: 'groß' },  oats: { scoop: '1', count: 1 } },
        Mittag: { hay: { portion: 'mittel' } },
        Abend:  { hay: { portion: 'groß' },  supplements: [{ kind: 'medicine', name: 'Medizin', qty: 2, unit: 'Tbl', note: 'mit Apfel füttern' }] },
      }
    },
  ];

  // Helpers
  feedFor(p: HorsePlan, part: Daypart): FeedSpec | undefined { return p.feed[part]; }
  hasMultipleOats(o?: { scoop: ScoopSize; count: number }): boolean { return !!o && o.count > 1; }

  print(): void { window.print(); }
}