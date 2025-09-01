import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { KraftfutterAddDialogComponent } from '../../components/kraftfutter-add-dialog/kraftfutter-add-dialog.component';
import { DataService } from '../../services/data.service';
import { KraftfutterDelivery, KraftfutterType } from '../../models/kraftfutter';

@Component({
  selector: 'app-kraftfutter-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    KraftfutterAddDialogComponent,
    MatProgressBarModule
  ],
  templateUrl: './kraftfutter-page.component.html',
  styleUrl: './kraftfutter-page.component.scss'
})
export class KraftfutterPageComponent {
 deliveries: KraftfutterDelivery[] = [];
  loading = true;

  iconFor(p: KraftfutterType): string {
  switch (p) {
    case 'hafer':
      return 'hafer.svg';
    case 'muesli':
      return 'muesli1.png';
    case 'zusatz':
      return 'zusatzfutter.svg';   // 👈 genau so benannt
    default:
      return 'default.svg';        // fallback falls mal was anderes drinsteht
  }
}

labelFor(p: KraftfutterType): string {
  switch (p) {
    case 'hafer':
      return 'Hafer';
    case 'muesli':
      return 'Müsli';
    case 'zusatz':
      return 'Zusatzfutter';
    default:
      return p;
  }
}



  constructor(private dialog: MatDialog, private data: DataService) {}

  async ngOnInit() {
    await this.data.loadKraftfutterFromDb();
    this.deliveries = this.data.getKraftfutter();
    this.loading = false;
  }

  openKraftfutterDialog() {
    const ref = this.dialog.open(KraftfutterAddDialogComponent, { width: '420px' });
    ref.afterClosed().subscribe(async (payload?: Omit<KraftfutterDelivery, '_id'|'_rev'|'createdAt'|'updatedAt'>) => {
      if (!payload) return;
      await this.data.addKraftfutter(payload);
      this.deliveries = this.data.getKraftfutter(); // Ansicht aktualisieren
    });
  }
}