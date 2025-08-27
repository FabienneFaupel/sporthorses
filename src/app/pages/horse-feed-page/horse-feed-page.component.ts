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

import { FeedAddDialogComponent } from '../../components/feed-add-dialog/feed-add-dialog.component';
import { FeedConsumeDialogComponent } from '../../components/feed-consume-dialog/feed-consume-dialog.component';
import { DataService, FeedLogEntry } from '../../services/data.service';


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
    FeedConsumeDialogComponent
  ],
  templateUrl: './horse-feed-page.component.html',
  styleUrl: './horse-feed-page.component.scss'
})
export class HorseFeedPageComponent {

  constructor(private dialog: MatDialog, private dataService: DataService) {}

  

  // Jahr-Filter
 selectedYear: number | 'all' = new Date().getFullYear();
  availableYears: (number | 'all')[] = [];

   loading = true;

   get totalConsumedThisYear(): number {
  return this.feedLog
    .filter(log =>
      log.action === 'consume' &&
      new Date(log.date).getFullYear() === this.selectedYear
    )
    .reduce((sum, log) => sum + log.amount, 0);
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
      if (this.selectedYear === 'all') return true;
      return new Date(log.date).getFullYear() === this.selectedYear;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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