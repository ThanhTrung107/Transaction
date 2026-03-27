import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BillComponent } from './components/bill/bill.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'bill', component: BillComponent },
];
