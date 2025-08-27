import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { VaccinationDialogComponent } from '../../components/vaccination-dialog/vaccination-dialog.component';

import { DataService} from '../../services/data.service';
import { Horse } from '../../models/horse';


@Component({
  selector: 'app-vaccination-page',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    VaccinationDialogComponent
  ],
  templateUrl: './vaccination-page.component.html',
  styleUrl: './vaccination-page.component.scss'
})
export class VaccinationPageComponent {

  horses: Horse[] = [];

  constructor(
    private dialog: MatDialog,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.horses = this.dataService.getHorses();
  }

 openVaccinationDialog(): void {
  const ref = this.dialog.open(VaccinationDialogComponent, {
    width: '400px',
    data: { horses: this.horses }
  });

  ref.afterClosed().subscribe(res => {
    if (!res) return;
    console.log('Dialog-Result:', res);
    // res.horseIds: string[]
    // res.entry: { type, date(YYYY-MM-DD), status }
    // -> Im nächsten Schritt speichern wir das in CouchDB und aktualisieren die View.
  });
}

}