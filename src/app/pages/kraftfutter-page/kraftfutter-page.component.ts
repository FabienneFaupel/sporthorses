import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { KraftfutterAddDialogComponent } from '../../components/kraftfutter-add-dialog/kraftfutter-add-dialog.component';

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
    KraftfutterAddDialogComponent
  ],
  templateUrl: './kraftfutter-page.component.html',
  styleUrl: './kraftfutter-page.component.scss'
})
export class KraftfutterPageComponent {
constructor(private dialog: MatDialog) {}

  // nur zeigen – keine Logik
  openKraftfutterDialog() {
    this.dialog.open(KraftfutterAddDialogComponent, { width: '420px' });
  }
}