import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserBasic {
  id: number;
  full_name: string;
  email: string;
  username: string;
}

export interface ChickenIntakeWithOwner {
  id: number;
  owner_id: number;
  owner: UserBasic;
  quantity: number;
  supplier: string;
  cost_per_unit: number;
  total_cost: number;
  intake_date: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ChickenSaleWithOwner {
  id: number;
  owner_id: number;
  owner: UserBasic;
  quantity: number;
  price_per_unit: number;
  total_revenue: number;
  customer_name?: string;
  sale_date: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ExpenseWithOwner {
  id: number;
  owner_id: number;
  owner: UserBasic;
  category: string;
  amount: number;
  description?: string;
  expense_date: string;
  created_at: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private apiService: ApiService) { }

  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/admin/users');
  }

  approveUser(userId: number): Observable<any> {
    return this.apiService.put(`/admin/users/${userId}/approve`, {});
  }

  deactivateUser(userId: number): Observable<any> {
    return this.apiService.put(`/admin/users/${userId}/deactivate`, {});
  }

  activateUser(userId: number): Observable<any> {
    return this.apiService.put(`/admin/users/${userId}/activate`, {});
  }

  getAllIntakes(userId?: number): Observable<ChickenIntakeWithOwner[]> {
    const query = userId ? `?owner_id=${userId}` : '';
    return this.apiService.get<ChickenIntakeWithOwner[]>(`/admin/intakes/all${query}`);
  }

  getAllSales(userId?: number): Observable<ChickenSaleWithOwner[]> {
    const query = userId ? `?owner_id=${userId}` : '';
    return this.apiService.get<ChickenSaleWithOwner[]>(`/admin/sales/all${query}`);
  }

  getAllExpenses(userId?: number): Observable<ExpenseWithOwner[]> {
    const query = userId ? `?owner_id=${userId}` : '';
    return this.apiService.get<ExpenseWithOwner[]>(`/admin/expenses/all${query}`);
  }
}