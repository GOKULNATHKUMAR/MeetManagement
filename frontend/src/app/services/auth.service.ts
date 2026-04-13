import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Validate token and get user info
    }
  }

  login(credentials: LoginRequest): Observable<Token> {
    return this.apiService.post<Token>('/auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        // TODO: Get user info after login
      })
    );
  }

  register(userData: any): Observable<User> {
    return this.apiService.post<User>('/auth/register', userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isSuperUser(): boolean {
    const user = this.getCurrentUser();
    return user ? user.is_superuser : false;
  }

  isApproved(): boolean {
    const user = this.getCurrentUser();
    return user ? user.is_approved : false;
  }
}