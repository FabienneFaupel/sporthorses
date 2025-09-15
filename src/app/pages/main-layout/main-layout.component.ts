import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatListItem } from '@angular/material/list';
import { MatNavList } from '@angular/material/list';

import { LandingPageComponent } from '../landing-page/landing-page.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../../components/bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-main-layout',
  imports: [

    RouterOutlet,
    RouterModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSidenavModule,
    MatListModule,
    MatListItem,
    MatNavList,
    LandingPageComponent,

    
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
constructor(private bottomSheet: MatBottomSheet) {}

  openMore() {
    this.bottomSheet.open(BottomSheetComponent, {
      panelClass: 'more-sheet',   // optional: fürs Styling
      autoFocus: false,
      restoreFocus: false
    });
  }
}