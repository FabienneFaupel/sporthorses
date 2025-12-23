import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DataService} from '../../services/data.service';
import { Horse } from '../../models/horse';
import { MatProgressBar } from '@angular/material/progress-bar';


import { LandingHorseBoxComponent } from '../../components/landing-horse-box/landing-horse-box.component';


@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    LandingHorseBoxComponent,
    MatProgressBar
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  isLoaded = false;
  isFailed = false;

  loading = true;  // neu


  horses: Horse[] = [];

  constructor(public dataService: DataService) {}

  async ngOnInit(): Promise<void> {
  this.loading = true;
  this.isFailed = false;

  try {
    await this.dataService.loadHorsesFromDb();
    this.horses = this.dataService.getHorses();
  } catch (e) {
    console.error('Fehler beim Laden der Pferde:', e);
    this.isFailed = true;
  } finally {
    this.loading = false;
  }
}



}
