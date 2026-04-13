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
import { IntakeService, ChickenIntake, IntakeCreate, IntakeUpdate } from '../../services/intake.service';
import { EditIntakeDialogComponent } from './edit-intake-dialog.component';

@Component({
  selector: 'app-intake',
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
  templateUrl: './intake.html',
  styleUrl: './intake.scss',
})
export class Intake implements OnInit {
  intakeForm: FormGroup;
  intakes: ChickenIntake[] = [];
  displayedColumns: string[] = ['intake_date', 'supplier', 'quantity', 'cost_per_unit', 'total_cost', 'notes', 'actions'];
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private intakeService: IntakeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.intakeForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(1)]],
      supplier: ['', [Validators.required]],
      cost_per_unit: ['', [Validators.required, Validators.min(0)]],
      total_cost: ['', [Validators.required, Validators.min(0)]],
      notes: ['']
    });

    // Auto-calculate total cost when quantity or cost_per_unit changes
    this.intakeForm.get('quantity')?.valueChanges.subscribe(() => this.calculateTotal());
    this.intakeForm.get('cost_per_unit')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  ngOnInit() {
    this.loadIntakes();
  }

  calculateTotal() {
    const quantity = this.intakeForm.get('quantity')?.value || 0;
    const costPerUnit = this.intakeForm.get('cost_per_unit')?.value || 0;
    const total = quantity * costPerUnit;
    this.intakeForm.get('total_cost')?.setValue(total, { emitEvent: false });
  }

  loadIntakes() {
    console.log('loadIntakes: start');
    this.isLoading = true;
    this.intakeService.getIntakes(this.currentPage, this.pageSize)
      .pipe(finalize(() => {
        console.log('loadIntakes: finalize');
        this.isLoading = false;
      }))
      .subscribe({
        next: (intakes) => {
          console.log('loadIntakes: success', intakes);
          this.intakes = Array.isArray(intakes) ? intakes : [];
          this.totalItems = this.intakes.length;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading intakes:', error);
          this.snackBar.open('Error loading intakes', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  onSubmit() {
    if (this.intakeForm.valid) {
      this.isSubmitting = true;
      const intakeData: IntakeCreate = this.intakeForm.value;

      this.intakeService.createIntake(intakeData).subscribe({
        next: (newIntake) => {
          this.snackBar.open('Intake record added successfully', 'Close', { duration: 3000 });
          this.intakeForm.reset();
          this.loadIntakes(); // Refresh the list
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating intake:', error);
          this.snackBar.open('Error adding intake record', 'Close', { duration: 3000 });
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
    this.loadIntakes();
  }

  deleteIntake(id: number) {
    if (confirm('Are you sure you want to delete this intake record?')) {
      this.intakeService.deleteIntake(id).subscribe({
        next: () => {
          this.snackBar.open('Intake record deleted successfully', 'Close', { duration: 3000 });
          this.loadIntakes();
        },
        error: (error) => {
          console.error('Error deleting intake:', error);
          this.snackBar.open('Error deleting intake record', 'Close', { duration: 3000 });
        }
      });
    }
  }

  editIntake(intake: ChickenIntake) {
    const dialogRef = this.dialog.open(EditIntakeDialogComponent, {
      width: '500px',
      data: { ...intake }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updateData: IntakeUpdate = result;
        this.intakeService.updateIntake(intake.id, updateData).subscribe({
          next: () => {
            this.snackBar.open('Intake record updated successfully', 'Close', { duration: 3000 });
            this.loadIntakes();
          },
          error: (error) => {
            console.error('Error updating intake:', error);
            this.snackBar.open('Error updating intake record', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.intakeForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('min')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be positive`;
    }
    return '';
  }
}
