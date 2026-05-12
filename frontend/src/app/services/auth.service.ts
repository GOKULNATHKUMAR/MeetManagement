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
  telegram_bot_token?: string;
  telegram_chat_id?: string;
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
      this.loadCurrentUser();
    }
  }

  login(credentials: LoginRequest): Observable<Token> {
    return this.apiService.post<Token>('/auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
      })
    );
  }

  loadCurrentUser(): Observable<User> {
    const user$ = this.apiService.get<User>('/auth/me');
    user$.subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.currentUserSubject.next(null)
    });
    return user$;
  }

  register(userData: any): Observable<User> {
    return this.apiService.post<User>('/auth/register', userData);
  }

  updateUser(userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>('/auth/me', userData).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
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