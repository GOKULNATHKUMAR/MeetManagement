import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  // Placeholder routes - to be implemented
  { path: 'intake', component: DashboardComponent }, // Replace with IntakeComponent
  { path: 'sales', component: DashboardComponent }, // Replace with SalesComponent
  { path: 'expenses', component: DashboardComponent }, // Replace with ExpensesComponent
  { path: 'reports', component: DashboardComponent }, // Replace with ReportsComponent
  { path: 'admin', component: DashboardComponent }, // Replace with AdminComponent
];
