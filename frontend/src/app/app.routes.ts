import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LegalComponent } from './components/legal/legal.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'legal', component: LegalComponent },
  { path: '**', component: NotFoundComponent }
];
