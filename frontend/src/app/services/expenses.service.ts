import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Expense {
  id: number;
  category: string;
  amount: number;
  description?: string;
  expense_date: string;
  owner_id: number;
  created_at: string;
  updated_at?: string;
}

export interface ExpenseCreate {
  category: string;
  amount: number;
  description?: string;
  expense_date?: string;
}

export interface ExpenseUpdate {
  category?: string;
  amount?: number;
  description?: string;
  expense_date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private baseUrl = '/expenses';

  constructor(private apiService: ApiService) { }

  getExpenses(page: number = 1, limit: number = 10): Observable<Expense[]> {
    return this.apiService.get<Expense[]>(`${this.baseUrl}/?skip=${(page-1)*limit}&limit=${limit}`);
  }

  getExpense(id: number): Observable<Expense> {
    return this.apiService.get<Expense>(`${this.baseUrl}/${id}`);
  }

  createExpense(expense: ExpenseCreate): Observable<Expense> {
    return this.apiService.post<Expense>(`${this.baseUrl}/`, expense);
  }

  updateExpense(id: number, expense: ExpenseUpdate): Observable<Expense> {
    return this.apiService.put<Expense>(`${this.baseUrl}/${id}`, expense);
  }

  deleteExpense(id: number): Observable<any> {
    return this.apiService.delete(`${this.baseUrl}/${id}`);
  }
}
