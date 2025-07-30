import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';


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

  horses = [
    {
      horseName: 'Check Point Charly',
      horseBreed: 'Hannoveraner',
      horseAge: 7,
      horseBirth: '12.05.2025',
      image: '/images/horse.svg'
    },
    {
      horseName: 'Bella',
      horseBreed: 'Friese',
      horseAge: 10,
      horseBirth: '01.04.2025',
      image: '/images/horse.svg'
    }
  ];

}
