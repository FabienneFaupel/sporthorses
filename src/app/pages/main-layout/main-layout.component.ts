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
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatMenuModule } from '@angular/material/menu';



import { LandingPageComponent } from '../landing-page/landing-page.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../../components/bottom-sheet/bottom-sheet.component';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';

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
    UserMenuComponent,
    MatMenuModule

    
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
isMoreActive = false;

  constructor(private bottomSheet: MatBottomSheet, private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isMoreActive = this.checkMoreRoutes();
      });
  }

  checkMoreRoutes(): boolean {
    const url = this.router.url;

    // alle Seiten, die zu "Mehr" gehören
    return url.startsWith('/futterplan') ||
           url.startsWith('/profile') ||
           url.startsWith('/support');
  }



  openMore() {
    this.bottomSheet.open(BottomSheetComponent, {
      panelClass: 'more-sheet',   // optional: fürs Styling
      autoFocus: false,
      restoreFocus: false
    });
  }
}