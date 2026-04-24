import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { VaccinationPageComponent } from './pages/vaccination-page/vaccination-page.component';
import { FarrierPageComponent } from './pages/farrier-page/farrier-page.component';
import { HorseFeedPageComponent } from './pages/horse-feed-page/horse-feed-page.component';
import { AddHorsePageComponent } from './pages/add-horse-page/add-horse-page.component';
import { HorseDetailPageComponent } from './pages/horse-detail-page/horse-detail-page.component';
import { FutterplanPageComponent } from './pages/futterplan-page/futterplan-page.component';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { FuttersortenPageComponent } from './pages/futtersorten-page/futtersorten-page.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { ZuchtPageComponent } from './pages/zucht-page/zucht-page.component';

export const routes: Routes = [

    { path: 'login', component: LoginPageComponent, canActivate: [guestGuard] },

    { 
        path: '', 
        component: MainLayoutComponent, 
        canActivate: [authGuard],
        children: [
            { path: '', component: LandingPageComponent },
            { path: 'vaccination', component: VaccinationPageComponent },
            { path: 'farrier', component: FarrierPageComponent },
            { path: 'feed', component: HorseFeedPageComponent },
            { path: 'addHorse', component: AddHorsePageComponent },
            { path: 'horses/:id', component: HorseDetailPageComponent },
            { path: 'futterplan', component: FutterplanPageComponent },
            { path: 'futtersorten', component: FuttersortenPageComponent },
            { path: 'calendar', component: CalendarPageComponent },
            { path: 'zucht', component: ZuchtPageComponent },








        ] 
    },
    { path: '**', redirectTo: '' }
];