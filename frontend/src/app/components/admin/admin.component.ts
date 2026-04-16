import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminService, User } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  intakes: any[] = [];
  sales: any[] = [];
  expenses: any[] = [];

  loadingUsers = false;
  loadingIntakes = false;
  loadingSales = false;
  loadingExpenses = false;

  displayedUserColumns: string[] = ['id', 'username', 'email', 'full_name', 'status', 'role', 'created_at', 'actions'];
  displayedIntakeColumns: string[] = ['id', 'owner', 'supplier', 'quantity', 'total_cost', 'intake_date'];
  displayedSalesColumns: string[] = ['id', 'owner', 'customer', 'quantity', 'total_revenue', 'sale_date'];
  displayedExpensesColumns: string[] = ['id', 'owner', 'category', 'amount', 'expense_date'];

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.loadingUsers = false;
      }
    });
  }

  loadIntakes(): void {
    this.loadingIntakes = true;
    this.adminService.getAllIntakes().subscribe({
      next: (intakes) => {
        this.intakes = intakes;
        this.loadingIntakes = false;
      },
      error: (error) => {
        console.error('Error loading intakes:', error);
        this.snackBar.open('Error loading intakes', 'Close', { duration: 3000 });
        this.loadingIntakes = false;
      }
    });
  }

  loadSales(): void {
    this.loadingSales = true;
    this.adminService.getAllSales().subscribe({
      next: (sales) => {
        this.sales = sales;
        this.loadingSales = false;
      },
      error: (error) => {
        console.error('Error loading sales:', error);
        this.snackBar.open('Error loading sales', 'Close', { duration: 3000 });
        this.loadingSales = false;
      }
    });
  }

  loadExpenses(): void {
    this.loadingExpenses = true;
    this.adminService.getAllExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.loadingExpenses = false;
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
        this.snackBar.open('Error loading expenses', 'Close', { duration: 3000 });
        this.loadingExpenses = false;
      }
    });
  }

  approveUser(user: User): void {
    this.adminService.approveUser(user.id).subscribe({
      next: () => {
        this.snackBar.open(`User ${user.username} approved successfully`, 'Close', { duration: 3000 });
        this.loadUsers(); // Refresh the list
      },
      error: (error) => {
        console.error('Error approving user:', error);
        this.snackBar.open('Error approving user', 'Close', { duration: 3000 });
      }
    });
  }

  deactivateUser(user: User): void {
    this.adminService.deactivateUser(user.id).subscribe({
      next: () => {
        this.snackBar.open(`User ${user.username} deactivated successfully`, 'Close', { duration: 3000 });
        this.loadUsers(); // Refresh the list
      },
      error: (error) => {
        console.error('Error deactivating user:', error);
        this.snackBar.open('Error deactivating user', 'Close', { duration: 3000 });
      }
    });
  }

  getUserStatus(user: User): string {
    if (!user.is_active) return 'Inactive';
    if (!user.is_approved) return 'Pending Approval';
    return 'Active';
  }

  getUserStatusColor(user: User): string {
    if (!user.is_active) return 'warn';
    if (!user.is_approved) return 'accent';
    return 'primary';
  }

  getUserRole(user: User): string {
    return user.is_superuser ? 'Super Admin' : 'Shop Owner';
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }
}