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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public data: DataService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id'); // _id aus der URL
    if (!id) {
      this.router.navigate(['/horses']);
      return;
    }

    // 1) Erst lokal versuchen (falls wir von der Liste kommen)
    this.horse = this.data.getHorses().find(h => h._id === id) ?? null;
    if (this.horse) return;

    // 2) Fallback: aus DB laden, dann erneut suchen
    await this.data.loadHorsesFromDb();
    this.horse = this.data.getHorses().find(h => h._id === id) ?? null;
    if (!this.horse) this.router.navigate(['/horses']);
  }

  back() { this.router.navigate(['/horses']); }

  // Optional: Edit/Delete Buttons anschließen (wenn du sie in der HTML schon hast)
  editHorse() {
    if (!this.horse) return;
    this.router.navigate(['/addHorse'], {
      state: { editMode: true, horse: this.horse }
    });
  }

  async deleteHorse() {
    if (!this.horse) return;
    const ok = confirm(`„${this.horse.name}“ wirklich löschen?`);
    if (!ok) return;

    try {
      await this.data.deleteHorse(this.horse);
      this.router.navigate(['/horses']);
    } catch (e) {
      console.error('Löschen fehlgeschlagen', e);
      alert('Konnte nicht löschen.');
    }
  }
  
  formatDate(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

}