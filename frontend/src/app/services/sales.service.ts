import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface ChickenSale {
  id: number;
  quantity: number;
  customer_name: string;
  price_per_unit: number;
  total_revenue: number;
  sale_date: string;
  notes?: string;
  owner_id: number;
  created_at: string;
  updated_at?: string;
}

export interface SaleCreate {
  quantity: number;
  customer_name: string;
  price_per_unit: number;
  total_revenue: number;
  sale_date?: string;
  notes?: string;
}

export interface SaleUpdate {
  quantity?: number;
  customer_name?: string;
  price_per_unit?: number;
  total_revenue?: number;
  sale_date?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private baseUrl = '/sales';

  constructor(private apiService: ApiService) { }

  // Get all sales with pagination
  getSales(page: number = 1, limit: number = 10): Observable<ChickenSale[]> {
    return this.apiService.get<ChickenSale[]>(`${this.baseUrl}/?skip=${(page-1)*limit}&limit=${limit}`);
  }

  // Get specific sale
  getSale(id: number): Observable<ChickenSale> {
    return this.apiService.get<ChickenSale>(`${this.baseUrl}/${id}`);
  }

  // Create new sale
  createSale(sale: SaleCreate): Observable<ChickenSale> {
    return this.apiService.post<ChickenSale>(`${this.baseUrl}/`, sale);
  }

  // Update sale
  updateSale(id: number, sale: SaleUpdate): Observable<ChickenSale> {
    return this.apiService.put<ChickenSale>(`${this.baseUrl}/${id}`, sale);
  }

  // Delete sale
  deleteSale(id: number): Observable<any> {
    return this.apiService.delete(`${this.baseUrl}/${id}`);
  }
}
