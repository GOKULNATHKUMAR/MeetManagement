import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginError = null;
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.loadCurrentUser().subscribe({
            next: () => {
              this.isLoading = false;
              this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
              this.router.navigate(['/dashboard']);
            },
            error: () => {
              this.isLoading = false;
              this.loginError = 'Unable to load user profile. Please try again.';
              this.snackBar.open(this.loginError, 'Close', { duration: 5000 });
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          const detail = error?.error?.detail || '';
          if (detail === 'Account not approved yet') {
            this.loginError = 'Your account is pending admin approval. Please wait for approval before logging in.';
          } else if (detail === 'Inactive user') {
            this.loginError = 'Your account is inactive. Please contact the administrator.';
          } else {
            this.loginError = 'Login failed. Please check your username and password.';
          }
          if (this.loginError) {
            this.snackBar.open(this.loginError, 'Close', { duration: 5000 });
          }
        }
      });
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}