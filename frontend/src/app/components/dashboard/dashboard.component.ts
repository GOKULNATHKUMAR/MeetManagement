import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isSuperUser = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isSuperUser = this.authService.isSuperUser();
  }

  navigateToIntake(): void {
    this.router.navigate(['/intake']);
  }

  navigateToSales(): void {
    this.router.navigate(['/sales']);
  }

  navigateToExpenses(): void {
    this.router.navigate(['/expenses']);
  }

  navigateToReports(): void {
    this.router.navigate(['/reports']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToAdmin(): void {
    if (this.isSuperUser) {
      this.router.navigate(['/admin']);
    }
  }
}