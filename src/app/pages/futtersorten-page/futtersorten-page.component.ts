import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataService } from '../../services/data.service';

import { FeedDefinition, FeedBaseType, UnitKey } from '../../models/feed-definition';
import { FuttersortenDialogComponent } from '../../components/futtersorten-dialog/futtersorten-dialog.component';

type TabKey = 'kraftfutter' | 'zusatzfutter' | 'medizin';

@Component({
  selector: 'app-futtersorten-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FuttersortenDialogComponent,
    MatTooltipModule
  ],
  templateUrl: './futtersorten-page.component.html',
  styleUrl: './futtersorten-page.component.scss'
})
export class FuttersortenPageComponent {
  tabs: { key: TabKey; label: string }[] = [
    { key: 'kraftfutter', label: 'Kraftfutter' },
    { key: 'zusatzfutter', label: 'Zusatzfutter' },
    { key: 'medizin', label: 'Medizin' }
  ];

  defs: FeedDefinition[] = [];

  constructor(private dialog: MatDialog, private data: DataService) {}

  async ngOnInit() {
    await this.data.loadFeedDefinitionsFromDb();
    this.defs = this.data.getFeedDefinitions();
  }

  iconForBaseType(t: FeedBaseType): string {
    switch (t) {
      case 'hafer': return '/images/hafer.svg';
      case 'mash': return '/images/mash.svg';
      case 'pellets': return '/images/pellets.svg';
      case 'muesli': return '/images/muesli1.png';
      case 'zusatzfutter': return '/images/zusatzfutter.png';
      case 'medizin': return '/images/medizin.svg';
      default: return '/images/default.svg';
    }
  }

  visibleDefs(tab: TabKey): FeedDefinition[] {
  if (tab === 'kraftfutter') {
    return this.defs.filter(d =>
      ['hafer','mash','pellets','muesli'].includes(d.baseType)
      // ✅ scope NICHT filtern!
    );
  }
  if (tab === 'zusatzfutter') return this.defs.filter(d => d.baseType === 'zusatzfutter');
  return this.defs.filter(d => d.baseType === 'medizin');
}


  openAdd(tab: TabKey) {
    const preset = this.presetForTab(tab);

    const ref = this.dialog.open(FuttersortenDialogComponent, {
      width: '520px',
      maxWidth: '92vw',
      autoFocus: false,
      data: { mode: 'add', preset }
    });

    ref.afterClosed().subscribe(async (res?: FeedDefinition) => {
      if (!res) return;

      // ✅ Add: als Payload OHNE Couch-Felder speichern
      const { _id, _rev, docType, stallId, createdAt, updatedAt, ...payload } = res as any;

      await this.data.addFeedDefinition(payload);
      this.defs = this.data.getFeedDefinitions();
    });
  }

  openEdit(item: FeedDefinition) {
    const ref = this.dialog.open(FuttersortenDialogComponent, {
      width: '520px',
      maxWidth: '92vw',
      autoFocus: false,
      data: { mode: 'edit', initial: item }
    });

    ref.afterClosed().subscribe(async (res?: FeedDefinition | { delete: true }) => {
      if (!res) return;

      if ((res as any).delete) {
  if (item.isDefault) return;

  await this.data.loadHorsesFromDb();
  await this.data.loadKraftfutterFromDb();

  const planCount = this.data.countFeedPlanUsages(item._id!);
  const deliveryCount = this.data.countKraftfutterUsages(item._id!);

  const ok = await this.confirmDelete(
    item.name,
    planCount,
    deliveryCount
  );

  if (!ok) return;

  await this.data.deleteFeedDefinitionCascade(item);
  this.defs = this.data.getFeedDefinitions();
  return;
}



      await this.data.updateFeedDefinition(res as FeedDefinition);
      this.defs = this.data.getFeedDefinitions();
    });
  }

  private presetForTab(tab: TabKey): Partial<FeedDefinition> {
    if (tab === 'kraftfutter') {
      return { baseType: 'hafer', scope: 'both' };
    }
    if (tab === 'zusatzfutter') {
      return { baseType: 'zusatzfutter', scope: 'feedplan', allowedUnits: ['g','ml'] as UnitKey[] };
    }
    return { baseType: 'medizin', scope: 'feedplan', allowedUnits: ['ml','tabletten'] as UnitKey[] };
  }

  async confirmDelete(
  name: string,
  planCount: number,
  deliveryCount: number
): Promise<boolean> {
  const messageLines = [
    `„${name}“ wirklich löschen?`,
    '',
    planCount > 0 ? `• ${planCount} Einträge im Futterplan` : null,
    deliveryCount > 0 ? `• ${deliveryCount} Kraftfutter-Lieferungen` : null,
    '',
    'Alle Enträge aus dem Futterplan und der Lieferübersicht werden von diesem Produkt gelöscht.'
  ].filter(Boolean);

  return confirm(messageLines.join('\n'));
}

}