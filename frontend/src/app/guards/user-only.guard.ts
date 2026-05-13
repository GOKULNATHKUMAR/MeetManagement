import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserOnlyGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (this.authService.isSuperUser()) {
      // Super admin should use admin panel for data management
      this.snackBar.open('Super admins should use the Admin Panel to manage user data', 'Go to Admin', {
        duration: 5000
      }).onAction().subscribe(() => {
        this.router.navigate(['/admin']);
      });
      this.router.navigate(['/admin']);
      return false;
    }

    return true;
  }
}