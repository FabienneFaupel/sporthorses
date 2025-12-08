import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-futterplan-page',
  imports: [
     CommonModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './futterplan-page.component.html',
  styleUrl: './futterplan-page.component.scss'
})
export class FutterplanPageComponent {
  slots = ['Morgens', 'Mittags', 'Abends', 'Nachts'];

  horses = [
    {
      name: 'Somersby',
      feeds: [
        { product: 'Hafer', amount: '1 Schippe', icon: 'spa', iconColor: 'icon-grain' },
        { product: 'Cavalor Calm', amount: '5 g', icon: 'science', iconColor: 'icon-supplement' }
      ]
    },
    {
      name: 'test',
      feeds: [
        { product: 'Hafer', amount: '1/2 Schippe', icon: 'spa', iconColor: 'icon-grain' },
        { product: 'Heu', amount: 'Große Portion', icon: 'eco', iconColor: 'icon-hay' }
      ]
    }
  ];
}