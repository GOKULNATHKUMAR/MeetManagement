import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface DailyReport {
  date: string;
  total_intake: number;
  total_sales: number;
  total_expenses: number;
  profit_loss: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  total_intake: number;
  total_sales: number;
  total_expenses: number;
  profit_loss: number;
  intake_details: Array<{
    date: string;
    supplier: string;
    quantity: number;
    cost: number;
  }>;
  sales_details: Array<{
    date: string;
    customer: string;
    quantity: number;
    revenue: number;
  }>;
  expenses_details: Array<{
    date: string;
    category: string;
    amount: number;
    description: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private apiService: ApiService) { }

  getDailyReport(date: string): Observable<DailyReport> {
    return this.apiService.get<DailyReport>(`/reports/daily/${date}`);
  }

  getMonthlyReport(year: number, month: number): Observable<MonthlyReport> {
    return this.apiService.get<MonthlyReport>(`/reports/monthly/${year}/${month}`);
  }

  sendDailyReportViaTelegram(date: string): Observable<any> {
    return this.apiService.post(`/reports/daily/telegram/${date}`, {});
  }

  downloadMonthlyReportPDF(year: number, month: number): Observable<Blob> {
    return this.apiService.getBlob(`/reports/monthly/pdf/${year}/${month}`);
  }
}