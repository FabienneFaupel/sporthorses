import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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
    FuttersortenDialogComponent
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

  // ✅ v1: lokal (später DB)
  defs: FeedDefinition[] = [
    { id: 'd-hafer', baseType: 'hafer', name: 'Hafer', scope: 'both', isDefault: true },
    { id: 'd-heu', baseType: 'heu', name: 'Heu', scope: 'feedplan', isDefault: true },
    { id: 'd-mash', baseType: 'mash', name: 'Mash', scope: 'both', isDefault: true },
    { id: 'd-pellets', baseType: 'pellets', name: 'Pellets', scope: 'both', isDefault: true },
    { id: 'd-muesli', baseType: 'muesli', name: 'Müsli', scope: 'both', isDefault: true },

    { id: 'c-1', baseType: 'hafer', name: 'Gequetschter Hafer', scope: 'both' },
    { id: 'c-2', baseType: 'zusatzfutter', name: 'Magnesium', scope: 'feedplan', allowedUnits: ['g'] },
    { id: 'c-3', baseType: 'medizin', name: 'Wurmkur', scope: 'feedplan', allowedUnits: ['tabletten', 'ml'] },
  ];

  iconForBaseType(t: FeedBaseType): string {
    // deine Icons im public/images
    switch (t) {
      case 'hafer': return '/images/hafer.svg';
      case 'mash': return '/images/mash.svg';
      case 'pellets': return '/images/pellets.svg';
      case 'muesli': return '/images/muesli1.png';
      case 'zusatzfutter': return '/images/zusatzfutter.png'; // falls vorhanden
      case 'medizin': return '/images/medizin.svg'; // falls vorhanden
      default: return '/images/default.svg';
    }
  }

  visibleDefs(tab: TabKey): FeedDefinition[] {
    if (tab === 'kraftfutter') {
      return this.defs.filter(d => ['hafer','mash','pellets','muesli'].includes(d.baseType) && d.scope === 'both');
    }
    if (tab === 'zusatzfutter') {
      return this.defs.filter(d => d.baseType === 'zusatzfutter');
    }
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

    ref.afterClosed().subscribe((res?: FeedDefinition) => {
      if (!res) return;
      this.defs = [res, ...this.defs];
    });
  }

  openEdit(item: FeedDefinition) {
    const ref = this.dialog.open(FuttersortenDialogComponent, {
      width: '520px',
  maxWidth: '92vw',
  autoFocus: false,
      data: { mode: 'edit', initial: item }
    });

    ref.afterClosed().subscribe((res?: FeedDefinition | { delete: true }) => {
      if (!res) return;

      if ((res as any).delete) {
        if (item.isDefault) return; // safety
        this.defs = this.defs.filter(d => d.id !== item.id);
        return;
      }

      const updated = res as FeedDefinition;
      this.defs = this.defs.map(d => d.id === item.id ? updated : d);
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

  constructor(private dialog: MatDialog) {}
}