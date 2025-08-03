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
    MatSelectModule
  ],
  templateUrl: './horse-feed-page.component.html',
  styleUrl: './horse-feed-page.component.scss'
})
export class HorseFeedPageComponent {
  hayMax = 50;
  strawMax = 60;

  hayCurrent = 20;
  strawCurrent = 33;

  // Jahr-Filter
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];
  
feedLog = [
    { date: new Date('2025-01-01'), type: 'heu', action: 'consume', amount: 1 },
    { date: new Date('2025-02-12'), type: 'stroh', action: 'add', amount: 5, price: 75  },
    { date: new Date('2024-06-23'), type: 'heu', action: 'add', amount: 10, price: 75  },
    { date: new Date('2025-01-01'), type: 'heu', action: 'consume', amount: 1 },
    { date: new Date('2025-03-12'), type: 'stroh', action: 'add', amount: 5, price: 75  },
    { date: new Date('2025-04-23'), type: 'heu', action: 'add', amount: 10, price: 75  },
  ];

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  filteredFeedLog() {
  return this.feedLog
    .filter(log => new Date(log.date).getFullYear() === this.selectedYear)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


  openConsumeDialog(type: 'hay' | 'straw') {
    // MatDialog öffnen, Menge abfragen, dann Wert anpassen
  }

  openAddDialog(type: 'hay' | 'straw') {
    // MatDialog öffnen, Menge abfragen, dann Wert anpassen
  }
}