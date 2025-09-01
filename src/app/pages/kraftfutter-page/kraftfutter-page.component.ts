import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { KraftfutterAddDialogComponent } from '../../components/kraftfutter-add-dialog/kraftfutter-add-dialog.component';
import { DataService } from '../../services/data.service';
import { KraftfutterDelivery, KraftfutterType } from '../../models/kraftfutter';

type ProductKey = 'hafer' | 'muesli' | 'zusatz';

interface ProductStats {
  count: number;
  total: number;            // €
  totalFormatted: string;
  last: string | null;      // dd.MM.yyyy
}

@Component({
  selector: 'app-kraftfutter-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    KraftfutterAddDialogComponent,
    MatProgressBarModule
  ],
  templateUrl: './kraftfutter-page.component.html',
  styleUrl: './kraftfutter-page.component.scss'
})
export class KraftfutterPageComponent {
 deliveries: KraftfutterDelivery[] = [];
 filteredDeliveries: KraftfutterDelivery[] = [];
  loading = true;

  // Jahr-Filter
  currentYear = new Date().getFullYear();
  years: (number | 'all')[] = [];                  // 👈 Optionen im Dropdown
  selectedYear: number | 'all' = this.currentYear;

  statsByProduct: Record<ProductKey, ProductStats> = {
    hafer: { count: 0, total: 0, totalFormatted: '€ 0,–', last: null },
    muesli: { count: 0, total: 0, totalFormatted: '€ 0,–', last: null },
    zusatz: { count: 0, total: 0, totalFormatted: '€ 0,–', last: null },
  };


  constructor(private dialog: MatDialog, private data: DataService) {}

   async ngOnInit() {
    await this.data.loadKraftfutterFromDb();
    this.deliveries = this.data.getKraftfutter();
    this.setupYears();
    this.applyFilters();        // 👈 initial filtern + sortieren
    this.loading = false;
  }

  // Optionen: aktuelles Jahr, 3 weitere zurück (insgesamt 4), plus "Alle Jahre"
  private setupYears() {
    this.years = [
      this.currentYear,
      this.currentYear - 1,
      this.currentYear - 2,
      this.currentYear - 3,
      this.currentYear - 4,
      'all'
    ];
  }

   /** ISO 'yyyy-MM-dd' -> Date (mittags, um TZ-Effekte zu vermeiden) */
  private parseIsoDate(iso: string): Date {
    if (!iso) return new Date(0);
    const [y, m, d] = iso.split('-').map(n => parseInt(n, 10));
    return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
  }

  /** ISO -> 'dd.MM.yyyy' */
  formatDateGermanFromIso = (iso: string | null | undefined): string | null => {
    if (!iso) return null;
    const dt = this.parseIsoDate(iso);
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  /** neu -> alt */
  private sortDescByDate(list: KraftfutterDelivery[]): KraftfutterDelivery[] {
    return [...list].sort((a, b) => {
      // ISO ist lexikographisch sortierbar, aber wir gehen über Date für Sicherheit
      const da = this.parseIsoDate(a.date).getTime();
      const db = this.parseIsoDate(b.date).getTime();
      return db - da;
    });
  }

  private formatEuroShort(amount: number): string {
    return `€ ${Math.round(amount).toLocaleString('de-DE')},–`;
  }

  applyFilters() {
    let list = [...this.deliveries];

    if (this.selectedYear !== 'all') {
      list = list.filter(d => this.parseIsoDate(d.date).getFullYear() === this.selectedYear);
    }

    this.filteredDeliveries = this.sortDescByDate(list);
    this.recomputeStats();
  }

  private recomputeStats() {
    const base: Record<ProductKey, ProductStats> = {
      hafer: { count: 0, total: 0, totalFormatted: '€ 0,–', last: null },
      muesli: { count: 0, total: 0, totalFormatted: '€ 0,–', last: null },
      zusatz: { count: 0, total: 0, totalFormatted: '€ 0,–', last: null },
    };

    const byProduct: Record<ProductKey, KraftfutterDelivery[]> = {
      hafer: [], muesli: [], zusatz: [],
    };

    for (const d of this.filteredDeliveries) {
      const key = (d.product as ProductKey) ?? 'zusatz';
      byProduct[key].push(d);
    }

    (Object.keys(byProduct) as ProductKey[]).forEach(p => {
      const arr = byProduct[p];
      const count = arr.length;
      const total = arr.reduce((sum, x) => sum + (x.priceEuro ?? 0), 0);
      const lastIso = arr.length ? this.sortDescByDate(arr)[0].date : null;

      base[p] = {
        count,
        total,
        totalFormatted: this.formatEuroShort(total),
        last: this.formatDateGermanFromIso(lastIso),
      };
    });

    this.statsByProduct = base;
  }



  iconFor(p: KraftfutterType): string {
  switch (p) {
    case 'hafer':
      return 'hafer.svg';
    case 'muesli':
      return 'muesli1.png';
    case 'zusatz':
      return 'zusatzfutter.svg';   // 👈 genau so benannt
    default:
      return 'default.svg';        // fallback falls mal was anderes drinsteht
  }
}

labelFor(p: KraftfutterType): string {
  switch (p) {
    case 'hafer':
      return 'Hafer';
    case 'muesli':
      return 'Müsli';
    case 'zusatz':
      return 'Zusatzfutter';
    default:
      return p;
  }
}

openKraftfutterDialog() {
  const ref = this.dialog.open(KraftfutterAddDialogComponent, { width: '420px' });

  ref.afterClosed().subscribe(async (res?: {
    mode: 'add';
    delivery: Omit<KraftfutterDelivery,'_id'|'_rev'|'createdAt'|'updatedAt'|'docType'>;
  }) => {
    if (!res) return;
    if (res.mode !== 'add') return;

    await this.data.addKraftfutter(res.delivery);
    this.deliveries = this.data.getKraftfutter();
    this.applyFilters();
  });
}

edit(delivery: KraftfutterDelivery) {
  const ref = this.dialog.open(KraftfutterAddDialogComponent, {
    width: '420px',
    data: { delivery }
  });

  ref.afterClosed().subscribe(async (res?: {
    mode: 'edit';
    delivery: KraftfutterDelivery;
  }) => {
    if (!res) return;
    if (res.mode !== 'edit') return;

    await this.data.updateKraftfutter(res.delivery);
    this.deliveries = this.data.getKraftfutter();
    this.applyFilters();
  });
}

async remove(delivery: KraftfutterDelivery) {
  if (!confirm('Diese Lieferung wirklich löschen?')) return;
  await this.data.deleteKraftfutter(delivery);
  this.deliveries = this.data.getKraftfutter();
  this.applyFilters();
}



}