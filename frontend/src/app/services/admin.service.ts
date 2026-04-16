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

  getAllIntakes(): Observable<any[]> {
    return this.apiService.get<any[]>('/admin/intakes/all');
  }

  getAllSales(): Observable<any[]> {
    return this.apiService.get<any[]>('/admin/sales/all');
  }

  getAllExpenses(): Observable<any[]> {
    return this.apiService.get<any[]>('/admin/expenses/all');
  }
}