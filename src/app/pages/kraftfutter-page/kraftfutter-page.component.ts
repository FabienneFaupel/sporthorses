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

interface ProductMeta {
  key: KraftfutterType;
  label: string;
  icon: string;
}

interface ProductStats {
  count: number;
  total: number;
  totalFormatted: string;
  last: string | null;
}

const PRODUCTS: ProductMeta[] = [
  { key: 'muesli',  label: 'Müsli',  icon: 'muesli1.png' },
  { key: 'pellets', label: 'Pellets', icon: 'pellets.svg' }, // Icon-Datei anlegen
  { key: 'mash',    label: 'Mash',    icon: 'mash.svg' },    // Icon-Datei anlegen
  { key: 'hafer',   label: 'Hafer',   icon: 'hafer.svg' },
];

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

  currentYear = new Date().getFullYear();
  years: (number | 'all')[] = [];
  selectedYear: number | 'all' = this.currentYear;

  // 👇 Tabs, die angezeigt werden
  visibleProducts: ProductMeta[] = [];

  // 👇 Stats dynamisch, keyed by KraftfutterType
  statsByProduct: Partial<Record<KraftfutterType, ProductStats>> = {};

  constructor(private dialog: MatDialog, private data: DataService) {}

  async ngOnInit() {
    await this.data.loadKraftfutterFromDb();
    this.deliveries = this.data.getKraftfutter();

    this.setupYears();
    this.applyFilters(); // setzt filteredDeliveries + stats + visibleProducts

    this.loading = false;
  }

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

  private parseIsoDate(iso: string): Date {
    if (!iso) return new Date(0);
    const [y, m, d] = iso.split('-').map(n => parseInt(n, 10));
    return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
  }

  formatDateGermanFromIso = (iso: string | null | undefined): string | null => {
    if (!iso) return null;
    const dt = this.parseIsoDate(iso);
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  private sortDescByDate(list: KraftfutterDelivery[]): KraftfutterDelivery[] {
    return [...list].sort((a, b) => {
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

    // 1) relevante Produkte aus Lieferungen bestimmen (später + Plan)
    const fromDeliveries = new Set<KraftfutterType>(this.deliveries.map(d => d.product));
    // später:
    // const fromPlan = new Set<KraftfutterType>(this.data.getFeedTypesFromPlan());
    // const relevant = new Set([...fromDeliveries, ...fromPlan]);

    const relevant = fromDeliveries;

    // 2) Tabs/Meta setzen (nur die relevanten)
    this.visibleProducts = PRODUCTS.filter(p => relevant.has(p.key));

    // 3) Stats neu rechnen
    this.recomputeStats();
  }

  private recomputeStats() {
    const stats: Partial<Record<KraftfutterType, ProductStats>> = {};

    for (const p of this.visibleProducts) {
      const arr = this.filteredDeliveries.filter(d => d.product === p.key);

      const count = arr.length;
      const total = arr.reduce((sum, x) => sum + (x.priceEuro ?? 0), 0);
      const lastIso = arr.length ? this.sortDescByDate(arr)[0].date : null;

      stats[p.key] = {
        count,
        total,
        totalFormatted: this.formatEuroShort(total),
        last: this.formatDateGermanFromIso(lastIso),
      };
    }

    this.statsByProduct = stats;
  }

  iconFor(p: KraftfutterType): string {
    return PRODUCTS.find(x => x.key === p)?.icon ?? 'default.svg';
  }

  labelFor(p: KraftfutterType): string {
    return PRODUCTS.find(x => x.key === p)?.label ?? p;
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