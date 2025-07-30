import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-landing-horse-box',
  imports: [],
  templateUrl: './landing-horse-box.component.html',
  styleUrl: './landing-horse-box.component.scss'
})
export class LandingHorseBoxComponent {

  @Input() horseName!: string;
  @Input() horseAge!: number;
  @Input() horseBirth!: string;
  @Input() horseBreed!: string;
  @Input() horseImage!: string;



}
