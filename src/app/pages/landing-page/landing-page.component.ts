import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DataService, Horse } from '../../services/data.service';


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
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  isLoaded = false;
  isFailed = false;

  horses: Horse[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.horses = this.dataService.getHorses();
    this.isLoaded = true;
  }

}
