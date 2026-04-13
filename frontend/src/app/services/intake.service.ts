import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface ChickenIntake {
  id: number;
  quantity: number;
  supplier: string;
  cost_per_unit: number;
  total_cost: number;
  intake_date: string;
  notes?: string;
  owner_id: number;
  created_at: string;
  updated_at?: string;
}

export interface IntakeCreate {
  quantity: number;
  supplier: string;
  cost_per_unit: number;
  total_cost: number;
  intake_date?: string;
  notes?: string;
}

export interface IntakeUpdate {
  quantity?: number;
  supplier?: string;
  cost_per_unit?: number;
  total_cost?: number;
  intake_date?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IntakeService {
  private baseUrl = '/intake';

  constructor(private apiService: ApiService) { }

  // Get all intakes with pagination
  getIntakes(page: number = 1, limit: number = 10): Observable<ChickenIntake[]> {
    return this.apiService.get<ChickenIntake[]>(`${this.baseUrl}/?skip=${(page-1)*limit}&limit=${limit}`);
  }

  // Get specific intake
  getIntake(id: number): Observable<ChickenIntake> {
    return this.apiService.get<ChickenIntake>(`${this.baseUrl}/${id}`);
  }

  // Create new intake
  createIntake(intake: IntakeCreate): Observable<ChickenIntake> {
    return this.apiService.post<ChickenIntake>(`${this.baseUrl}/`, intake);
  }

  // Update intake
  updateIntake(id: number, intake: IntakeUpdate): Observable<ChickenIntake> {
    return this.apiService.put<ChickenIntake>(`${this.baseUrl}/${id}`, intake);
  }

  // Delete intake
  deleteIntake(id: number): Observable<any> {
    return this.apiService.delete(`${this.baseUrl}/${id}`);
  }
}