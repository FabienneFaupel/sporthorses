import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-horse-box',
  imports: [
   CommonModule
  ],
  templateUrl: './landing-horse-box.component.html',
  styleUrl: './landing-horse-box.component.scss'
})
export class LandingHorseBoxComponent {

  @Input() horseName!: string;
  @Input() horseAge!: number;
  @Input() horseBirth!: string;
  @Input() horseBreed!: string;
  @Input() horseGender!: string;
  

  formatBirth(v?: string): string {
  if (!v) return '';
  const [y, m, d] = v.split('-');
  if (!y || !m || !d) return v;
  return `${d}.${m}.${y}`;
}




}
