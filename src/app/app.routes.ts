import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { VaccinationPageComponent } from './pages/vaccination-page/vaccination-page.component';
import { FarrierPageComponent } from './pages/farrier-page/farrier-page.component';

export const routes: Routes = [
    { 
        path: '', 
        component: MainLayoutComponent, 
        children: [
            { path: '', component: LandingPageComponent },
            { path: 'vaccination', component: VaccinationPageComponent },
            { path: 'farrier', component: FarrierPageComponent },


        ] 
    },
    { path: '**', redirectTo: '' }
];