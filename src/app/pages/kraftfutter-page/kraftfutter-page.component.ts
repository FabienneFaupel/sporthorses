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
import { KraftfutterDelivery } from '../../models/kraftfutter';
import { FeedBaseType } from '../../models/feed-definition';
import { MatTooltipModule } from '@angular/material/tooltip';


interface ProductMeta {
  feedDefId: string;
  label: string;         // delivery.name (aus FeedDefinition)
  baseType: FeedBaseType; // für Icon
}

interface ProductStats {
  count: number;
  total: number;
  totalFormatted: string;
  last: string | null;
}

type StatusLevel = 'ok' | 'low' | 'unknown';

interface ProductStatus {
  label: string;           // Text im Chip
  css: StatusLevel;        // ok/low/unknown
  hint?: string;           // optionaler Tooltip/kleiner Text
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
    MatProgressBarModule,
    MatTooltipModule
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

  visibleProducts: ProductMeta[] = [];

  statsByProduct: Record<string, ProductStats> = {};
  statusByProduct: Record<string, ProductStatus> = {};

  private readonly MS_PER_DAY = 1000 * 60 * 60 * 24;

  constructor(private dialog: MatDialog, private data: DataService) {}

  async ngOnInit() {
    // Nur DB laden, was wir wirklich brauchen
    await this.data.loadFeedDefinitionsFromDb();
    await this.data.loadKraftfutterFromDb();

    this.deliveries = this.data.getKraftfutter();

    this.setupYears();
    this.applyFilters();

    this.loading = false;
  }

  // -----------------------------
  // TrackBy (fix für NG0956)
  // -----------------------------
  trackProduct = (_: number, p: ProductMeta) => p.feedDefId;
  trackDelivery = (_: number, d: KraftfutterDelivery) => d._id ?? `${d.feedDefId}-${d.date}`;

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

  private daysBetween(aIso: string, bIso: string): number {
    const a = this.parseIsoDate(aIso).getTime();
    const b = this.parseIsoDate(bIso).getTime();
    return Math.max(0, Math.round((a - b) / this.MS_PER_DAY));
  }

