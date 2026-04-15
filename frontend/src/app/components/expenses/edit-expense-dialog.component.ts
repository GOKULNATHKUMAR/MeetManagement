import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Expense } from '../../services/expenses.service';

@Component({
  selector: 'app-edit-expense-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Expense</h2>
    <mat-dialog-content>
      <form [formGroup]="expenseForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category</mat-label>
          <input matInput formControlName="category" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Amount (₹)</mat-label>
          <input matInput type="number" step="0.01" formControlName="amount" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="expenseForm.invalid">
        Save Changes
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-actions {
      padding-top: 20px;
    }
  `]
})
export class EditExpenseDialogComponent {
  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Expense,
    private dialogRef: MatDialogRef<EditExpenseDialogComponent>
  ) {
    this.expenseForm = this.fb.group({
      category: [data.category, [Validators.required]],
      amount: [data.amount, [Validators.required, Validators.min(0)]],
      description: [data.description || '']
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.expenseForm.valid) {
      this.dialogRef.close(this.expenseForm.value);
    }
  }
}
