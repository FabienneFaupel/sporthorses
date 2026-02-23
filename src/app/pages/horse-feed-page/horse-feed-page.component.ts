import { Component } from '@angular/core';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { FeedAddDialogComponent } from '../../components/feed-add-dialog/feed-add-dialog.component';
import { FeedConsumeDialogComponent } from '../../components/feed-consume-dialog/feed-consume-dialog.component';
import { DataService } from '../../services/data.service';
import { FeedLogEntry } from '../../models/feed';
import { KraftfutterPageComponent } from '../../pages/kraftfutter-page/kraftfutter-page.component';
import { FutterplanPageComponent } from '../futterplan-page/futterplan-page.component';
import { toDateOnlyIsoLocal, fromDateOnlyIsoLocal } from '../../utils/date';


@Component({
  selector: 'app-horse-feed-page',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FeedAddDialogComponent,
    FeedConsumeDialogComponent,
    MatTabsModule,
    KraftfutterPageComponent,
    FutterplanPageComponent
  ],
  templateUrl: './horse-feed-page.component.html',
  styleUrl: './horse-feed-page.component.scss'
})
export class HorseFeedPageComponent {

  constructor(private dialog: MatDialog, private dataService: DataService) {}

  iconForFeedType(type: 'heu' | 'stroh'): string {
  switch (type) {
    case 'heu': return '/images/heu.svg';
    case 'stroh': return '/images/stroh.svg'; // falls du die Datei so hast
    default: return '/images/default.svg';
  }
}


  // Jahr-Filter
 selectedYear: number | 'all' = new Date().getFullYear();
  availableYears: (number | 'all')[] = [];

  // Monat-Filter
selectedMonth: number | 'all' = new Date().getMonth() + 1; // 1..12
availableMonths: (number | 'all')[] = ['all', 1,2,3,4,5,6,7,8,9,10,11,12];

monthLabel(m: number | 'all') {
  if (m === 'all') return 'Alle Monate';
  return String(m).padStart(2, '0'); // 01..12
}

onYearChange() {
  if (this.selectedYear === 'all') this.selectedMonth = 'all';
}

   loading = true;

get totalConsumedFiltered(): number {
  return this.filteredFeedLog()
    .filter(log => log.action === 'consume')
    .reduce((sum, log) => sum + (log.amount ?? 0), 0);
}



async ngOnInit() {
  const currentYear = new Date().getFullYear();
  this.availableYears = ['all']; // "Alle Jahre" immer ganz vorne
  for (let i = 0; i < 5; i++) {
    this.availableYears.push(currentYear - i);
  }

  await this.dataService.loadFeedFromDb();
  this.loading = false;
}

async onDelete(entry: FeedLogEntry) {
  const ok = confirm('Willst du diesen Eintrag wirklich löschen?');
  if (!ok) return;
  await this.dataService.deleteFeed(entry);
}

async edit(entry: FeedLogEntry) {
  if (entry.action === 'add') {
    const dialogRef = this.dialog.open(FeedAddDialogComponent, {
      width: '300px',
      data: { ...entry }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.dataService.updateFeed(entry, {
          type: result.type,
          amount: result.amount,
          price: result.price,
          date: result.date
        });
      }
    });
  } else {
    const dialogRef = this.dialog.open(FeedConsumeDialogComponent, {
      width: '300px',
      data: {
        ...entry,
        hayCurrent: this.hayCurrent,
        strawCurrent: this.strawCurrent
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.dataService.updateFeed(entry, {
          type: result.type,
          amount: result.amount,
          date: result.date
        });
      }
    });
  }
}

// Getter für Template
  get hayMax() { return this.dataService.getHayMax(); }
  get strawMax() { return this.dataService.getStrawMax(); }
  get hayCurrent() { return this.dataService.getHayCurrent(); }
  get strawCurrent() { return this.dataService.getStrawCurrent(); }

  get feedLog(): FeedLogEntry[] {
    return this.dataService.getFeedLog();
  }


  filteredFeedLog() {
  return this.feedLog
    .filter(log => {
      const d = fromDateOnlyIsoLocal(log.date);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;

      const yearOk = this.selectedYear === 'all' || y === this.selectedYear;
      const monthOk = this.selectedMonth === 'all' || m === this.selectedMonth;

      return yearOk && monthOk;
    })
    .sort((a, b) => {
      const d =
        fromDateOnlyIsoLocal(b.date).getTime() -
        fromDateOnlyIsoLocal(a.date).getTime();

      if (d !== 0) return d;
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    });
}



  openAddDialog() {
    const dialogRef = this.dialog.open(FeedAddDialogComponent, { width: '300px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.amount && result?.type) {
        this.dataService.addFeed(result.type, result.amount, result.price, result.date);
      }
    });
  }

  openConsumeDialog() {
  const dialogRef = this.dialog.open(FeedConsumeDialogComponent, {
    width: '300px',
    data: {
      hayCurrent: this.hayCurrent,
      strawCurrent: this.strawCurrent
    }
  });

  dialogRef.afterClosed().subscribe(async result => {
    if (result?.amount && result?.type) {
      // Sicherheits-Check auch hier:
      if (!this.dataService.canConsume(result.type, result.amount)) {
        alert('Nicht genug Bestand für diesen Verbrauch.');
        return;
      }
      await this.dataService.consumeFeed(result.type, result.amount, result.date);
    }
  });
}




}