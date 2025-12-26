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



import { DataService } from '../../services/data.service';

type Slot = 'Morgens' | 'Mittags' | 'Abends';

interface FeedItem {
  product: string;
  amount: string;
  icon: string;
  iconColor: string;
}

interface HorsePlan {
  name: string;
  feedsBySlot: Record<Slot, FeedItem[]>;
}




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

  // dynamisch aus angelegten Pferden
  horses: HorsePlan[] = [];

  constructor(private data: DataService, private dialog: MatDialog) {}


  async ngOnInit() {
  try {
    await this.data.loadHorsesFromDb();
  } catch (e) {
    console.error(e);
  }

  const horsesFromDb = this.data.getHorses();
  this.horses = (horsesFromDb ?? []).map((h: any) => ({
    name: h.name,
    feedsBySlot: { Morgens: [], Mittags: [], Abends: [] }
  }));
}



  feedsFor(h: HorsePlan, slot: Slot): FeedItem[] {
    return h.feedsBySlot[slot] ?? [];
  }

  openAddDialog(h: HorsePlan, slot: Slot) {

  const ref = this.dialog.open(FutterplanAddDialogComponent, {
    width: '420px',
    data: { horseName: h.name, slot }
  });

  ref.afterClosed().subscribe((res?: FeedItem) => {
    if (!res) return;
    h.feedsBySlot[slot].push(res);
  });
}

}