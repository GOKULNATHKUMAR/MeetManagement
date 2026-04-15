import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { ReportsService, DailyReport, MonthlyReport } from '../../services/reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSelectModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  dailyForm: FormGroup;
  monthlyForm: FormGroup;

  dailyReport: DailyReport | null = null;
  monthlyReport: MonthlyReport | null = null;

  loadingDaily = false;
  loadingMonthly = false;
  downloadingPDF = false;

  displayedIntakeColumns: string[] = ['date', 'supplier', 'quantity', 'cost'];
  displayedSalesColumns: string[] = ['date', 'customer', 'quantity', 'revenue'];
  displayedExpensesColumns: string[] = ['date', 'category', 'amount', 'description'];

  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  years: number[] = [];

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private snackBar: MatSnackBar
  ) {
    this.dailyForm = this.fb.group({
      date: [new Date(), Validators.required]
    });

    this.monthlyForm = this.fb.group({
      month: [new Date().getMonth() + 1, Validators.required],
      year: [new Date().getFullYear(), Validators.required]
    });

    // Generate years from current year back to 5 years ago
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  ngOnInit(): void {}

  generateDailyReport(): void {
    if (this.dailyForm.valid) {
      this.loadingDaily = true;
      const date = this.dailyForm.value.date;
      const dateString = date.toISOString().split('T')[0];

      this.reportsService.getDailyReport(dateString).subscribe({
        next: (report) => {
          this.dailyReport = report;
          this.loadingDaily = false;
        },
        error: (error) => {
          console.error('Error generating daily report:', error);
          this.snackBar.open('Error generating daily report', 'Close', { duration: 3000 });
          this.loadingDaily = false;
        }
      });
    }
  }

  generateMonthlyReport(): void {
    if (this.monthlyForm.valid) {
      this.loadingMonthly = true;
      const { month, year } = this.monthlyForm.value;

      this.reportsService.getMonthlyReport(year, month).subscribe({
        next: (report) => {
          this.monthlyReport = report;
          this.loadingMonthly = false;
        },
        error: (error) => {
          console.error('Error generating monthly report:', error);
          this.snackBar.open('Error generating monthly report', 'Close', { duration: 3000 });
          this.loadingMonthly = false;
        }
      });
    }
  }

  sendDailyReportViaTelegram(): void {
    if (this.dailyForm.valid && this.dailyReport) {
      const date = this.dailyForm.value.date;
      const dateString = date.toISOString().split('T')[0];

      this.reportsService.sendDailyReportViaTelegram(dateString).subscribe({
        next: () => {
          this.snackBar.open('Daily report sent via Telegram', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error sending Telegram report:', error);
          this.snackBar.open('Error sending Telegram report', 'Close', { duration: 3000 });
        }
      });
    }
  }

  downloadMonthlyReportPDF(): void {
    if (this.monthlyForm.valid) {
      this.downloadingPDF = true;
      const { month, year } = this.monthlyForm.value;

      this.reportsService.downloadMonthlyReportPDF(year, month).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `monthly_report_${this.months.find(m => m.value === month)?.name}_${year}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.downloadingPDF = false;
          this.snackBar.open('PDF downloaded successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error downloading PDF:', error);
          this.snackBar.open('Error downloading PDF', 'Close', { duration: 3000 });
          this.downloadingPDF = false;
        }
      });
    }
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }
}