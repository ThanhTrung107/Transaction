import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BillComponent } from '../bill/bill.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, BillComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  username: string | null = null;
  userRole: string | null = null;
  activeMenu = 'overview';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = this.authService.getUsername();
    this.userRole = this.authService.getRole();
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToBill(): void {
    this.setActiveMenu('transactions');
  }
}
