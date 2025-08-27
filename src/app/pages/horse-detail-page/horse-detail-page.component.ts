import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Horse } from '../../models/horse';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-horse-detail-page',
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatListModule, MatDividerModule, MatButtonModule
  ],
  templateUrl: './horse-detail-page.component.html',
  styleUrl: './horse-detail-page.component.scss'
})
export class HorseDetailPageComponent {
 horse: Horse | null = null;
  id = -1;

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    this.id = param ? Number(param) : -1;

    const list = this.data.getHorses();
    if (Number.isInteger(this.id) && this.id >= 0 && this.id < list.length) {
      this.horse = list[this.id];
    } else {
      this.router.navigate(['/horses']);
    }
  }

  back() { this.router.navigate(['/horses']); }
}