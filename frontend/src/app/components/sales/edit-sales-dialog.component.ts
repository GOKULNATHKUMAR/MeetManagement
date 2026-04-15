import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChickenSale } from '../../services/sales.service';

@Component({
  selector: 'app-edit-sales-dialog',
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
    <h2 mat-dialog-title>Edit Sales Record</h2>
    <mat-dialog-content>
      <form [formGroup]="saleForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Customer Name</mat-label>
          <input matInput formControlName="customer_name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Price per Unit (₹)</mat-label>
          <input matInput type="number" step="0.01" formControlName="price_per_unit" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Total Revenue (₹)</mat-label>
          <input matInput type="number" step="0.01" formControlName="total_revenue" readonly>
          <mat-hint>Auto-calculated from quantity × price per unit</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Notes (Optional)</mat-label>
          <textarea matInput formControlName="notes" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="saleForm.invalid">
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
export class EditSalesDialogComponent {
  saleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ChickenSale,
    private dialogRef: MatDialogRef<EditSalesDialogComponent>
  ) {
    this.saleForm = this.fb.group({
      quantity: [data.quantity, [Validators.required, Validators.min(1)]],
      customer_name: [data.customer_name, [Validators.required]],
      price_per_unit: [data.price_per_unit, [Validators.required, Validators.min(0)]],
      total_revenue: [data.total_revenue, [Validators.required, Validators.min(0)]],
      notes: [data.notes || '']
    });

    this.saleForm.get('quantity')?.valueChanges.subscribe(() => this.calculateTotal());
    this.saleForm.get('price_per_unit')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  calculateTotal() {
    const quantity = this.saleForm.get('quantity')?.value || 0;
    const pricePerUnit = this.saleForm.get('price_per_unit')?.value || 0;
    const total = quantity * pricePerUnit;
    this.saleForm.get('total_revenue')?.setValue(total, { emitEvent: false });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.saleForm.valid) {
      this.dialogRef.close(this.saleForm.value);
    }
  }
}
