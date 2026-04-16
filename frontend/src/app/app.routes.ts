import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Intake } from './components/intake/intake';
import { Sales } from './components/sales/sales';
import { Expenses } from './components/expenses/expenses';
import { ReportsComponent } from './components/reports/reports.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'intake', component: Intake, canActivate: [AuthGuard] }, // Intake management
  { path: 'sales', component: Sales, canActivate: [AuthGuard] }, // Sales management
  { path: 'expenses', component: Expenses, canActivate: [AuthGuard] }, // Expenses management
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] }, // Reports & Analytics
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] }, // Admin panel (Super users only)
];