  private daysSince(iso: string): number {
    const now = new Date().getTime();
    const t = this.parseIsoDate(iso).getTime();
    return Math.max(0, Math.round((now - t) / this.MS_PER_DAY));
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

    // Tabs/Produkte nur aus vorhandenen Lieferungen
    const map = new Map<string, ProductMeta>();
    for (const d of this.deliveries) {
      if (!d.feedDefId) continue;
      if (!map.has(d.feedDefId)) {
        map.set(d.feedDefId, {
          feedDefId: d.feedDefId,
          label: d.name,
          baseType: d.baseType
        });
      }
    }

    this.visibleProducts = Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label, 'de')
    );

    this.recomputeStats();
  }

  private recomputeStats() {
    const stats: Record<string, ProductStats> = {};
    const status: Record<string, ProductStatus> = {};

    for (const p of this.visibleProducts) {
      const arrAll = this.deliveries.filter(d => d.feedDefId === p.feedDefId);
      const arrFiltered = this.filteredDeliveries.filter(d => d.feedDefId === p.feedDefId);

      const count = arrFiltered.length;
      const total = arrFiltered.reduce((sum, x) => sum + (x.priceEuro ?? 0), 0);
      const lastIso = arrFiltered.length ? this.sortDescByDate(arrFiltered)[0].date : null;

      stats[p.feedDefId] = {
        count,
        total,
        totalFormatted: this.formatEuroShort(total),
        last: this.formatDateGermanFromIso(lastIso),
      };

      status[p.feedDefId] = this.computeStatusFromDeliveries(arrAll);
    }

    this.statsByProduct = stats;
    this.statusByProduct = status;
  }

  iconForBaseType(t: FeedBaseType): string {
    switch (t) {
      case 'hafer': return 'hafer.svg';
      case 'muesli': return 'muesli1.png';
      case 'mash': return 'mash.svg';
      case 'pellets': return 'pellets.svg';
      case 'zusatzfutter': return 'zusatzfutter.svg';
      case 'medizin': return 'medizin.svg';
      case 'heu': return 'heu.svg';
      default: return 'default.svg';
    }
  }

  openKraftfutterDialog() {
    const ref = this.dialog.open(KraftfutterAddDialogComponent, {
      width: '420px',
      data: { feedDefs: this.data.getFeedDefinitions() }
    });

    ref.afterClosed().subscribe(async (res?: {
      mode: 'add';
      delivery: Omit<KraftfutterDelivery,'_id'|'_rev'|'createdAt'|'updatedAt'|'docType'>;
    }) => {
      if (!res || res.mode !== 'add') return;

      await this.data.addKraftfutter(res.delivery);
      this.deliveries = this.data.getKraftfutter();
      this.applyFilters();
    });
  }

  edit(delivery: KraftfutterDelivery) {
    const ref = this.dialog.open(KraftfutterAddDialogComponent, {
      width: '420px',
      data: { delivery, feedDefs: this.data.getFeedDefinitions() }
    });

    ref.afterClosed().subscribe(async (res?: {
      mode: 'edit';
      delivery: KraftfutterDelivery;
    }) => {
      if (!res || res.mode !== 'edit') return;

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

  // -----------------------------
  // Status NUR aus Lieferungen
  // -----------------------------
  private computeStatusFromDeliveries(deliveriesAll: KraftfutterDelivery[]): ProductStatus {
    if (!deliveriesAll || deliveriesAll.length < 2) {
      return { label: 'Zu wenig Daten', css: 'unknown', hint: 'Mind. 2 Lieferungen nötig' };
    }

    const sorted = this.sortDescByDate(deliveriesAll);

    const last = sorted[0];
    const lastKg = this.deliveryKg(last);
    if (!Number.isFinite(lastKg) || lastKg <= 0) {
      return { label: 'Unklare Menge', css: 'unknown', hint: 'Liefermenge fehlt/ungültig' };
    }

    // Wir schätzen den typischen Abstand zwischen Lieferungen (robuster als nur 1 Intervall)
    const estDaysBetween = this.estimateTypicalDaysBetween(sorted, 3); // z.B. letzte 3 Intervalle
    if (!Number.isFinite(estDaysBetween) || estDaysBetween <= 0) {
      return { label: 'Noch kein Status', css: 'unknown' };
    }

    // Wie viele Tage seit letzter Lieferung vergangen sind
    const sinceLast = this.daysSince(last.date);

    // daysLeft = typischer Abstand - bereits vergangene Tage
    const daysLeft = Math.round(estDaysBetween - sinceLast);

    return this.daysToStatus(daysLeft, estDaysBetween);
  }

  private deliveryKg(d: KraftfutterDelivery): number {
    if (!d) return 0;

    const pt = String(d.packageType ?? '').toLowerCase(); // <- FIX: BigBag vs bigbag
    if (pt === 'bigbag' || pt === 'big_bag') {
      return Number(d.weightKg ?? 0);
    }

    const sackWeight = Number(d.sackWeightKg ?? 0);
    const count = Number(d.count ?? 0);
    return sackWeight * count;
  }

  private estimateTypicalDaysBetween(sortedDesc: KraftfutterDelivery[], maxIntervals: number): number {
    // sortedDesc[0] = neueste
    const intervals: number[] = [];

    for (let i = 0; i < Math.min(sortedDesc.length - 1, maxIntervals); i++) {
      const a = sortedDesc[i];
      const b = sortedDesc[i + 1];
      const days = this.daysBetween(a.date, b.date);
      if (days > 0) intervals.push(days);
    }

    if (intervals.length === 0) return 0;

    // robust: Median
    intervals.sort((x, y) => x - y);
    const mid = Math.floor(intervals.length / 2);
    return intervals.length % 2 === 1
      ? intervals[mid]
      : (intervals[mid - 1] + intervals[mid]) / 2;
  }

  private daysToStatus(daysLeft: number, basisDaysBetween: number): ProductStatus {
    if (!Number.isFinite(daysLeft)) {
      return { label: 'Noch kein Status', css: 'unknown' };
    }

    if (daysLeft <= 0) {
      return { label: 'Nachkauf fällig', css: 'low', hint: `Schätzung: ~${Math.round(basisDaysBetween)} Tage pro Lieferung` };
    }

    if (daysLeft <= 7) {
      return { label: `knapp (${daysLeft} T)`, css: 'low', hint: `Schätzung: ~${Math.round(basisDaysBetween)} Tage pro Lieferung` };
    }

    return { label: `ausreichend (${daysLeft} T)`, css: 'ok', hint: `Schätzung: ~${Math.round(basisDaysBetween)} Tage pro Lieferung` };
  }
}