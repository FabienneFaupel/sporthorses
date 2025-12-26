import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


import { FutterplanAddDialogComponent } from '../../components/futterplan-add-dialog/futterplan-add-dialog.component';
import { Slot, FeedPlanItem, FeedPlan } from '../../models/feed-plan';
import { Horse } from '../../models/horse';


import { DataService } from '../../services/data.service';



@Component({
  selector: 'app-futterplan-page',
  imports: [
     CommonModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
FutterplanAddDialogComponent,

  ],
  templateUrl: './futterplan-page.component.html',
  styleUrl: './futterplan-page.component.scss'
})
export class FutterplanPageComponent {
  
 slots: Slot[] = ['Morgens', 'Mittags', 'Abends'];
  horses: Horse[] = [];
  

  constructor(private data: DataService, private dialog: MatDialog) {}


  async ngOnInit() {
  await this.data.loadHorsesFromDb();
  await this.data.loadFeedDefinitionsFromDb();

  this.horses = this.data.getHorses();

  // Plan default + Slots absichern
  for (const h of this.horses) {
    h.feedPlan ??= { Morgens: [], Mittags: [], Abends: [] };
    h.feedPlan.Morgens ??= [];
    h.feedPlan.Mittags ??= [];
    h.feedPlan.Abends ??= [];
  }
}


  feedsFor(h: Horse, slot: Slot): FeedPlanItem[] {
  return h.feedPlan?.[slot] ?? [];
}


  async openAddDialog(h: Horse, slot: Slot) {
  const ref = this.dialog.open(FutterplanAddDialogComponent, {
  width: '420px',
  data: {
    horseName: h.name,
    slot,
    mode: 'add',
    feedDefs: this.data.getFeedDefinitions() // ✅ neu
  }
});


  ref.afterClosed().subscribe(async (res?: FeedPlanItem) => {
    if (!res) return;

    // optimistic
    h.feedPlan![slot].push(res);

    try {
      await this.data.updateHorse(h);
    } catch (e) {
      console.error(e);
      h.feedPlan![slot].pop(); // rollback
    }
  });
}


  async openEditDialog(h: Horse, slot: Slot, index: number) {
  const current = h.feedPlan![slot][index];

  const ref = this.dialog.open(FutterplanAddDialogComponent, {
    width: '420px',
    data: {
  horseName: h.name,
  slot,
  mode: 'edit',
  initial: current,
  feedDefs: this.data.getFeedDefinitions()
}

  });

  ref.afterClosed().subscribe(async (res?: FeedPlanItem | { delete: true }) => {
    if (!res) return;

    const prev = [...h.feedPlan![slot]];

    if ((res as any).delete) {
      h.feedPlan![slot].splice(index, 1);
    } else {
      h.feedPlan![slot][index] = res as FeedPlanItem;
    }

    try {
      await this.data.updateHorse(h);
    } catch (e) {
      console.error(e);
      h.feedPlan![slot] = prev; // rollback
    }
  });
}

}