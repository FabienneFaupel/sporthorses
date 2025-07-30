import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';

export const routes: Routes = [
    { 
        path: '', 
        component: MainLayoutComponent, 
        children: [
            { path: '', component: LandingPageComponent },
        ] 
    },
    { path: '**', redirectTo: '' }
];