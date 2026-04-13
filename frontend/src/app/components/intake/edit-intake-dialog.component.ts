import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChickenIntake } from '../../services/intake.service';

@Component({
  selector: 'app-edit-intake-dialog',
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
    <h2 mat-dialog-title>Edit Intake Record</h2>
    <mat-dialog-content>
      <form [formGroup]="intakeForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Supplier</mat-label>
          <input matInput formControlName="supplier" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cost per Unit (₹)</mat-label>
          <input matInput type="number" step="0.01" formControlName="cost_per_unit" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Total Cost (₹)</mat-label>
          <input matInput type="number" step="0.01" formControlName="total_cost" readonly>
          <mat-hint>Auto-calculated from quantity × cost per unit</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Notes (Optional)</mat-label>
          <textarea matInput formControlName="notes" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="intakeForm.invalid">
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
export class EditIntakeDialogComponent {
  intakeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ChickenIntake,
    private dialogRef: MatDialogRef<EditIntakeDialogComponent>
  ) {
    this.intakeForm = this.fb.group({
      quantity: [data.quantity, [Validators.required, Validators.min(1)]],
      supplier: [data.supplier, [Validators.required]],
      cost_per_unit: [data.cost_per_unit, [Validators.required, Validators.min(0)]],
      total_cost: [data.total_cost, [Validators.required, Validators.min(0)]],
      notes: [data.notes || '']
    });

    this.intakeForm.get('quantity')?.valueChanges.subscribe(() => this.calculateTotal());
    this.intakeForm.get('cost_per_unit')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  calculateTotal() {
    const quantity = this.intakeForm.get('quantity')?.value || 0;
    const costPerUnit = this.intakeForm.get('cost_per_unit')?.value || 0;
    const total = quantity * costPerUnit;
    this.intakeForm.get('total_cost')?.setValue(total, { emitEvent: false });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.intakeForm.valid) {
      this.dialogRef.close(this.intakeForm.value);
    }
  }
}
