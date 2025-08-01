import { Component } from '@angular/core';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-horse-feed-page',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './horse-feed-page.component.html',
  styleUrl: './horse-feed-page.component.scss'
})
export class HorseFeedPageComponent {
  hayMax = 50;
  strawMax = 60;

  hayCurrent = 20;
  strawCurrent = 33;

  feedLog = [
  { date: new Date(), type: 'Heu', action: 'consume', amount: 1 },
  { date: new Date(), type: 'Stroh', action: 'add', amount: 5 },
  { date: new Date(), type: 'Heu', action: 'add', amount: 10 },
];


  openConsumeDialog(type: 'hay' | 'straw') {
    // MatDialog öffnen, Menge abfragen, dann Wert anpassen
  }

  openAddDialog(type: 'hay' | 'straw') {
    // MatDialog öffnen, Menge abfragen, dann Wert anpassen
  }
}