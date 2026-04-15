import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';
import { ExpensesService, Expense, ExpenseCreate, ExpenseUpdate } from '../../services/expenses.service';
import { EditExpenseDialogComponent } from './edit-expense-dialog.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class Expenses implements OnInit {
  expenseForm: FormGroup;
  expenses: Expense[] = [];
  displayedColumns: string[] = ['expense_date', 'category', 'amount', 'description', 'actions'];
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private expensesService: ExpensesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.expenseForm = this.fb.group({
      category: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.isLoading = true;
    this.expensesService.getExpenses(this.currentPage, this.pageSize)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (expenses) => {
          this.expenses = Array.isArray(expenses) ? expenses : [];
          this.totalItems = this.expenses.length;
        },
        error: (error) => {
          console.error('Error loading expenses:', error);
          this.snackBar.open('Error loading expenses', 'Close', { duration: 3000 });
        }
      });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.isSubmitting = true;
      const expenseData: ExpenseCreate = this.expenseForm.value;

      this.expensesService.createExpense(expenseData).subscribe({
        next: (newExpense) => {
          this.snackBar.open('Expense record added successfully', 'Close', { duration: 3000 });
          this.expenseForm.reset();
          this.loadExpenses();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating expense:', error);
          this.snackBar.open('Error adding expense record', 'Close', { duration: 3000 });
          this.isSubmitting = false;
        }
      });
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadExpenses();
  }

  editExpense(expense: Expense) {
    const dialogRef = this.dialog.open(EditExpenseDialogComponent, {
      width: '500px',
      data: { ...expense }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updateData: ExpenseUpdate = result;
        this.expensesService.updateExpense(expense.id, updateData).subscribe({
          next: () => {
            this.snackBar.open('Expense record updated successfully', 'Close', { duration: 3000 });
            this.loadExpenses();
          },
          error: (error) => {
            console.error('Error updating expense:', error);
            this.snackBar.open('Error updating expense record', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteExpense(id: number) {
    if (confirm('Are you sure you want to delete this expense record?')) {
      this.expensesService.deleteExpense(id).subscribe({
        next: () => {
          this.snackBar.open('Expense record deleted successfully', 'Close', { duration: 3000 });
          this.loadExpenses();
        },
        error: (error) => {
          console.error('Error deleting expense:', error);
          this.snackBar.open('Error deleting expense record', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.expenseForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('min')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be positive`;
    }
    return '';
  }
}
