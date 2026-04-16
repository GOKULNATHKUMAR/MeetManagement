import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.isSuperUser()) {
      return true;
    } else {
      this.snackBar.open('Access denied. Admin privileges required.', 'Close', { duration: 3000 });
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}