import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApplicationRef } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, interval, first } from 'rxjs';



import { LandingPageComponent } from './pages/landing-page/landing-page.component';

@Component({
  selector: 'app-root',
    imports: [
    RouterOutlet,
    RouterModule, 

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SportHorses';

constructor(appRef: ApplicationRef, updates: SwUpdate) {
    if (!updates.isEnabled) return;

    // regelmäßig nach Updates suchen (nachdem App stabil ist)
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const every30s$ = interval(30_000);
    concat(appIsStable$, every30s$).subscribe(() => updates.checkForUpdate());

    // nur wenn wirklich eine neue Version bereit ist -> aktivieren + reload
    updates.versionUpdates.subscribe(evt => {
      if (evt.type === 'VERSION_READY') {
        updates.activateUpdate().then(() => document.location.reload());
      }
    });
  }
}