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
import { SalesService, ChickenSale, SaleCreate, SaleUpdate } from '../../services/sales.service';
import { EditSalesDialogComponent } from './edit-sales-dialog.component';

@Component({
  selector: 'app-sales',
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
  templateUrl: './sales.html',
  styleUrl: './sales.scss',
})
export class Sales implements OnInit {
  saleForm: FormGroup;
  sales: ChickenSale[] = [];
  displayedColumns: string[] = ['sale_date', 'customer_name', 'quantity', 'price_per_unit', 'total_revenue', 'notes', 'actions'];
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.saleForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(1)]],
      customer_name: ['', [Validators.required]],
      price_per_unit: ['', [Validators.required, Validators.min(0)]],
      total_revenue: ['', [Validators.required, Validators.min(0)]],
      notes: ['']
    });

    this.saleForm.get('quantity')?.valueChanges.subscribe(() => this.calculateTotal());
    this.saleForm.get('price_per_unit')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  ngOnInit() {
    this.loadSales();
  }

  calculateTotal() {
    const quantity = this.saleForm.get('quantity')?.value || 0;
    const pricePerUnit = this.saleForm.get('price_per_unit')?.value || 0;
    const total = quantity * pricePerUnit;
    this.saleForm.get('total_revenue')?.setValue(total, { emitEvent: false });
  }

  loadSales() {
    console.log('loadSales: start');
    this.isLoading = true;
    this.salesService.getSales(this.currentPage, this.pageSize)
      .pipe(finalize(() => {
        console.log('loadSales: finalize');
        this.isLoading = false;
      }))
      .subscribe({
        next: (sales) => {
          console.log('loadSales: success', sales);
          this.sales = Array.isArray(sales) ? sales : [];
          this.totalItems = this.sales.length;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading sales:', error);
          this.snackBar.open('Error loading sales', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  onSubmit() {
    if (this.saleForm.valid) {
      this.isSubmitting = true;
      const saleData: SaleCreate = this.saleForm.value;

      this.salesService.createSale(saleData).subscribe({
        next: (newSale) => {
          this.snackBar.open('Sale record added successfully', 'Close', { duration: 3000 });
          this.saleForm.reset();
          this.loadSales();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating sale:', error);
          this.snackBar.open('Error adding sale record', 'Close', { duration: 3000 });
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
    this.loadSales();
  }

  editSale(sale: ChickenSale) {
    const dialogRef = this.dialog.open(EditSalesDialogComponent, {
      width: '500px',
      data: { ...sale }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updateData: SaleUpdate = result;
        this.salesService.updateSale(sale.id, updateData).subscribe({
          next: () => {
            this.snackBar.open('Sale record updated successfully', 'Close', { duration: 3000 });
            this.loadSales();
          },
          error: (error) => {
            console.error('Error updating sale:', error);
            this.snackBar.open('Error updating sale record', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteSale(id: number) {
    if (confirm('Are you sure you want to delete this sale record?')) {
      this.salesService.deleteSale(id).subscribe({
        next: () => {
          this.snackBar.open('Sale record deleted successfully', 'Close', { duration: 3000 });
          this.loadSales();
        },
        error: (error) => {
          console.error('Error deleting sale:', error);
          this.snackBar.open('Error deleting sale record', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.saleForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('min')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be positive`;
    }
    return '';
  }
}
