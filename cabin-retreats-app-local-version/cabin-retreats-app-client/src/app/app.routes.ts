import { Routes } from '@angular/router';
import { CabinDetailsComponent } from './pages/cabin-details/cabin-details.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path:'',
        component: HomeComponent
    },
    
    {
        path:'cabin-details/:cabinName',
        component: CabinDetailsComponent
    }
];
