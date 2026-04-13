import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Intake } from './components/intake/intake';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // Placeholder routes - to be implemented
  { path: 'intake', component: Intake, canActivate: [AuthGuard] }, // Intake management
  { path: 'sales', component: DashboardComponent, canActivate: [AuthGuard] }, // Replace with SalesComponent
  { path: 'expenses', component: DashboardComponent, canActivate: [AuthGuard] }, // Replace with ExpensesComponent
  { path: 'reports', component: DashboardComponent, canActivate: [AuthGuard] }, // Replace with ReportsComponent
  { path: 'admin', component: DashboardComponent, canActivate: [AuthGuard] }, // Replace with AdminComponent
];
